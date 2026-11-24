---
id: DS-LINK
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/link/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Link (DS-LINK)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: anchor rendering, variants, disabled state, focus ring. Not owned: routing (wired once per app with React Aria `RouterProvider`), external-link policy.

## Public concepts
`href` required; `variant`: inline | standalone (default inline); `target`, `rel` pass through; `isDisabled`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| LNK-1 | Renders a native `<a href>` (role `link`) in the tab order, activated by Enter | APG Link; HTML anchor |
| LNK-2 | A disabled link is exposed with `aria-disabled="true"`, never calls `onPress` and its default navigation is prevented | React Aria Link |

## Allowed variation
Underline offset and thickness; weight of standalone links.

## A11y contract
Pattern: APG Link. Links are underlined in both variants so color is never the only cue (WCAG 1.4.1). jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Text `fg` (no link color token exists yet; see open questions); standalone underline `border-strong`, hover `fg`; disabled `fg-disabled`; focus ring `focus`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| LNK-1 | `Link.test.tsx` "LNK-1" | Links are not reachable by keyboard; middle-click and "open in new tab" break |
| LNK-2 | `Link.test.tsx` "LNK-2" | Unavailable destinations are still navigable |
| a11y | `Link.test.tsx` axe per story | Unnamed links |

## Decisions / open questions
- OQ-1 (DS owner): add a link text token (`color.fg.link`, plus hover) with contrast pairs on `surface` and `canvas` in both themes; `accent.default` fails 4.5:1 on the dark `surface`.
- OQ-2 (human-design): external-link icon.
