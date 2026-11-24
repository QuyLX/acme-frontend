---
id: DS-BUTTON
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/button/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Button (DS-BUTTON)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned by the DS: rendering, variants, sizes, pending/disabled behavior, focus ring. Not owned: what the action does, confirmation flows (destructive-confirm pattern, Experience tier).

## Public concepts
`variant`: primary | secondary | danger | ghost (default primary). `size`: sm | md (default md). Invalid values are a type error. Stability: experimental (0.x).

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| BTN-1 | Activates with mouse, Enter and Space; `onPress` fires once per activation | APG Button |
| BTN-2 | A disabled button never calls `onPress` | APG Button |
| BTN-3 | A pending button blocks presses, stays focusable and exposes a progress indicator named "Loading" | React Aria `isPending` |

## Allowed variation
Padding and font size changes within the token scale; spinner visual. No consumer `className`/`style` (theming only through tokens).

## A11y contract
Pattern: APG Button. jsdom lane: axe on every story. Real-browser lane: Storybook addon-a11y (contrast included).

## Theming anatomy
Background `accent`/`danger`/`surface`/transparent; text `fg-on-accent`/`fg`; border `border-strong` (secondary); focus ring `focus`; radius `md`. Unsettled: icon placement and size (human-design).

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| BTN-1 | `Button.test.tsx` "BTN-1" | Keyboard users cannot activate actions |
| BTN-2 | `Button.test.tsx` "BTN-2" | Disabled actions still execute |
| BTN-3 | `Button.test.tsx` "BTN-3" | Double submission while a request is in flight |
| a11y | `Button.test.tsx` axe per story; `ds-tokens` contrast check | Unnamed or low-contrast buttons |

## Decisions / open questions
- OQ-1 (human-design): icon-only button API (`aria-label` required by type?).
