import { Badge, Breadcrumb, Breadcrumbs } from '@platform/ds-react';
import { readTenant } from '@admin/tenants';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { currentAccess } from '../access';

export default async function TenantDetailPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  if (!z.uuid().safeParse(tenantId).success) notFound();
  const t = await getTranslations('tenants');
  const tc = await getTranslations('common');
  const tenant = await readTenant(await currentAccess(), tenantId);
  if (!tenant) notFound();
  return (
    <>
      <Breadcrumbs aria-label={tc('breadcrumbs')}>
        <Breadcrumb href="/tenants">{t('title')}</Breadcrumb>
        <Breadcrumb>{tenant.name}</Breadcrumb>
      </Breadcrumbs>
      <h1 className="text-2xl font-semibold">{tenant.name}</h1>
      <Badge tone={tenant.status === 'active' ? 'success' : 'warning'}>{t(`status.${tenant.status}`)}</Badge>
    </>
  );
}
