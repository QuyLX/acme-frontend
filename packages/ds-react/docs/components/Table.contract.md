---
id: DS-TABLE
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/table/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Table (DS-TABLE)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: static grid primitives `Table`, `TableHeader`, `Column`, `TableBody`, `Row`, `Cell`; grid keyboard navigation; sort indicator and `aria-sort`; selection column (row checkboxes, "Select All"); empty-state slot. Not owned: data fetching, server-side sort/filter/pagination, column resizing, virtualization, bulk actions (resource-table pattern, Experience tier).

## Public concepts
`Table aria-label` (required) > `TableHeader` > `Column id isRowHeader? allowsSorting?` and `TableBody items? renderEmptyState?` > `Row id` > `Cell`. Selection: `selectionMode` none | single | multiple, `selectedKeys`/`defaultSelectedKeys`, `onSelectionChange`, `disabledKeys`. Sorting: controlled `sortDescriptor` + `onSortChange`; the consumer sorts the data.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| TBL-1 | The table is a `grid` named by `aria-label` with `columnheader`s and `rowheader`s; Tab enters the grid once and arrow keys move focus between rows and cells | APG Grid |
| TBL-2 | A sortable column exposes `aria-sort`; pressing its header toggles the direction through `onSortChange` | APG Sortable Table; React Aria Table |
| TBL-3 | With multiple selection each row has a named checkbox, selection is exposed with `aria-selected`, and "Select All" selects every row | APG Grid (selection) |
| TBL-4 | A disabled row is exposed as disabled and cannot be selected | React Aria Table |

## Allowed variation
Cell padding within the spacing scale; header background; sort glyph; row hover and selected fills.

## A11y contract
Pattern: APG Grid (React Aria Table). jsdom lane: axe per story (static, sortable, single and multiple selection, disabled rows, empty). Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Container `surface` + `border`, radius `md`; header `subtle`, header text `fg-muted`; row dividers `border`; hover and selected rows `subtle`; disabled rows `fg-disabled`; selection checkbox as DS-CHECKBOX; focus outline `focus` (inset).

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| TBL-1 | `Table.test.tsx` "TBL-1" | Screen-reader users cannot relate cells to headers; keyboard users tab through every cell |
| TBL-2 | `Table.test.tsx` "TBL-2" | Sort order is invisible to assistive technology |
| TBL-3 | `Table.test.tsx` "TBL-3" | Bulk selection is impossible by keyboard or unannounced |
| TBL-4 | `Table.test.tsx` "TBL-4" | Locked resources are included in bulk actions |
| a11y | `Table.test.tsx` axe per story | Unnamed grid or checkboxes, empty headers |

## Decisions / open questions
- OQ-1 (human-design): selected-row fill (currently the same as hover; a dedicated `selected` token would separate them).
- OQ-2 (DS owner): column resizing and sticky header — add when the resource-table pattern needs them (§15.3).
