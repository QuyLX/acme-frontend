---
id: DS-POPOVER
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/popover/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Popover (DS-POPOVER)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: anchored positioning, arrow, dialog semantics, title, focus move and return, dismissal on Escape and outside interaction. Not owned: the trigger (DS `Button` inside `DialogTrigger`, exported by DS-DIALOG), the content and its actions.

## Public concepts
`DialogTrigger` > `Button` + `Popover`. `title` required; `children` content or `(close) => content`; `placement`: bottom | top | start | end | bottom start | bottom end | top start | top end (default bottom); controlled with `isOpen`/`onOpenChange`.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| POP-1 | The trigger exposes `aria-expanded`; opening moves focus into a `dialog` named by the title | APG Dialog; React Aria Popover |
| POP-2 | Escape closes the popover and focus returns to the trigger | APG Dialog |
| POP-3 | Interacting outside closes the popover; `close()` from content closes it | React Aria Popover (light dismiss) |

## Allowed variation
Max width, padding within the token scale; arrow glyph.

## A11y contract
Pattern: dialog (non-modal presentation). React Aria keeps assistive technology inside the popover while it is open (content outside is hidden from the accessibility tree), which is why it is tested like a dialog. jsdom lane: axe on the closed trigger and on the open dialog per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Panel `surface`, `border`, `shadow-md`, radius `md`; arrow fill `surface`, stroke `border`; title `fg`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| POP-1 | `Popover.test.tsx` "POP-1" | Screen-reader users do not know content appeared; focus stays behind |
| POP-2 | `Popover.test.tsx` "POP-2" | Keyboard users cannot dismiss; focus is lost |
| POP-3 | `Popover.test.tsx` "POP-3" | Popovers pile up and cover the page |
| a11y | `Popover.test.tsx` axe per story (closed and open) | Unnamed dialog |

## Decisions / open questions
- OQ-1 (human-design): show the arrow or not.
- OQ-2 (DS owner): export a `PopoverTrigger` alias of `DialogTrigger` for readability.
