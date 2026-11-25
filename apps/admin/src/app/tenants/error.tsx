'use client';
import { Button, InlineAlert } from '@platform/ds-react';
import { useTranslations } from 'next-intl';

/** Never shows the error message or stack (FE §19.6): only a generic text and the digest as request reference. */
export default function TenantsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('errors');
  const tc = useTranslations('common');
  return (
    <InlineAlert tone="danger" title={t('unavailableTitle')}>
      <p>{t('unavailableBody')}</p>
      {error.digest ? <p>{tc('requestId', { id: error.digest })}</p> : null}
      <Button onPress={reset}>{t('retry')}</Button>
    </InlineAlert>
  );
}
