/**
 * LLFG Portal — Email Sending API
 * Reuses existing SendGrid setup from send-code.js
 *
 * Endpoints (via POST body { action }):
 *   send          — Send email immediately
 *   send-template — Send using LLFG branded template
 *   send-credentials — Send account credentials to new agent
 *
 * ENV: SENDGRID_API_KEY
 */

const https = require('https');

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function res(code, body) {
  return { statusCode: code, headers: HEADERS, body: JSON.stringify(body) };
}

function llfgWrap(title, bodyHtml) {
  return '<!DOCTYPE html><html><body style="background:#0a0a0a;font-family:Arial,sans-serif;margin:0;padding:40px 20px;">'
    + '<div style="max-width:560px;margin:0 auto;background:#111;border:1px solid rgba(201,168,76,0.25);">'
    + '<div style="background:#c9a84c;height:4px;"></div>'
    + '<div style="padding:32px;">'
    + '<div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;margin-bottom:4px;">Legacy Life Financial Group</div>'
    + '<h2 style="color:#fff;font-size:20px;font-weight:300;margin:0 0 20px;">' + title + '</h2>'
    + bodyHtml
    + '</div>'
    + '<div style="background:rgba(201,168,76,0.05);padding:12px 32px;border-top:1px solid rgba(201,168,76,0.08);">'
    + '<div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,0.35);">Confidential &middot; Legacy Life Financial Group &middot; llfg.us</div>'
    + '</div></div></body></html>';
}

function sendViaSendGrid(to, subject, html, from) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) return reject(new Error('SENDGRID_API_KEY not set'));

    const payload = JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from || 'noreply@llfg.us', name: 'Legacy Life Financial Group' },
      subject: subject,
      content: [{ type: 'text/html', value: html }]
    });

    const options = {
      hostname: 'api.sendgrid.com',
      path: '/v3/mail/send',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (r) => {
      if (r.statusCode >= 200 && r.statusCode < 300) resolve({ success: true });
      else {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => reject(new Error('SendGrid ' + r.statusCode + ': ' + d)));
      }
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return res(200, {});
  if (event.httpMethod !== 'POST') return res(405, { error: 'POST only' });

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    if (!process.env.SENDGRID_API_KEY) {
      return res(200, {
        success: false,
        mode: 'client',
        message: 'SENDGRID_API_KEY not set — falling back to mailto. Set it in Netlify env vars.'
      });
    }

    switch (action || 'send') {
      case 'send': {
        const { to, subject, html, text } = body;
        if (!to || !subject) return res(400, { error: 'to and subject required' });

        const emailHtml = html || llfgWrap(subject, '<p style="color:#ccc;font-size:14px;line-height:1.7;">' + (text || '').replace(/\n/g, '<br>') + '</p>');
        await sendViaSendGrid(to, subject, emailHtml, body.from);
        return res(200, { success: true, message: 'Email sent to ' + to });
      }

      case 'send-template': {
        const { to, subject, templateBody, senderName } = body;
        if (!to || !subject || !templateBody) return res(400, { error: 'to, subject, and templateBody required' });

        const html = llfgWrap(subject,
          '<div style="color:#ccc;font-size:14px;line-height:1.8;white-space:pre-wrap;">' + templateBody + '</div>'
          + (senderName ? '<div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);"><div style="font-size:13px;color:#c9a84c;">' + senderName + '</div><div style="font-size:11px;color:#666;">Licensed Insurance Agent | Legacy Life Financial Group</div></div>' : '')
        );
        await sendViaSendGrid(to, subject, html, body.from);
        return res(200, { success: true, message: 'Template sent to ' + to });
      }

      case 'send-credentials': {
        const { to, name, llfgEmail, password, role, portalUrl } = body;
        if (!to || !llfgEmail) return res(400, { error: 'to and llfgEmail required' });

        const roleNames = { financial_advisor: 'Financial Advisor', manager: 'Manager', executive: 'Executive', managing_partner: 'Managing Partner', admin: 'Admin' };
        const roleName = roleNames[role] || role || 'Financial Advisor';

        const html = llfgWrap('Welcome to Legacy Life Financial Group',
          '<p style="color:#ccc;font-size:14px;line-height:1.7;">Hi ' + (name || 'Agent') + ',</p>'
          + '<p style="color:#ccc;font-size:14px;line-height:1.7;">Your agent portal account has been created. Here are your login credentials:</p>'
          + '<div style="background:#0e0e0e;border:1px solid rgba(201,168,76,0.2);padding:20px;margin:20px 0;">'
          + '<div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Portal</span><span style="color:#c9a84c;font-size:14px;">' + (portalUrl || 'llfg.org') + '</span></div>'
          + '<div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Email</span><span style="color:#fff;font-size:14px;">' + llfgEmail + '</span></div>'
          + '<div style="display:flex;justify-content:space-between;margin-bottom:12px;"><span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Password</span><span style="color:#fff;font-size:14px;">' + (password || 'welcome123') + '</span></div>'
          + '<div style="display:flex;justify-content:space-between;"><span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Role</span><span style="color:#c9a84c;font-size:14px;">' + roleName + '</span></div>'
          + '</div>'
          + '<p style="color:#888;font-size:12px;line-height:1.6;">Please change your password after your first login. Your Google Workspace password will be sent separately by your admin.</p>'
        );
        await sendViaSendGrid(to, 'Your LLFG Portal Credentials — ' + roleName, html);
        return res(200, { success: true, message: 'Credentials sent to ' + to });
      }

      default:
        return res(400, { error: 'Unknown action: ' + action });
    }

  } catch (err) {
    console.error('send-email error:', err);
    return res(500, { error: err.message || 'Failed to send' });
  }
};
