---
id: DS-NUMBERFIELD
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/number-field/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — NumberField (DS-NUMBERFIELD)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: parsing and locale formatting, stepping (keys and buttons), clamping to bounds, label/description/error wiring. Not owned: quota lookups, cross-field validation (module code).

## Public concepts
`label` required; `minValue`, `maxValue`, `step`, `formatOptions` (Intl.NumberFormat); `onChange(number)` fires on commit (blur, Enter, arrow, button), not on every keystroke. Empty value is `NaN`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| NUM-1 | The input is named by its label; ArrowUp/ArrowDown change the value by `step` and stop at `minValue`/`maxValue` | APG Spinbutton (keyboard) |
| NUM-2 | Increment/decrement buttons are named "Increase/Decrease <label>" and are disabled at the bounds | APG Spinbutton |
| NUM-3 | A typed value outside the range is clamped to the nearest bound on blur | React Aria NumberField |
| NUM-4 | A disabled field cannot be edited or stepped | HTML disabled |

## Allowed variation
Button glyphs and width within the spacing scale; button placement (both sides or stacked).

## A11y contract
Pattern: APG Spinbutton semantics. React Aria exposes the input as a `textbox` with `aria-roledescription="Number field"` instead of `role="spinbutton"` (VoiceOver cannot focus a spinbutton); the step buttons are not in the tab order (keyboard users use arrows). jsdom lane: axe per story.

## Theming anatomy
Group `surface` + `border-strong`, focus-within ring `focus`; buttons `fg-muted`, hover `subtle`, disabled `fg-disabled`, separators `border`; invalid border `danger`; error `danger-text`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| NUM-1 | `NumberField.test.tsx` "NUM-1" | Keyboard users cannot adjust; values exceed quotas |
| NUM-2 | `NumberField.test.tsx` "NUM-2" | Unnamed buttons; pressing past a bound looks broken |
| NUM-3 | `NumberField.test.tsx` "NUM-3" | Out-of-range values reach the API |
| NUM-4 | `NumberField.test.tsx` "NUM-4" | Locked values change |
| a11y | `NumberField.test.tsx` axe per story | Unnamed field |

## Decisions / open questions
- OQ-1 (human-design): stacked chevrons vs. minus/plus on both sides.
