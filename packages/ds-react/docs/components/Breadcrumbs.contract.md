---
id: DS-BREADCRUMBS
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/breadcrumbs/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Breadcrumbs (DS-BREADCRUMBS)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: `Breadcrumbs` (navigation landmark, ordered list, wrapping) and `Breadcrumb` (link, current-page state, separator). Not owned: deriving the trail from the route (app shell or module code), truncation of long trails.

## Public concepts
`Breadcrumbs aria-label?` (default "Breadcrumbs") > `Breadcrumb href? id?`. The last item is the current page and has no `href`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| BRC-1 | The trail is a `navigation` landmark named "Breadcrumbs" containing an ordered list of items in hierarchy order | APG Breadcrumb |
| BRC-2 | Ancestors are links with `href`; the last item has `aria-current="page"`, no `href` and is not activatable | APG Breadcrumb |
| BRC-3 | Separators are decorative (`aria-hidden`) | APG Breadcrumb |

## Allowed variation
Separator glyph; gap within the spacing scale.

## A11y contract
Pattern: APG Breadcrumb. jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Ancestor links `fg-muted`, hover `fg` + underline; current `fg` medium weight; separators `fg-muted`; focus ring `focus`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| BRC-1 | `Breadcrumbs.test.tsx` "BRC-1" | Screen-reader users cannot find or skip the trail |
| BRC-2 | `Breadcrumbs.test.tsx` "BRC-2" | The current page is announced as just another link |
| BRC-3 | `Breadcrumbs.test.tsx` "BRC-3" | Screen readers read "chevron" between every item |
| a11y | `Breadcrumbs.test.tsx` axe per story | Duplicate or unnamed landmarks |

## Decisions / open questions
- OQ-1 (human-design): collapsing middle items for deep trails.
