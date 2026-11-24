# Review Guide — console

> **DRAFT — must be written and approved by the code owners of this area (CORE-KNW-02).** The items below are
> seeded from the Blueprint and are not yet owner guidance.

Owners: team-console (placeholder; see CODEOWNERS once owner identities are decided)

## What failure looks like here
- Data from one tenant/project/region is cached or shown in another (cache key without tenant).
- A permission check exists only in the UI.
- A long-running operation shows a state the backend does not hold.

## Always check
- Server-side authorization for every new action.
- API client changes match the declared contract.

## Skip
- Generated code.

## Rules for findings
- Cite file and line; tag every finding Important | Nit | Pre-existing; at most 3 nits.
