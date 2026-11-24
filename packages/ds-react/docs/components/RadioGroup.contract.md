---
id: DS-RADIOGROUP
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/radio-group/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — RadioGroup (DS-RADIOGROUP)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: `RadioGroup` (group semantics, label/description/error wiring, roving focus) and `Radio` (option rendering, disabled state). Not owned: option data, rich option cards (not yet in the DS).

## Public concepts
`RadioGroup`: `label` required, `value`/`defaultValue`, `onChange(value)`, `orientation` vertical | horizontal (default vertical), validation as other fields. `Radio`: `value` and visible label as children; `isDisabled` per option.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| RAD-1 | The group has role `radiogroup` named by its label; Tab enters the group once and arrow keys move and select the option | APG Radio Group |
| RAD-2 | A disabled option is skipped by arrow keys and cannot be chosen by click | APG Radio Group |
| RAD-3 | An invalid group is marked `aria-invalid` and described by its visible error message | WCAG 3.3.1 |

## Allowed variation
Gap between options; dot size within the spacing scale.

## A11y contract
Pattern: APG Radio Group. jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Circle `surface` + `border-strong`; selected border and dot `accent`; invalid border `danger`; label `fg`; description `fg-muted`; error `danger-text`; focus ring `focus`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| RAD-1 | `RadioGroup.test.tsx` "RAD-1" | Keyboard users tab through every option; the group is unnamed |
| RAD-2 | `RadioGroup.test.tsx` "RAD-2" | Unavailable options can be chosen |
| RAD-3 | `RadioGroup.test.tsx` "RAD-3" | A missing required choice is not announced |
| a11y | `RadioGroup.test.tsx` axe per story | Unnamed group or options |

## Decisions / open questions
- OQ-1 (human-design): card-style radio options for plan pickers.
