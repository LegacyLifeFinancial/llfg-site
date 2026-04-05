Build bulk action capabilities for the LLFG portal. Mass email, bulk status update, batch import, group reassignment, bulk commission adjustment.

## What to Build
1. Multi-select checkboxes on contact/deal/agent tables
2. Bulk action toolbar: email, tag, assign, stage change, delete
3. Batch import with progress bar and error log
4. Group reassignment: move agents between teams
5. Bulk commission adjustment with reason code
6. Confirmation modal showing affected records before execution

## Integration Points
- CRM contacts/deals tables get multi-select
- Email Agent handles bulk sends
- Audit Trail logs all bulk operations
