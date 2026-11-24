# AGENTS.md — admin

- Root guide: `../../AGENTS.md`. Review guide: `REVIEW.md`. Descriptor: `factory.yaml`.
- Modules live in `src/domains/<domain>/` with `domain/ application/ server/ data/ features/ ui/ index.ts` (FE §4.4); import a module only through its `index.ts`.
- Server-only code (sessions, contract clients, permission checks) stays in `server/`; client code calls the app's route handlers.
- Admin is `x:privileged-admin`: no third-party scripts, no session replay, PII masked by default; privileged paths are R3 (FE §6.2, §10).
