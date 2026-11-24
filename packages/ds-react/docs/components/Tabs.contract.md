---
id: DS-TABS
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/tabs/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Tabs (DS-TABS)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: `Tabs` (selection state), `TabList` (named tab list, roving focus), `Tab` (rendering, selected and disabled state), `TabPanel` (panel wiring and focusability). Not owned: URL synchronization of the selected tab, lazy loading of panel data (module code).

## Public concepts
`Tabs` > `TabList aria-label` > `Tab id` … then `TabPanel id` per tab. Controlled (`selectedKey`) or uncontrolled (`defaultSelectedKey`); `disabledKeys`; `keyboardActivation`: automatic (default) | manual. Horizontal only in v0.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| TAB-1 | The tab list is named by `aria-label`; the selected tab has `aria-selected="true"` and controls a `tabpanel` labelled by that tab | APG Tabs |
| TAB-2 | Tab moves focus to the selected tab only; ArrowLeft/ArrowRight move between tabs (wrapping) and select them (automatic activation) | APG Tabs |
| TAB-3 | A disabled tab is exposed as disabled, is skipped by arrow keys and cannot be selected | APG Tabs |
| TAB-4 | From the selected tab, Tab moves focus into the panel | APG Tabs (panel in tab sequence) |

## Allowed variation
Tab padding within the token scale; indicator thickness; label weight.

## A11y contract
Pattern: APG Tabs. jsdom lane: axe per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
List bottom border `border`; tab text `fg-muted`, hover and selected `fg`, selected indicator `accent`, disabled `fg-disabled`; focus ring `focus`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| TAB-1 | `Tabs.test.tsx` "TAB-1" | Screen readers cannot tell which panel belongs to which tab |
| TAB-2 | `Tabs.test.tsx` "TAB-2" | Keyboard users tab through every tab or cannot switch |
| TAB-3 | `Tabs.test.tsx` "TAB-3" | Unavailable panels can be opened |
| TAB-4 | `Tabs.test.tsx` "TAB-4" | Keyboard users cannot reach panel content without interactive elements |
| a11y | `Tabs.test.tsx` axe per story | Unnamed tab list |

## Decisions / open questions
- OQ-1 (human-design): vertical tabs and overflow behavior for many tabs.
