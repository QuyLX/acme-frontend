# AGENTS.md — console

- Root guide: `../../AGENTS.md`. Review guide: `REVIEW.md`. Descriptor: `factory.yaml`.
- Modules live in `src/modules/<domain>/` with `domain/ application/ server/ data/ features/ ui/ index.ts` (FE §4.4); import a module only through its `index.ts`.
- Server-only code (sessions, contract clients, permission checks) stays in `server/`; client code calls the app's route handlers.
