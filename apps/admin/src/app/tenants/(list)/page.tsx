import { Badge, Cell, Column, EmptyState, Link, Row, Table, TableBody, TableHeader } from '@platform/ds-react';
import { readTenantList, type TenantRow } from '@admin/tenants';
import { getTranslations } from 'next-intl/server';
import { currentAccess } from '../access';

const tone = (s: TenantRow['status']) => (s === 'active' ? 'success' : 'warning');

export default async function TenantsPage({ searchParams }: { searchParams: Promise<{ cursor?: string }> }) {
  const { cursor } = await searchParams;
  const t = await getTranslations('tenants');
  const page = await readTenantList(await currentAccess(), { cursor });
  return (
    <>
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      {page.items.length === 0 ? (
        <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <Table aria-label={t('tableLabel')}>
          <TableHeader>
            <Column isRowHeader>{t('columnName')}</Column>
            <Column>{t('columnStatus')}</Column>
          </TableHeader>
          <TableBody>
            {page.items.map((tenant) => (
              <Row key={tenant.id} id={tenant.id}>
                <Cell>
                  <Link href={`/tenants/${tenant.id}`}>{tenant.name}</Link>
                </Cell>
                <Cell>
                  <Badge tone={tone(tenant.status)}>{t(`status.${tenant.status}`)}</Badge>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      )}
      {page.nextCursor ? (
        <Link variant="standalone" href={`/tenants?cursor=${encodeURIComponent(page.nextCursor)}`}>
          {t('next')}
        </Link>
      ) : null}
    </>
  );
}
