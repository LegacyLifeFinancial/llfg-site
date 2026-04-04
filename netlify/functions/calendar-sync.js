/**
 * LLFG Portal — Google Calendar Sync
 * Two-way sync between portal calendar and Google Calendar
 *
 * Endpoints (via POST body { action }):
 *   create-event — Create Google Calendar event with invite
 *   list-events  — Fetch events for a date range
 *   delete-event — Remove a Google Calendar event
 *
 * ENV: GOOGLE_SA_KEY (base64-encoded service account JSON)
 *      GOOGLE_ADMIN_EMAIL (admin email to impersonate)
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

async function getCalClient(userEmail) {
  const saKeyB64 = process.env.GOOGLE_SA_KEY;
  if (!saKeyB64) return null;

  const { google } = require('googleapis');
  const saKey = JSON.parse(Buffer.from(saKeyB64, 'base64').toString('utf8'));

  const auth = new google.auth.JWT({
    email: saKey.client_email,
    key: saKey.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject: userEmail || process.env.GOOGLE_ADMIN_EMAIL
  });

  return google.calendar({ version: 'v3', auth });
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return res(200, {});
  if (event.httpMethod !== 'POST') return res(405, { error: 'POST only' });

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;
    const cal = await getCalClient(body.userEmail);

    if (!cal) {
      return res(200, {
        success: false,
        mode: 'local',
        message: 'Google Calendar API not configured — using local calendar. Set GOOGLE_SA_KEY in Netlify env vars to enable sync.'
      });
    }

    switch (action) {
      case 'create-event': {
        const { title, description, location, startDateTime, endDateTime, guestEmail, guestName } = body;
        if (!title || !startDateTime || !endDateTime) return res(400, { error: 'title, startDateTime, endDateTime required' });

        const eventBody = {
          summary: title + ' | Legacy Life Financial Group',
          description: (description || '') + '\n\nScheduled via LLFG Portal',
          location: location || '',
          start: { dateTime: startDateTime, timeZone: 'America/Chicago' },
          end: { dateTime: endDateTime, timeZone: 'America/Chicago' },
          attendees: guestEmail ? [{ email: guestEmail, displayName: guestName || guestEmail }] : [],
          reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 15 }, { method: 'email', minutes: 60 }] }
        };

        const result = await cal.events.insert({
          calendarId: 'primary',
          requestBody: eventBody,
          sendUpdates: guestEmail ? 'all' : 'none'
        });

        return res(200, {
          success: true,
          eventId: result.data.id,
          htmlLink: result.data.htmlLink,
          message: 'Event created' + (guestEmail ? ' — invite sent to ' + guestEmail : '')
        });
      }

      case 'list-events': {
        const { timeMin, timeMax } = body;
        const now = new Date().toISOString();

        const result = await cal.events.list({
          calendarId: 'primary',
          timeMin: timeMin || now,
          timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          maxResults: 50,
          singleEvents: true,
          orderBy: 'startTime'
        });

        const events = (result.data.items || []).map(e => ({
          id: e.id,
          title: e.summary,
          start: e.start.dateTime || e.start.date,
          end: e.end.dateTime || e.end.date,
          location: e.location,
          description: e.description,
          attendees: (e.attendees || []).map(a => ({ email: a.email, status: a.responseStatus })),
          htmlLink: e.htmlLink
        }));

        return res(200, { success: true, events });
      }

      case 'delete-event': {
        const { eventId } = body;
        if (!eventId) return res(400, { error: 'eventId required' });

        await cal.events.delete({ calendarId: 'primary', eventId });
        return res(200, { success: true, message: 'Event deleted' });
      }

      default:
        return res(400, { error: 'Unknown action: ' + action });
    }

  } catch (err) {
    console.error('calendar-sync error:', err);
    return res(500, { error: err.message || 'Calendar API error' });
  }
};
