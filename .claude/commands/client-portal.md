Build a client-facing portal view for the LLFG portal. Policy status, payment history, claim filing, document upload, agent contact info.

## What to Build
1. Client login (separate from agent login)
2. Policy dashboard: active policies, status, premium, coverage amount
3. Payment history with next payment date
4. Document upload for claims/applications
5. Agent contact card with message/call buttons
6. FAQ section for common client questions

## Integration Points
- Client Portal agent (spec_clientportal) manages client sessions
- Policy Lifecycle agent provides policy status data
- Document Agent handles uploads
