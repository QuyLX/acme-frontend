import { composeStories } from '@storybook/react-vite';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { axeViolations } from '../../test/a11y';
import { Cell, Column, Row, Table, TableBody, TableHeader } from './Table';
import * as stories from './Table.stories';

const { Default, Sortable, MultipleSelection } = composeStories(stories);

describe('Table stories (jsdom a11y lane)', () => {
  for (const [name, Story] of Object.entries(composeStories(stories))) {
    test(`${name} renders without axe violations`, async () => {
      const { container } = render(<Story />);
      expect(await axeViolations(container)).toEqual([]);
    });
  }
});

describe('Table contract DS-TABLE', () => {
  test('TBL-1: exposed as a named grid with column headers and row headers; Tab enters once and arrow keys move between rows', async () => {
    render(<Default />);
    const grid = screen.getByRole('grid', { name: 'Instances' });
    expect(within(grid).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Name', 'Status', 'vCPU']);
    expect(within(grid).getAllByRole('rowheader').map((th) => th.textContent)).toEqual(['web-01', 'db-01', 'cache-01']);
    await userEvent.tab();
    const rows = within(grid).getAllByRole('row');
    expect(document.activeElement).toBe(rows[1]);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(rows[2]);
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(within(rows[2]!).getByRole('rowheader'));
  });

  test('TBL-2: a sortable column exposes aria-sort and pressing it toggles the direction', async () => {
    render(<Sortable />);
    const name = screen.getByRole('columnheader', { name: /Name/ });
    expect(name.getAttribute('aria-sort')).toBe('ascending');
    expect(screen.getByRole('columnheader', { name: 'Status' }).getAttribute('aria-sort')).toBeNull();
    await userEvent.click(name);
    expect(name.getAttribute('aria-sort')).toBe('descending');
    expect(screen.getAllByRole('rowheader').map((th) => th.textContent)).toEqual(['web-01', 'db-01', 'cache-01']);
  });

  test('TBL-3: multiple selection: each row has a named checkbox, selection is exposed with aria-selected, "Select All" selects every row', async () => {
    const onSelectionChange = vi.fn();
    render(<MultipleSelection onSelectionChange={onSelectionChange} />);
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
    await userEvent.click(within(rows[0]!).getByRole('checkbox', { name: /Select/ }));
    expect(rows[0]!.getAttribute('aria-selected')).toBe('true');
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select All' }));
    expect(rows.map((row) => row.getAttribute('aria-selected'))).toEqual(['true', 'true', 'true']);
    expect(onSelectionChange).toHaveBeenLastCalledWith('all');
  });

  test('TBL-4: a disabled row cannot be selected', async () => {
    render(
      <Table aria-label="Instances" selectionMode="multiple" disabledKeys={['b']}>
        <TableHeader>
          <Column isRowHeader>Name</Column>
        </TableHeader>
        <TableBody>
          <Row id="a"><Cell>web-01</Cell></Row>
          <Row id="b"><Cell>db-01</Cell></Row>
        </TableBody>
      </Table>,
    );
    const row = screen.getAllByRole('row')[2]!;
    expect(row.getAttribute('aria-disabled')).toBe('true');
    const checkbox = within(row).getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
    await userEvent.click(row);
    expect(row.getAttribute('aria-selected')).toBe('false');
  });
});
