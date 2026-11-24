# Review Guide — admin

> **DRAFT — must be written and approved by the code owners of this area (CORE-KNW-02).** The items below are
> seeded from the Blueprint and are not yet owner guidance.

Owners: team-admin (placeholder; see CODEOWNERS once owner identities are decided)

## What failure looks like here
- A privileged action (impersonation, bulk, export, PII reveal) is reachable without step-up auth or four-eyes.
- PII is shown unmasked by default, or a reveal is not audited.
- Authorization is enforced only in the UI.
- An export is vulnerable to CSV formula injection.

## Always check
- Server-side authorization for every new action.
- API client changes match the declared contract.

## Skip
- Generated code.

## Rules for findings
- Cite file and line; tag every finding Important | Nit | Pre-existing; at most 3 nits.
