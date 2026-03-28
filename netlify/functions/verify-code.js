// netlify/functions/verify-code.js
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { token, userCode } = JSON.parse(event.body || '{}');

    if (!token || !userCode) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Token and code required' }) };
    }

    let payload;
    try {
      payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    const { code, expires } = payload;

    if (Date.now() > expires) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Code expired. Please request a new one.' })
      };
    }

    if (userCode.trim() !== code) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Incorrect code. Please try again.' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Verification successful',
        email: payload.email
      })
    };

  } catch (err) {
    console.error('verify-code error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Verification failed' })
    };
  }
};
