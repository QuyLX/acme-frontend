# AGENTS.md — admin

- Root guide: `../../AGENTS.md`. Review guide: `REVIEW.md`. Descriptor: `factory.yaml`.
- Modules live in `src/domains/<domain>/` (FE §4.4); import a module only through its `index.ts`. The pilot module is `src/domains/tenants` (`@admin/tenants`): read-only list and detail. `?persona=no-access` is the session stand-in until D-03.
- Server-only code (sessions, contract clients, permission checks) stays in `server/`; client code calls the app's route handlers.
- Admin is `x:privileged-admin`: no third-party scripts, no session replay, PII masked by default; privileged paths are R3 (FE §6.2, §10).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
