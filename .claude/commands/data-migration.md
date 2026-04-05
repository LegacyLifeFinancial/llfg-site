Import/export data between systems for the LLFG portal. CSV/JSON mapping, field transformation, duplicate detection, validation, rollback.

## What to Build
1. Import wizard: upload file → preview → map columns → validate → import
2. Supported formats: CSV, JSON, Excel (via SheetJS CDN)
3. Field mapping UI: drag source columns to destination fields
4. Duplicate detection during import (skip/merge/create new)
5. Validation report before committing (show errors/warnings)
6. Export all CRM data to CSV/JSON with format selection
7. Rollback: undo last import batch

## Integration Points
- Import/Export agent (crm_import) manages file processing
- CRM data structures receive imported records
- Backup Agent creates snapshot before import
