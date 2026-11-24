---
id: ADR-FE-0001
kind: adr
status: ACTIVE
version: "1"
owner: team-platform
authority: decision
describes: ["pnpm-workspace.yaml", "nx.json", "apps/*/factory.yaml"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# ADR-FE-0001: Product monorepo with a separate policy repo

**Decision (D-02, 2026-11-24):** topology B of FE §3.3 — one product monorepo (`acme-frontend`: `apps/*`, `packages/*`)
and a separate policy repo (`acme-policy`). Build tool: Nx (D-05, partial).

**Why:** FE §3.3 criteria — no requirement to restrict read access between verticals; the CI load of two apps and a few
packages is small; topology B removes the portfolio index, prerelease consumer verification, adoption bots and the
version-skew bot (FE §15.3).

**Consequences:** Admin keeps its own origin, session and deploy pipeline inside the monorepo (DV-01); one `factory.yaml`
per app (DV-02); module boundaries are enforced with Nx tags (ADR-FE-0002).
