import { getTranslations } from 'next-intl/server';
import { DsShowcase } from './_demo/ds-showcase';

export default async function HomePage() {
  const t = await getTranslations('common');
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">{t('appName')}</h1>
      <DsShowcase />
    </main>
  );
}
