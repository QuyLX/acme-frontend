# AGENTS.md

Entry point for AI agents and new contributors (CORE-KNW-01).

## Purpose
Product monorepo of the Acme frontend ecosystem (FE Blueprint topology B): shared `@platform/*` packages plus the
`console` (customer-facing) and `admin` (internal, privileged) apps. Required checks are defined centrally in the
separate policy repo `acme-policy` and cannot be changed from here.

## Golden commands
- Toolchain: `nvm use` first (Node 26, `.nvmrc`); `factory doctor` fails on another major
- Install: `pnpm install`
- Dev: `pnpm dev:console` (port 3000) · `pnpm dev:admin` (port 3001)
- Build / lint / type check: `pnpm build` · `pnpm lint` · `pnpm typecheck`
- Conformance and drift: `pnpm factory doctor`
- Config: edit `factory.config.yaml`, then `pnpm sync`; never hand-edit generated `eslint.config.mjs`, `tsconfig.json`, `vitest.config.ts` or `.factory/kit/**` (FE-CFG-001)
- Verification before proposing a change: `pnpm verify:fast` · `pnpm verify` (+ build, lockfile, dependency policy) · `pnpm verify:runtime` (boots Admin and checks `admin/tenants`). The checks `verify:fast` and `verify` run are defined by the policy repo (`acme-policy/registry/commands.yaml`). `policy.sod` runs in the mandatory pipeline on PR events (`FACTORY_SOD_INPUT=<file>` runs it locally)

## Architecture map
- Layout and module boundaries: `README.md`
- Decisions: `docs/adr/`
- Per-app guides: `apps/console/AGENTS.md`, `apps/admin/AGENTS.md`
- Review guides: `apps/*/REVIEW.md`

## Working agreements
- English only for code, comments, docs and commit messages.
- Report `NOT_ASSESSED` explicitly; never claim an unrun check passed. Show command output as evidence.
- Never weaken tests, rules, thresholds, presets or CI configuration to make a check pass; propose such changes separately.
- Never edit a spec, acceptance criterion, verifier-written test (`*.oracle.test.*`) or contract to match the code: record a knowledge conflict and stop.
- Use only `ACTIVE` knowledge artifacts as your basis; list affected artifacts and a reconciliation decision in the PR.
- Never import across `scope:console` ↔ `scope:admin`; shared code goes into a `packages/*` project tagged `scope:shared`.
- Add a `@platform/*` package only when an app needs it now.
- Never use production data or credentials; mocks and synthetic data only.

## Work items (playbooks and roles)
- Agent work follows a playbook from the policy repo (single source, CORE-SEC-05): `acme-policy/workflows/bug-fix.yaml` (`bug-fix`, ≤ R2), `docs-update.yaml` (`docs.link-fix`, R0). Both are `PROPOSED` until the workflow owner approves them.
- Roles and their limits: `acme-policy/agents/roles/*.yaml`; sandbox: `acme-policy/agents/sandbox.yaml`. The verifier and the implementer are always different identities and sessions; the verifier's reproduction/acceptance tests are locked and read-only for the implementer — if you think an oracle is wrong, open an oracle change request, never edit it.
- Handoffs into the verifier or reviewer never carry the implementer's notes, reasoning or plan.

## Approval boundaries
- **Control files** need approval from their code owner (Standard §9.10): `apps/*/factory.yaml`, `CODEOWNERS`, `**/REVIEW.md`, `**/AGENTS.md`, `**/package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `nx.json`, `**/eslint.config.mjs`, `**/tsconfig.json`, `**/vitest.config.*`, `factory.config.yaml`, `.factory/**`, `packages/factory-cli/**`, `.claude/**`, CI files. Loosening `factory.config.yaml` (lower a rule, add an ignore or a baseline entry, drop tests) is High tier. Authoritative list: `acme-policy/registry/control-files.yaml`.
- **Tier** comes from `riskMap` in each `factory.yaml` via `policy.risk`; authors never choose it (a PR input with a lower tier fails `policy.sod`). Unmatched paths are High.
- **Admin** (`apps/admin`): every change is at least R2 (Medium); privileged paths are R3 (High: two independent approvals incl. a code owner).
- **Never** by an agent: approving a PR, dismissing a security finding, changing a waiver, enabling zero-human merge.
