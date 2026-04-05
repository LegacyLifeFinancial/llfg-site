Add SMS messaging capabilities to the LLFG portal via Twilio API through Netlify Functions. Text templates, bulk SMS, delivery tracking, opt-out management.

## What to Build
1. Netlify Function: `netlify/functions/send-sms.js` (Twilio API proxy)
2. SMS composer in portal with template selection
3. Bulk SMS to filtered contact lists
4. Delivery status tracking (sent, delivered, failed)
5. Opt-out management (STOP keyword handling)
6. SMS templates library (appointment reminders, follow-ups, welcome)
7. Two-way SMS with reply logging

## Security
- Twilio credentials in Netlify env vars only (NEVER in index.html)
- Rate limiting on the Netlify Function
- Opt-out compliance (TCPA)

## Integration Points
- SMS Agent (comm_sms) manages send queue
- Follow-up Sequencer can include SMS steps
- CRM Activity Logger records all SMS sent/received
