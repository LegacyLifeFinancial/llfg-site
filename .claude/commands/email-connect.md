Build or enhance email connectivity and sending capabilities in the LLFG portal (index.html). This skill upgrades the existing template system from mailto: links to actual email sending with tracking.

## Current State
- `renderEmailTemplates()` (~lines 10893-10917) renders template selector
- `selectEmailTemplate()` (~lines 10919-10977) loads a template into the editor
- `refreshTemplatePreview()` (~lines 10979-11031) renders live preview
- `sendEmailTemplate()` (~lines 11033-11043) opens mailto: link only — NO actual sending
- `updateEmailPreview()` (~lines 10212-10317) generates secure policy verification emails
- `EMAIL_TEMPLATES` (~line 10592+) has 15+ templates (interview, onboarding, licensing, follow-up)
- Template variables: `{{name}}`, `{{date}}`, `{{time}}`, `{{sender}}`, `{{uplineName}}`, `{{state_instructions}}`
- `previewLlfgEmail()` and `syncLlfgEmail()` exist as stubs (~lines 5907-5928)
- `scheduleEmail()` function stub at ~line 12155
- No SMTP, no email service API, no sending capability beyond browser mailto:

## 1. Email Sending Architecture
Choose the right approach based on user needs:

### Option A: Enhanced Mailto (Quick — No Backend)
Improve the existing mailto: approach:
- Pre-fill all fields with proper encoding
- Track sends locally via `logEmailSent()`
- Works immediately, no setup required
- Limited: plain text only, no tracking, no HTML emails

### Option B: Netlify Function + Email API (Recommended)
Create a serverless email sender via `/netlify/functions/send-email.js`
Supported services: SendGrid, Resend, AWS SES, Mailgun
- Store API keys in Netlify environment variables (NEVER in index.html)
- Free tiers available (100-5,000 emails/month depending on provider)

### Option C: Google Workspace Gmail API
Since LLFG uses @llfg.us Google Workspace:
- Authenticate via OAuth 2.0 with Gmail API
- Send as the logged-in user's @llfg.us address
- Requires Google Cloud project setup

**Default to Option B** unless user specifies otherwise.

## 2. Email Template Enhancement
Upgrade templates to responsive HTML emails:
- Inline CSS (email clients don't support style blocks)
- LLFG branding: logo, colors (#1a237e, #00bcd4), footer
- New variables: `{{agent_role}}`, `{{team_name}}`, `{{next_promotion_req}}`, `{{portal_link}}`

## 3. Email Scheduling
Implement the stubbed `scheduleEmail()`:
- Queue view for scheduled emails
- Cancel/reschedule before send time
- For timed sending, use Netlify Scheduled Functions

## 4. Drip Campaigns
Multi-step email sequences:
- **New Agent Onboarding**: Welcome → Getting Started → Licensing → Check-in (Days 0-30)
- **Client Follow-up**: Application Received → What to Expect → Status Update → Welcome (Days 0-30)

## 5. Email Tracking
- Send log with timestamp, recipient, subject, status
- Open tracking via pixel (if using API)
- Dashboard stats on Overview tab

## 6. Implement syncLlfgEmail()
Connect the existing stub to sync sent/received emails.

## 7. Contact Management
- Auto-complete from agent roster and client profiles
- Group sending: "All FAs", "Team Alpha", "All Managers"
- Pull contacts from `MSG_CONTACTS` and `clientProfiles`

## 8. Role-Based Email Access
- **FA**: Own clients, upline, team members
- **Manager**: Entire team + bulk team emails
- **Executive+**: Multiple teams + org-wide announcements
- **Admin**: Full access + send as any user + manage templates

## 9. Security
- NEVER store API keys in index.html
- Sanitize template variables (prevent XSS)
- Rate limit sending, log all activity for audit

## 10. n8n Webhook Email Automation
Use n8n workflows to orchestrate complex email sequences without building custom scheduling logic:

### Architecture
```
Portal event → Netlify Function → n8n webhook → n8n workflow → SendGrid/Gmail/Mailchimp
```

### Workflow Examples
- **Onboarding drip**: Agent approved → n8n receives webhook → sends Welcome email (day 0), Getting Started (day 1), Training reminder (day 3), Check-in (day 7)
- **Follow-up sequences**: Deal submitted → n8n → confirmation email → underwriting update (when status changes) → placement congratulations
- **Re-engagement**: Agent inactive 14 days → n8n scheduled check → nudge email + manager notification

### Benefits Over Custom Scheduling
- n8n handles delays, retries, and error handling
- Visual workflow editor for non-developers to modify sequences
- 400+ integrations (SendGrid, Mailchimp, Gmail, Slack, SMS providers)
- No custom cron/scheduler code needed in the portal

## Output
After implementation:
1. Which sending method was chosen and why
2. List of new/modified functions
3. Confirm stubs are implemented
4. Verify no API keys exposed in client code
5. Confirm div balance