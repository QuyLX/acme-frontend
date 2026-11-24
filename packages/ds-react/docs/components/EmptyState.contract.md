---
id: DS-EMPTYSTATE
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/empty-state/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — EmptyState (DS-EMPTYSTATE)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: layout, heading, decorative illustration, action slot placement. Not owned: the action itself, the wording, deciding between "empty" and "no results" (module code).

## Public concepts
`title` required; `description?`; `action?` (ReactNode slot, usually one Button or Link); `headingLevel`: 2 | 3 | 4 (default 2). Non-interactive itself; no `'use client'`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| EMP-1 | The title is a heading at `headingLevel` (default 2); the illustration is decorative (`aria-hidden`) | APG Headings; WCAG 1.3.1, 1.1.1 |
| EMP-2 | The action slot renders after the text and is reachable and operable by keyboard | WCAG 2.1.1, 2.4.3 |

## Allowed variation
Illustration glyph; vertical padding within the token scale.

## A11y contract
Pattern: heading structure (APG practices: headings). jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Title `fg`; description and illustration `fg-muted`; action as Button/Link.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| EMP-1 | `EmptyState.test.tsx` "EMP-1" | Screen-reader users cannot find the message by heading; broken page outline |
| EMP-2 | `EmptyState.test.tsx` "EMP-2" | Keyboard users reach the action before its explanation, or not at all |
| a11y | `EmptyState.test.tsx` axe per story | Skipped heading levels or unnamed actions |

## Decisions / open questions
- OQ-1 (human-design): per-module illustrations (needs `ds-icons`).
