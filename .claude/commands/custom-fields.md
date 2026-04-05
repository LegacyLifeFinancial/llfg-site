Allow admins to create custom fields on contacts, deals, and agents in the LLFG portal. Drag-drop field builder, validation rules, conditional logic.

## What to Build
1. Field builder UI: name, type (text/number/date/select/checkbox), required flag
2. Field types: text, number, date, dropdown, multi-select, checkbox, URL
3. Validation rules per field (min/max, regex, required)
4. Conditional visibility (show field X only when field Y = value)
5. Custom fields render in contact/deal forms dynamically
6. Field data persists with contact/deal records

## Integration Points
- Custom Fields agent (crm_fields) manages field definitions
- CRM contact/deal forms render custom fields dynamically
- Report Builder can include custom fields in reports
