Build or enhance the e-signature and document encryption system in the LLFG portal (index.html).

## Before anything else
Read index.html. Find the signature pad canvas, SHA-256 hashing, agreement storage, and `ptab-agreements`.

## System Components

### 1. Signature Pad
- HTML5 Canvas (touch + mouse)
- Clear button, preview, export as PNG data URL

### 2. SHA-256 Integrity Hashing
- Hash: agreement text + signature data + timestamp + signer info
- Store hash with document, verify on demand
- Mismatch = tampering detected

### 3. Agreement Storage
- Key: `llfg_signed_agreements`
- Record: `{ id, type, signerName, signerEmail, signedAt, agreementText, signatureDataUrl, hash, verified }`
- Types: NDA, Debt Rollup, ICA, AML, Code of Conduct

### 4. Document Templates
Verify complete: NDA, Debt Rollup, Independent Contractor Agreement, AML Acknowledgment, Code of Conduct.

## Verify/Fix
1. Pad renders on mobile + desktop
2. Canvas captures clean data (not blank)
3. SHA-256 via Web Crypto API (`crypto.subtle.digest`)
4. Agreements stored and retrievable
5. Agreement list with dates + verification status
6. Download generates self-contained HTML (text + signature + hash + timestamp)
7. Verify button recalculates hash, shows pass/fail

## Integration Points
- Compliance Agent: emit `agreement:signed` event
- Documents skill: update checklist on completion
- Contracting Agent: require NDA + Debt Rollup before contracting

Read index.html before making any changes.