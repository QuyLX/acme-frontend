import { InlineAlert } from '@platform/ds-react';
import { getTranslations } from 'next-intl/server';

export default async function Forbidden() {
  const t = await getTranslations('errors');
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">{t('forbiddenTitle')}</h1>
      <InlineAlert tone="danger" title={t('forbiddenTitle')}>{t('forbiddenBody')}</InlineAlert>
    </main>
  );
}
