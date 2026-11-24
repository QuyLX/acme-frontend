import type { ComponentDoc } from '../doc';
import type { MenuProps } from './Menu';

export default {
  name: 'Menu',
  status: 'experimental',
  summary: 'List of actions opened from a button (menu button). Wrap a Button and a Menu in MenuTrigger; items are MenuItem.',
  a11yPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/',
  contract: 'DS-MENU',
  props: {
    children: 'MenuItem elements, or a render function when `items` is passed.',
    items: 'Optional dynamic items; each needs an `id`.',
    onAction: 'Called with the id of the activated MenuItem; the menu then closes.',
    disabledKeys: 'Ids of items that cannot be activated.',
    placement: 'bottom start (default), bottom end, top start or top end.',
    'aria-label': 'Needed only when the trigger label does not describe the menu.',
  },
  do: [
    'Give every MenuItem an id and handle actions in onAction.',
    'Use MenuItem tone="danger" for destructive actions and confirm them in a Dialog.',
    'Put row actions of a table in a menu triggered by a ghost icon Button with aria-label.',
  ],
  dont: ['Do not use a Menu for navigation between pages; use Link or Tabs.', 'Do not use a Menu to pick a form value; use Select.'],
} satisfies ComponentDoc<MenuProps>;
