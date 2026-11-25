import { InlineAlert, Link } from '@platform/ds-react';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('errors');
  return (
    <>
      <h1 className="text-2xl font-semibold">{t('notFoundTitle')}</h1>
      <InlineAlert tone="warning" title={t('notFoundTitle')}>
        {t('notFoundBody')} <Link href="/tenants">{t('backToList')}</Link>
      </InlineAlert>
    </>
  );
}
