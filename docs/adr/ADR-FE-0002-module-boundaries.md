---
id: ADR-FE-0002
kind: adr
status: ACTIVE
version: "2"
owner: team-platform
authority: decision
describes: ["factory.config.yaml", "apps/*/package.json", "packages/*/package.json"]
basedOn: ["ADR-FE-0001@1"]
---
# ADR-FE-0002: Tag-based module boundaries

Every project declares `scope:*` (console | admin | shared) and `type:*` (app | lib | config) tags in its
`package.json`. `@nx/enforce-module-boundaries` (in the pinned presets, `acme-policy/presets/eslint/boundaries.mjs`, DV-05) enforces:
console and admin never depend on each other; shared code depends only on shared code; apps depend only on libs and config.

## Revision history

- v2 (2026-11-24): reconciliation decision **update** — the decision is unchanged; the rule moved from
  `packages/config` to the policy repo's presets (D-17, DV-05), so `describes` now points at `factory.config.yaml`.
  Needs confirmation by an `ADR-FE-0002` owner (team-platform).
