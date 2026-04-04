/**
 * LLFG Portal — Google Workspace User Creation
 * Creates @llfg.us email accounts via Google Admin SDK
 *
 * Endpoints (via POST body { action }):
 *   create-user  — Create a new @llfg.us Google Workspace account
 *   list-users   — List workspace users
 *   suspend-user — Suspend a user account
 *
 * ENV: GOOGLE_SA_KEY (base64-encoded service account JSON)
 *      GOOGLE_ADMIN_EMAIL (admin email to impersonate, e.g. lorenzoparenza@llfg.us)
 */

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function res(code, body) {
  return { statusCode: code, headers: HEADERS, body: JSON.stringify(body) };
}

async function getAdminClient() {
  const saKeyB64 = process.env.GOOGLE_SA_KEY;
  const adminEmail = process.env.GOOGLE_ADMIN_EMAIL;
  if (!saKeyB64 || !adminEmail) return null;

  const { google } = require('googleapis');
  const saKey = JSON.parse(Buffer.from(saKeyB64, 'base64').toString('utf8'));

  const auth = new google.auth.JWT({
    email: saKey.client_email,
    key: saKey.private_key,
    scopes: ['https://www.googleapis.com/auth/admin.directory.user'],
    subject: adminEmail
  });

  return google.admin({ version: 'directory_v1', auth });
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return res(200, {});
  if (event.httpMethod !== 'POST') return res(405, { error: 'POST only' });

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;
    const admin = await getAdminClient();

    if (!admin) {
      return res(200, {
        success: false,
        mode: 'manual',
        message: 'Google Admin SDK not configured. Set GOOGLE_SA_KEY and GOOGLE_ADMIN_EMAIL in Netlify env vars. Opening admin console instead.',
        fallbackUrl: 'https://admin.google.com/ac/users/new'
          + (body.firstName ? '?firstName=' + encodeURIComponent(body.firstName) : '')
          + (body.lastName ? '&lastName=' + encodeURIComponent(body.lastName) : '')
          + (body.username ? '&username=' + encodeURIComponent(body.username) : '')
      });
    }

    switch (action) {
      case 'create-user': {
        const { firstName, lastName, username, password, orgUnit } = body;
        if (!firstName || !lastName || !username) return res(400, { error: 'firstName, lastName, username required' });

        const result = await admin.users.insert({
          requestBody: {
            primaryEmail: username + '@llfg.us',
            name: { givenName: firstName, familyName: lastName },
            password: password || 'LLFGwelcome2026!',
            changePasswordAtNextLogin: true,
            orgUnitPath: orgUnit || '/Agents'
          }
        });

        return res(200, {
          success: true,
          email: result.data.primaryEmail,
          message: firstName + ' ' + lastName + ' — ' + username + '@llfg.us created in Google Workspace'
        });
      }

      case 'list-users': {
        const result = await admin.users.list({
          domain: 'llfg.us',
          maxResults: 100,
          orderBy: 'familyName'
        });

        const users = (result.data.users || []).map(u => ({
          email: u.primaryEmail,
          name: (u.name.fullName || u.name.givenName + ' ' + u.name.familyName),
          suspended: u.suspended,
          lastLogin: u.lastLoginTime,
          created: u.creationTime
        }));

        return res(200, { success: true, users });
      }

      case 'suspend-user': {
        const { email } = body;
        if (!email) return res(400, { error: 'email required' });

        await admin.users.update({
          userKey: email,
          requestBody: { suspended: true }
        });

        return res(200, { success: true, message: email + ' suspended' });
      }

      default:
        return res(400, { error: 'Unknown action: ' + action });
    }

  } catch (err) {
    console.error('google-workspace error:', err);
    return res(500, { error: err.message || 'Google API error' });
  }
};
