const https = require('https');

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendEmail(to, code) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) return reject(new Error('SENDGRID_API_KEY not set'));

    const html = '<!DOCTYPE html><html><body style="background:#0a0a0a;font-family:Arial,sans-serif;margin:0;padding:40px 20px;">'
      + '<div style="max-width:480px;margin:0 auto;background:#111;border:1px solid rgba(201,168,76,0.25);">'
      + '<div style="background:#c9a84c;height:4px;"></div>'
      + '<div style="padding:36px 32px;">'
      + '<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;margin-bottom:6px;">Legacy Life Financial Group</div>'
      + '<h2 style="color:#fff;font-size:22px;font-weight:300;margin:0 0 24px;">Your login verification code</h2>'
      + '<div style="background:#0e0e0e;border:1px solid rgba(201,168,76,0.2);padding:20px;text-align:center;margin-bottom:24px;">'
      + '<div style="font-size:42px;font-weight:700;letter-spacing:12px;color:#c9a84c;font-family:monospace;">' + code + '</div>'
      + '<div style="font-size:12px;color:#666;margin-top:8px;letter-spacing:1px;">EXPIRES IN 5 MINUTES</div>'
      + '</div>'
      + '<p style="color:#888;font-size:13px;line-height:1.6;margin:0 0 16px;">Enter this code to complete your sign-in to the LLFG Agent Portal.</p>'
      + '<p style="color:#555;font-size:12px;margin:0;">Did not attempt to log in? Contact lorenzoparenza@llfg.us immediately.</p>'
      + '</div>'
      + '<div style="background:rgba(201,168,76,0.05);padding:12px 32px;border-top:1px solid rgba(201,168,76,0.08);">'
      + '<div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,0.35);">Secure - Encrypted - Legacy Life Financial Group</div>'
      + '</div></div></body></html>';

    const payload = JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'noreply@llfg.us', name: 'Legacy Life Financial Group' },
      subject: 'Your LLFG Portal Login Code',
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

    const req = https.request(options, function(res) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve({ success: true });
      } else {
        let data = '';
        res.on('data', function(chunk) { data += chunk; });
        res.on('end', function() { reject(new Error('SendGrid error ' + res.statusCode + ': ' + data)); });
      }
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email;

    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Valid email required' }) };
    }

    const code = generateCode();
    const expires = Date.now() + 5 * 60 * 1000;

    await sendEmail(email, code);

    const token = Buffer.from(JSON.stringify({
      email: email.toLowerCase(),
      code: code,
      expires: expires
    })).toString('base64');

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ success: true, token: token, message: 'Code sent to ' + email })
    };

  } catch (err) {
    console.error('send-code error:', err);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: err.message || 'Failed to send code' })
    };
  }
};
