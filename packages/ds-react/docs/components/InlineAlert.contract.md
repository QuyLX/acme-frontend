---
id: DS-INLINEALERT
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/inline-alert/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — InlineAlert (DS-INLINEALERT)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: tone rendering, live-region role per tone, decorative icon, title and detail layout. Not owned: when to show the alert, its wording, dismissal state (module code).

## Public concepts
`tone`: info | success | warning | danger (default info); `title` required; `children` detail (may contain a Link or Button). Non-interactive itself; no `'use client'`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| ALR-1 | danger and warning render `role="alert"` (assertive); info and success render `role="status"` (polite) | APG Alert; WAI-ARIA status role |
| ALR-2 | Title and detail are visible text inside the live region; the tone icon is decorative (`aria-hidden`), so tone is never conveyed by color or icon alone | WCAG 1.4.1, 1.1.1 |

## Allowed variation
Icon glyphs; padding within the token scale; left accent border width.

## A11y contract
Pattern: alert / status live regions. Live regions announce content inserted after mount; render the alert when the condition occurs. jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Per tone: background `<tone>-subtle`, text, icon and left border `<tone>-text` (pairs checked in `ds-tokens`); radius `md`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| ALR-1 | `InlineAlert.test.tsx` "ALR-1" | Errors are not announced, or routine notes interrupt screen-reader users |
| ALR-2 | `InlineAlert.test.tsx` "ALR-2" | The severity is only visible as color |
| a11y | `InlineAlert.test.tsx` axe per story | Low-contrast or unlabeled alerts |

## Decisions / open questions
- OQ-1 (human-design): dismissible variant (close button, needs `'use client'`).
