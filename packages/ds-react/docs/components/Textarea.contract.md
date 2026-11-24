---
id: DS-TEXTAREA
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/textarea/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Textarea (DS-TEXTAREA)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: multi-line input, label/description/error wiring, invalid and disabled rendering, row presets. Not owned: character counting, rich text, server-side validation.

## Public concepts
`label` required; `rows`: 3 | 5 | 8 (default 3); controlled (`value`) or uncontrolled (`defaultValue`); validation as TextField (`isRequired`, `isInvalid`, `validate`, `errorMessage`).

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| TXA-1 | Renders a multi-line textbox named by its label and described by its description; Enter inserts a new line instead of submitting | APG names and descriptions; HTML textarea |
| TXA-2 | An invalid field exposes `aria-invalid="true"` and shows the error message | WCAG 3.3.1 |
| TXA-3 | A disabled field cannot be edited and keeps its value | HTML disabled |

## Allowed variation
Padding and font size within the token scale; resize handle (vertical only).

## A11y contract
Pattern: textbox (multi-line). jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Input `surface` + `border-strong`, text `fg`, placeholder `fg-muted`; invalid border `danger`; error text `danger-text`; focus ring `focus`; radius `md`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| TXA-1 | `Textarea.test.tsx` "TXA-1" | Unnamed field; Enter submits the form and loses multi-line input |
| TXA-2 | `Textarea.test.tsx` "TXA-2" | Screen-reader users are not told the value is invalid |
| TXA-3 | `Textarea.test.tsx` "TXA-3" | Read-only data is edited by accident |
| a11y | `Textarea.test.tsx` axe per story | Unlabelled or misdescribed field |

## Decisions / open questions
- OQ-1 (human-design): built-in character counter with `maxLength`.
