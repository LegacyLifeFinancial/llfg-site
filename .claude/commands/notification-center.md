Build advanced notification management for the LLFG portal. Multi-channel (in-app, email, SMS, push), preferences, quiet hours, digest mode.

## What to Build
1. Notification center panel (bell icon → dropdown)
2. Channel preferences per notification type (in-app, email, SMS)
3. Quiet hours setting (no notifications 10pm-7am)
4. Digest mode: batch notifications into hourly/daily summary
5. Read/unread status with mark-all-read
6. Notification categories: deals, team, compliance, system, CRM

## Integration Points
- Notifications Agent manages routing and delivery
- Email/SMS agents handle external delivery
- All other agents emit notifications via EventBus
