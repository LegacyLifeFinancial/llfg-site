Build contact management in the LLFG portal CRM tab (ptab-crm). Add/edit/search/filter contacts, interaction timeline, tags, CSV import/export.

## Before anything else
Read index.html. Find `ptab-crm`, `crmData`, `renderContacts`, and the CRM engine section.

## What to Build
1. Contact CRUD with full form (name, email, phone, type, source, tags, notes)
2. Search + filter bar (by type, stage, score range, date range)
3. Contact detail view with interaction timeline
4. Tag system — create, assign, bulk tag
5. CSV import (map columns to fields) and export
6. Duplicate detection on save (fuzzy name+email match)

## Data Model
```javascript
{ id, fn, ln, em, ph, tp, src, stage, score, tags:[], notes, cat, uat }
```

## Integration Points
- CRM Activity Logger agent logs all contact interactions
- Lead Scoring agent auto-updates score on activity
- Email Agent for contact-triggered drip sequences

## Validation
- Contacts persist in localStorage across sessions
- Search filters work in real-time
- CSV export downloads valid file
