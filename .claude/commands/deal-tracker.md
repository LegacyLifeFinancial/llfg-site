Track all deals with status, AP value, probability, expected close date, carrier, product type, and commission projections in the LLFG CRM.

## Before anything else
Read index.html. Find `crm-deals`, `renderDeals`, `saveCRMDeal`, and deal data model.

## What to Build
1. Deal creation form with all fields (name, contact, product, carrier, AP, probability, stage, close date)
2. Deal table with sorting and filtering
3. Pipeline value and weighted pipeline calculations
4. Deal stage progression tracking with timestamps
5. Commission projection per deal (AP x commission% x 75% advance)
6. Deal won/lost reporting with win rate calculation

## Data Model
```javascript
{ id, name, cid, product, carrier, ap, prob, stage, close, cat, uat }
```

## Integration Points
- Commission Forecast agent uses deal data for projections
- Win/Loss agent analyzes deal patterns
- Gamification awards XP on deal won

## Validation
- Pipeline value matches sum of open deal AP values
- Weighted pipeline = sum of (AP x probability) for open deals
