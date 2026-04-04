Automate a currently client-side feature in the LLFG portal by wiring it to a real backend service. This skill replaces demo/stub functionality with production-ready integrations.

The user will name a feature. Identify what's currently client-side, then build the full stack: Netlify Function + external service + frontend wiring.

## Automatable Features

| Feature | Current Stub | Backend Needed |
|---------|-------------|----------------|
| **accounts** | In-memory USERS object | Supabase/Firebase auth + user table |
| **email-send** | mailto: links | SendGrid or Resend API |
| **google-workspace** | Opens admin.google.com manually | Google Admin SDK (Directory API) |
| **calendar-sync** | localStorage portalCalEvents | Google Calendar API |
| **deals** | In-memory myDeals array | Supabase deals table |
| **commissions** | Hardcoded TEAM_DATA | Calculated from deals DB |
| **reports** | Client-side HTML/print | Server-generated PDF via jsPDF |
| **notifications** | In-memory only | Web Push or email alerts |
| **file-upload** | Not implemented | Netlify Blobs or Supabase Storage |
| **password-reset** | Not implemented | Email token flow via Netlify Function |

## Steps for Each Automation

### Step 1: Identify the Client-Side Stub
Find the existing function in index.html that handles this feature. Note:
- The function name and line number
- What data it currently uses (localStorage, in-memory array, hardcoded object)
- What UI elements trigger it (buttons, forms, tab switches)

### Step 2: Create the Netlify Function
Write `/netlify/functions/[feature].js` following the standard template:
- CORS headers
- Input validation
- Error handling
- Environment variable references (NEVER hardcode keys)

### Step 3: Create package.json (if needed)
If the function needs npm packages, create or update `/netlify/functions/package.json`

### Step 4: Wire the Frontend
Replace the client-side stub with a fetch() call:
```javascript
// BEFORE (stub):
function sendEmailTemplate(id) {
  var a = document.createElement('a');
  a.href = 'mailto:...';
  a.click();
}

// AFTER (real):
async function sendEmailTemplate(id) {
  const res = await fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body, templateId: id })
  });
  const data = await res.json();
  if (data.success) _toast('Email sent successfully');
  else _toast('Failed to send: ' + data.error, '#e05555');
}
```

### Step 5: Add Loading States
- Show a spinner or "Sending..." text while the API call is in flight
- Disable the button to prevent double-clicks
- Show success/error toast with the result

### Step 6: Environment Variables
List every env var the function needs. Format:
```
SENDGRID_API_KEY     — Get from sendgrid.com → Settings → API Keys
SUPABASE_URL         — Get from supabase.com → Project → Settings → API
SUPABASE_KEY         — Get from supabase.com → Project → Settings → API (anon key)
GOOGLE_SA_KEY        — Base64-encoded service account JSON from Google Cloud Console
```
Admin sets these in Netlify Dashboard → Site → Environment Variables.

### Step 7: Fallback
Keep the old client-side behavior as a fallback if the API call fails:
```javascript
try {
  const res = await fetch('/.netlify/functions/send-email', ...);
  if (!res.ok) throw new Error('API unavailable');
} catch (e) {
  // Fallback to mailto
  window.open('mailto:...');
  _toast('Opened in mail client (server unavailable)');
}
```

## Output
1. The Netlify Function file (complete, ready to deploy)
2. package.json additions if needed
3. The exact frontend code changes (old → new)
4. Environment variables checklist
5. Testing instructions
6. Estimated free-tier limits for the service used
