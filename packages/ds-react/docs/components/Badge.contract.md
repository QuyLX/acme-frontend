---
id: DS-BADGE
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/badge/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Badge (DS-BADGE)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: tone styling. Not owned: mapping backend states to tones (module code).

## Public concepts
`tone`: neutral | info | success | warning | danger (default neutral); `children` status text.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| BDG-1 | Every badge has visible status text; color is never the only signal | WCAG 1.4.1 |

## Allowed variation
Height and padding within the token scale.

## A11y contract
Non-interactive text. jsdom lane: axe per story; contrast of each tone pair is checked in `ds-tokens`.

## Theming anatomy
`<tone>-subtle` background with `<tone>-text`; neutral uses `subtle` + `fg`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| BDG-1 | `Badge.test.tsx` "BDG-1"; `ds-tokens` contrast pairs | Status unreadable for color-blind users |
