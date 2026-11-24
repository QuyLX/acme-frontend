---
id: DS-TOAST
kind: component
status: PROPOSED
version: "0.1"
owner: team-platform
authority: intent
describes: ["packages/ds-react/src/toast/**"]
basedOn: ["FE-BLUEPRINT@4.1"]
---
# Contract Spec — Toast (DS-TOAST)

> PROPOSED: moving to ACTIVE needs a `specification-review` by the Design System owner (Standard §9.10).

## Ownership boundary
Owned: `Toast` (one notification: title, description, tone, close button), `ToastRegion` (landmark, stacking, keyboard access, pause on hover/focus), `createToastQueue` and `showToast` (queue and DS timeout policy). Not owned: when to notify, message wording, global app-shell placement of the region.

## Public concepts
`createToastQueue({ maxVisibleToasts = 3 })` → `ToastQueue`; `<ToastRegion queue>` rendered once per app shell; `showToast(queue, { title, description?, tone? }, { timeout?, onClose? })` → key; `queue.close(key)`. Tones: neutral | success | danger. Timeout policy: 5000 ms by default; `danger` never auto-dismisses.

Built on React Aria Components 1.22.1 `UNSTABLE_Toast`, `UNSTABLE_ToastRegion`, `UNSTABLE_ToastContent` and `UNSTABLE_ToastQueue`. The `UNSTABLE_` prefix means React Aria may change this API in a minor release; the wrapper isolates consumers from it.

## Behavioral contract
| ID | Invariant | Basis |
|---|---|---|
| TST-1 | A shown toast is rendered in a region landmark whose name states the notification count (React Aria: "1 notification."); each toast is an `alertdialog` named by its title and described by its description, and its content is announced through `role="alert"` | APG Alert; React Aria useToast |
| TST-2 | The close button is named "Close", is reachable by keyboard and removes the toast (calling `onClose`) | WCAG 2.2.1, 2.1.1 |
| TST-3 | Neutral and success toasts auto-dismiss after their timeout; danger toasts stay until closed | WCAG 2.2.1 (errors must not vanish) |
| TST-4 | At most `maxVisibleToasts` toasts are visible; the rest wait in the queue | React Aria ToastQueue |

## Allowed variation
Width, position (corner), stacking direction, enter/exit animation (none under reduced motion).

## A11y contract
Pattern: alert (React Aria uses `alertdialog` + inner `role="alert"`, so every toast is announced assertively; there is no polite variant in 1.22.1). F6 moves focus to the region; timers pause while the region is hovered or focused. jsdom lane: axe on the trigger and on the visible region per story. Real-browser lane: Storybook addon-a11y.

## Theming anatomy
Neutral `surface` + `fg`; success `success-subtle` + `success-text`; danger `danger-subtle` + `danger-text`; border `border`; `shadow-md`; radius `md`; close hover `subtle`; focus ring `focus`.

## Verification map
| Clause | Check | What goes wrong if removed |
|---|---|---|
| TST-1 | `Toast.test.tsx` "TST-1" | Screen-reader users never hear the outcome |
| TST-2 | `Toast.test.tsx` "TST-2" | Toasts cannot be dismissed by keyboard |
| TST-3 | `Toast.test.tsx` "TST-3" | Error messages vanish before they are read |
| TST-4 | `Toast.test.tsx` "TST-4" | Toasts flood the screen |
| a11y | `Toast.test.tsx` axe per story (trigger and visible toast) | Unnamed region or close button |

## Decisions / open questions
- OQ-1 (DS owner): polite (`role="status"`) announcements for neutral/success toasts need a React Aria change or a custom region; React Aria's toast is always assertive.
- OQ-2 (human-design): warning tone and an optional action button (needs a longer or no timeout).
