---
id: DS-TOOLTIP
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/tooltip/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Tooltip (DS-TOOLTIP)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: `Tooltip` (rendering, placement, arrow) and `TooltipTrigger` (re-exported React Aria trigger: hover/focus delays, description wiring, Escape). Not owned: the trigger element (a focusable DS control), interactive overlays (Popover).

## Public concepts
`TooltipTrigger` > focusable trigger + `Tooltip`. `Tooltip.placement`: top | bottom | start | end (default top). Trigger props (`delay`, `closeDelay`, `isDisabled`, `defaultOpen`) are React Aria's.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| TIP-1 | Keyboard focus on the trigger shows the tooltip; the tooltip has role `tooltip` and is referenced by the trigger's `aria-describedby` (description, not name) | APG Tooltip |
| TIP-2 | Escape hides the tooltip and focus stays on the trigger | APG Tooltip; WCAG 1.4.13 (dismissible) |
| TIP-3 | A disabled tooltip trigger never shows the tooltip | React Aria TooltipTrigger |

## Allowed variation
Max width, padding within the token scale; arrow glyph; show/hide delays (platform-wide defaults only).

## A11y contract
Pattern: APG Tooltip. Content is plain text only. jsdom lane: axe per story and on the open tooltip. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Inverse panel: background `fg`, text `canvas` (the `fg`/`canvas` contrast pair, checked in `ds-tokens`); radius `sm`; `shadow-sm`; arrow fill `fg`. Unsettled: dedicated inverse tokens (see open questions).

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| TIP-1 | `Tooltip.test.tsx` "TIP-1" | Keyboard and screen-reader users never get the hint |
| TIP-2 | `Tooltip.test.tsx` "TIP-2" | Tooltip covers content and cannot be dismissed (WCAG 1.4.13) |
| TIP-3 | `Tooltip.test.tsx` "TIP-3" | Hints appear where the product turned them off |
| a11y | `Tooltip.test.tsx` axe per story and on the open tooltip | Broken description wiring |

## Decisions / open questions
- OQ-1 (DS owner): add inverse tokens (`color.inverse.surface`, `color.inverse.fg`) instead of reusing `fg`/`canvas`.
- OQ-2 (human-design): platform default `delay` (React Aria default 1500 ms).
