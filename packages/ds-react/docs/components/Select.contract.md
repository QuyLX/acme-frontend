---
id: DS-SELECT
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/select/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Select (DS-SELECT)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: trigger, popover, listbox, disabled options, label/description/error wiring. Not owned: option data loading, search (combobox, not yet in the DS).

## Public concepts
`options: { id, label, isDisabled? }[]`; selection reported by `id`; placeholder default "Select…".

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| SEL-1 | ArrowDown opens the listbox; disabled options are exposed as disabled and cannot be chosen | APG Listbox |
| SEL-2 | The chosen option is shown in the trigger | APG Select-only combobox |

## Allowed variation
Popover width (≥ trigger width), chevron glyph.

## A11y contract
Pattern: APG Listbox / select-only combobox. jsdom lane: axe per story.

## Theming anatomy
Trigger as TextField; popover `surface`, `border`, `shadow-md`; focused option `subtle`; disabled option `fg-disabled`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| SEL-1 | `Select.test.tsx` "SEL-1" | Keyboard users cannot open; unavailable regions can be chosen |
| SEL-2 | `Select.test.tsx` "SEL-2" | Users cannot see what they selected |
