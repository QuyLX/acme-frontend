---
id: DS-SKELETON
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/skeleton/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Skeleton (DS-SKELETON)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: placeholder shapes, pulse animation and its reduced-motion behavior, hiding from assistive technology. Not owned: announcing loading state (`aria-busy` on the region or a ProgressBar, module code), loading timeouts.

## Public concepts
`shape`: text | block | circle (default text); `lines`: 1–5 (text only, default 1). Non-interactive; no `'use client'`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| SKL-1 | Every shape is `aria-hidden="true"`, has no text and contains nothing focusable | WAI-ARIA (decorative content); WCAG 1.3.1 |
| SKL-2 | Every animated element stops animating under `prefers-reduced-motion` | WCAG 2.3.3 |
| SKL-3 | Text skeletons render the requested number of lines | Layout preview |

## Allowed variation
Line height, block height and circle size within the spacing scale; animation style.

## A11y contract
Pattern: decorative placeholder (linked: WCAG 2.3.3 Animation from Interactions; APG has no skeleton pattern). The loading state is announced by the consumer through `aria-busy` on the loading region. jsdom lane: axe per story.

## Theming anatomy
Fill `subtle`; radius `sm` (text), `md` (block), `full` (circle).

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| SKL-1 | `Skeleton.test.tsx` "SKL-1" | Screen readers read empty groups or stop on placeholders |
| SKL-2 | `Skeleton.test.tsx` "SKL-2" | Motion-sensitive users get constant pulsing |
| SKL-3 | `Skeleton.test.tsx` "SKL-3" | Content jumps when it loads |
| a11y | `Skeleton.test.tsx` axe per story | Placeholders exposed to assistive technology |

## Decisions / open questions
- OQ-1 (human-design): shimmer vs. pulse; needs motion tokens (see DS-PROGRESSBAR OQ-1).
