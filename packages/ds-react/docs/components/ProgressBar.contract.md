---
id: DS-PROGRESSBAR
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/progress-bar/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — ProgressBar (DS-PROGRESSBAR)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: progressbar semantics, value formatting, bar and spinner rendering, reduced-motion behavior. Not owned: polling long-running operations (LRO progress pattern, Experience tier), `aria-busy` on the loading region.

## Public concepts
`label` required; `variant`: bar | spinner (default bar; spinner is always indeterminate); `value`, `minValue` (0), `maxValue` (100), `formatOptions`, `valueLabel`; `isIndeterminate` (bar).

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| PRG-1 | A determinate bar has role `progressbar`, is named by its visible label and exposes `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` (also shown as text) | WAI-ARIA progressbar |
| PRG-2 | Indeterminate bars and spinners omit `aria-valuenow` and stay named | WAI-ARIA progressbar |
| PRG-3 | Animations (indeterminate pulse, spinner rotation) stop under `prefers-reduced-motion` | WCAG 2.3.3 |

## Allowed variation
Bar height and spinner size within the spacing scale; indeterminate animation style.

## A11y contract
Pattern: WAI-ARIA `progressbar` (APG has no dedicated pattern page; the role definition is linked). The fill is an SVG drawn from the value, so no inline style is needed. jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Track `subtle`; fill `accent`; label `fg`; value text `fg-muted`; spinner ring `border` with `accent` head.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| PRG-1 | `ProgressBar.test.tsx` "PRG-1" | Screen-reader users cannot tell how far along an upload is |
| PRG-2 | `ProgressBar.test.tsx` "PRG-2" | Unknown progress is announced as 0% |
| PRG-3 | `ProgressBar.test.tsx` "PRG-3" | Motion-sensitive users get constant animation |
| a11y | `ProgressBar.test.tsx` axe per story | Unnamed progress indicators |

## Decisions / open questions
- OQ-1 (DS owner): motion tokens (duration and an indeterminate keyframe) so the indeterminate bar can slide instead of pulse; today only `ease-standard` is tokenized.
