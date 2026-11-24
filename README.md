# acme-frontend

Product monorepo of the Acme frontend ecosystem (topology B, FE Blueprint §3.3): the shared platform packages and the product apps live here; the policy repo (`acme-policy`) is separate.

## Layout

```
apps/
  console/            Customer-facing console (Next.js, port 3000) — tags: scope:console, type:app
  admin/              Internal admin portal (Next.js, port 3001)   — tags: scope:admin, type:app
packages/
  ds-tokens/, ds-react/, ds-icons/   Design System (tech-design 07); `pnpm --filter @platform/ds-react ds list`
  server/, api-codegen/, testing/, i18n/, telemetry/, flags/   runtime packages (tech-design 05)
  factory-cli/        @platform/factory-cli — standard commands (doctor, sync, verify:fast, verify)
factory.config.yaml   project kinds and the only allowed config differences (control file)
.factory/kit/         generated copy of the pinned tsconfig presets
```

Further `@platform/*` packages are added only when an app needs them (FE Blueprint §15.3).

## Requirements

- Node.js 26 LTS (see `.nvmrc`)
- pnpm 12 (pinned via `packageManager`)
- `acme-policy` checked out next to this repo (or set `FACTORY_POLICY_DIR`)

## Commands

| Command | What it does |
|---|---|
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev:console` / `pnpm dev:admin` | Run one app in dev mode |
| `pnpm build` | Build every project (Nx, cached) |
| `pnpm lint` | Lint every project, including module boundaries |
| `pnpm typecheck` | Type-check every project |
| `pnpm graph` | Open the Nx project graph |
| `pnpm factory doctor` | Conformance and drift: Node version, descriptors, owners, AGENTS/REVIEW, generated config, knowledge frontmatter (FE §7.6) |
| `pnpm factory generate <app|package|ds-component> <name> --checkpoint <design-review.json>` | Golden-path generators (a human-approved design-review is required for apps and packages) |
| `pnpm sync` | Regenerate lint/TS/test config from the pinned presets + `factory.config.yaml` (never edit those files by hand, FE-CFG-001) |
| `pnpm verify:fast` / `pnpm verify` | Central checks from `acme-policy` via the verification adapter |

## Module boundaries

| Tag | May depend on |
|---|---|
| `scope:console` | `scope:console`, `scope:shared` |
| `scope:admin` | `scope:admin`, `scope:shared` |
| `scope:shared` | `scope:shared` |
| `type:app` | `type:lib`, `type:config` |
| `type:lib` | `type:lib`, `type:config` |

Enforced by `@nx/enforce-module-boundaries` in `acme-policy/presets/eslint/boundaries.mjs`.

## Presets and config

Lint, TypeScript and test presets live in the policy repo (`acme-policy/presets`, DV-05) and are pinned there; this
repo consumes them through the `@acme/presets` dev dependency (a `link:` to the sibling checkout until the repos are
hosted). Each project's `eslint.config.mjs`, `tsconfig.json` and `vitest.config.ts` is **generated** by `pnpm sync` from
`factory.config.yaml`. The verifier ignores these files and `package.json` scripts entirely: it regenerates the
config from the pinned kit and runs the tools itself.
