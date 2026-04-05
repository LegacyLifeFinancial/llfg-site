Build real-time in-portal live chat between agents and managers using Supabase real-time subscriptions. Typing indicators, read receipts, file sharing.

## What to Build
1. Chat panel in portal sidebar or messaging tab
2. Direct messages between any portal users
3. Group channels (team chat, all-hands)
4. Typing indicators via Supabase presence
5. Read receipts and unread badges
6. File/image sharing via Supabase Storage
7. Message search and pinning

## Tech Stack
- Supabase Realtime for instant message delivery
- Supabase Storage for file uploads
- localStorage fallback for offline queueing

## Integration Points
- Live Chat agent (comm_livechat) manages connections
- Notification agent for unread alerts
- Existing ptab-messages can be enhanced or replaced
