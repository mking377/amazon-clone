// frontend/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import nextIntlConfig from '../next-intl.config';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? nextIntlConfig.defaultLocale;
  return {
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    locale: resolvedLocale
  };
});

