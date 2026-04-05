Build custom role creator for the LLFG portal beyond the 5 standard tiers. Fine-grained permissions per feature, tab, and data scope.

## What to Build
1. Role editor: name, description, base tier, permission overrides
2. Permission matrix: tab access, feature access, data scope
3. Data scope: own data only, team, org, all
4. Role assignment to users
5. Permission inheritance from base tier
6. Role comparison view (side-by-side permissions)

## Integration Points
- Access Control agent (sec_access) enforces permissions
- configureRoleUI() uses custom role definitions
- Tab visibility controlled by role permissions
