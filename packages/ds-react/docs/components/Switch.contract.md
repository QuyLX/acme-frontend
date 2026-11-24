---
id: DS-SWITCH
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/switch/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Switch (DS-SWITCH)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: toggle behavior, switch role, label association, disabled rendering. Not owned: applying the setting, optimistic update and rollback (module code).

## Public concepts
Controlled (`isSelected`) or uncontrolled (`defaultSelected`); `onChange(isSelected)`; `children` is the visible label.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| SWT-1 | Exposed with role `switch`, named by its label; clicking the label and pressing Space toggle the state | APG Switch |
| SWT-2 | A disabled switch never changes state and never calls `onChange` | APG Switch |

## Allowed variation
Track and thumb size within the spacing scale; thumb transition (disabled under reduced motion).

## A11y contract
Pattern: APG Switch. jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y (track contrast ≥ 3:1 against `canvas`).

## Theming anatomy
Track off `border-strong`, on `accent`; thumb `surface` + `shadow-sm`; label `fg`; focus ring `focus` on the track.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| SWT-1 | `Switch.test.tsx` "SWT-1" | Screen readers announce a plain checkbox; keyboard users cannot toggle |
| SWT-2 | `Switch.test.tsx` "SWT-2" | A locked setting changes anyway |
| a11y | `Switch.test.tsx` axe per story | Unnamed switch |

## Decisions / open questions
- OQ-1 (human-design): label placement before or after the track.
