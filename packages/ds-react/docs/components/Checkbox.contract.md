---
id: DS-CHECKBOX
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/checkbox/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Checkbox (DS-CHECKBOX)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: toggle behavior, indeterminate rendering, label association. Not owned: group semantics (checkbox group, not yet in the DS).

## Public concepts
Controlled (`isSelected`) or uncontrolled (`defaultSelected`); `isIndeterminate`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| CB-1 | Clicking the label and pressing Space toggle the state | APG Checkbox |
| CB-2 | Indeterminate state is exposed to assistive technology | APG Checkbox (mixed) |

## Allowed variation
Check mark glyph.

## A11y contract
Pattern: APG Checkbox. jsdom lane: axe per story.

## Theming anatomy
Box `surface` + `border-strong`; checked `accent` + `fg-on-accent`; invalid `danger`; focus `focus`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| CB-1 | `Checkbox.test.tsx` "CB-1" | Small click target; keyboard users cannot toggle |
| CB-2 | `Checkbox.test.tsx` "CB-2" | "Select all" partial state is announced as unchecked |
