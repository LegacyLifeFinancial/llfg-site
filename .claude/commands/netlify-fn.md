Scaffold or modify a Netlify Function for the LLFG portal. These serverless functions provide the backend API that the portal's frontend calls.

The user will describe what the function should do. You must:

## 1. Function Location
All functions go in `/netlify/functions/[name].js`
- Create the directory if it doesn't exist
- Use CommonJS (`exports.handler`) for Netlify compatibility
- Each function becomes an API endpoint at `/.netlify/functions/[name]`

## 2. Standard Function Template
Every function must follow this pattern:
```javascript
exports.handler = async (event, context) => {
  // CORS headers for portal access
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Function logic here
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
```

## 3. Environment Variables
- NEVER hardcode API keys in function files
- Reference via `process.env.VARIABLE_NAME`
- Document which env vars are needed so admin can set them in Netlify dashboard
- Common vars: SENDGRID_API_KEY, GOOGLE_SERVICE_ACCOUNT_KEY, SUPABASE_URL, SUPABASE_KEY

## 4. Frontend Integration
After creating the function, update index.html to call it:
```javascript
const response = await fetch('/.netlify/functions/[name]', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ /* data */ })
});
const result = await response.json();
```
- Replace the existing client-side stub with the real API call
- Add loading states and error handling
- Keep the existing UI — only change the data layer

## 5. Available Service Integrations
When the user asks for a specific integration, use these:
- **Email**: SendGrid (`@sendgrid/mail`) or Resend (`resend`)
- **Database**: Supabase (`@supabase/supabase-js`) or Firebase
- **Google Workspace**: Google Admin SDK (`googleapis`)
- **Google Calendar**: Google Calendar API (`googleapis`)
- **File Storage**: Netlify Blobs or Supabase Storage

## 6. Testing
- Provide a curl command to test the function locally
- Note: `netlify dev` runs functions locally at `http://localhost:8888/.netlify/functions/[name]`

## Output
1. The complete function file
2. Any npm dependencies needed (`netlify/functions/package.json`)
3. Environment variables to configure in Netlify dashboard
4. The frontend code changes to wire it up
5. A curl command for testing