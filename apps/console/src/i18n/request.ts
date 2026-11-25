import { createRequestConfig } from '@platform/i18n';
import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

const config = createRequestConfig((locale) => import(`../../messages/${locale}.json`).then((m) => m.default));

export default getRequestConfig(async (params) => config({ ...params, locale: params.locale ?? (await cookies()).get('NEXT_LOCALE')?.value }));
