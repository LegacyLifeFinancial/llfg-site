Extract data from uploaded documents in the LLFG portal. OCR on licenses, applications, IDs. Auto-fill forms from scanned images.

## What to Build
1. Document upload zone (drag-drop + file picker)
2. Client-side OCR via Tesseract.js CDN
3. Field extraction: name, DOB, license number, state, expiry
4. Auto-fill agent/client forms from extracted data
5. Confidence score per extracted field
6. Manual correction UI for low-confidence extractions

## Integration Points
- Document Parser agent (ai_docparse) processes uploads
- Document Agent stores extracted data
- Onboarding flow auto-fills from scanned license
