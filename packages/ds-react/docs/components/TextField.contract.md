---
id: DS-TEXTFIELD
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/text-field/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — TextField (DS-TEXTFIELD)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: label/description/error wiring, invalid and disabled styling. Not owned: validation rules (consumer `validate`, server errors via `isInvalid`).

## Public concepts
`label` required string; `description`, `errorMessage` optional; native input types via `type`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| TF-1 | The input is named by its label and described by its description | WCAG 1.3.1, 4.1.2 |
| TF-2 | An invalid field exposes `aria-invalid="true"` and renders the error message | WCAG 3.3.1 |

## Allowed variation
Height and spacing within the token scale.

## A11y contract
Pattern: labeled form field. jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Input `surface` / border `border-strong` / invalid border `danger`; label `fg`; description `fg-muted`; error `danger-text`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| TF-1 | `TextField.test.tsx` "TF-1" | Screen readers announce an unnamed field |
| TF-2 | `TextField.test.tsx` "TF-2" | Errors are invisible to assistive technology |
