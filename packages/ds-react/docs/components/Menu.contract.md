---
id: DS-MENU
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/menu/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Menu (DS-MENU)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: `Menu` (popover + menu list), `MenuItem` (item rendering, tone, disabled state), `MenuTrigger` (re-exported React Aria trigger that wires a DS `Button` to the menu). Not owned: what an action does, destructive confirmation (Experience tier pattern), submenus and sections (not yet in the DS).

## Public concepts
`MenuTrigger` > `Button` + `Menu` > `MenuItem[]`. `onAction(id)`; `disabledKeys`; `placement`: bottom start | bottom end | top start | top end (default bottom start). `MenuItem.tone`: default | danger.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| MNU-1 | The trigger exposes `aria-haspopup` and `aria-expanded`; Enter (or Space/ArrowDown) opens the menu and focuses the first item | APG Menu Button |
| MNU-2 | Arrow keys move focus between items and skip disabled items; Enter activates the item, calls `onAction(id)`, closes the menu and returns focus to the trigger | APG Menu |
| MNU-3 | Escape closes the menu without an action and returns focus to the trigger | APG Menu |

## Allowed variation
Minimum width, max height (scrolls), item padding within the token scale.

## A11y contract
Pattern: APG Menu Button + Menu. jsdom lane: axe on the closed trigger and on the open menu for every story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Popover `surface`, `border`, `shadow-md`, radius `md`; item `fg`, focused `subtle`, disabled `fg-disabled`, danger `danger-text`; trigger as Button.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| MNU-1 | `Menu.test.tsx` "MNU-1" | Screen readers do not know a menu opens; keyboard users cannot reach the actions |
| MNU-2 | `Menu.test.tsx` "MNU-2" | Disabled actions run; focus is lost after an action |
| MNU-3 | `Menu.test.tsx` "MNU-3" | Keyboard users are trapped in the menu |
| a11y | `Menu.test.tsx` axe per story (closed and open) | Unnamed trigger or items |

## Decisions / open questions
- OQ-1 (human-design): item icons and keyboard-shortcut hints.
- OQ-2 (human-design): sections and submenus — add when a module needs them (§15.3).
