---
id: DS-DIALOG
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/dialog/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Dialog (DS-DIALOG)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: overlay, focus trap, focus return, dismissal rules, title. Not owned: destructive confirmation (Experience tier pattern), form submission.

## Public concepts
`title` required; `isDismissable` default true; controlled (`isOpen`) or via `DialogTrigger`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| DLG-1 | Named by its title; focus moves inside on open; Escape closes; focus returns to the trigger | APG Dialog (Modal) |
| DLG-2 | A non-dismissable dialog ignores Escape and outside clicks | Required-decision dialogs |

## Allowed variation
Max width, padding within the token scale; open/close animation.

## A11y contract
Pattern: APG Dialog (Modal). jsdom lane: axe on the open dialog. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Overlay `scrim`; panel `surface`, `border`, `shadow-md`, radius `lg`; title `fg`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| DLG-1 | `Dialog.test.tsx` "DLG-1" | Keyboard and screen-reader users get lost behind the overlay |
| DLG-2 | `Dialog.test.tsx` "DLG-2" | A required decision is skipped by pressing Escape |
