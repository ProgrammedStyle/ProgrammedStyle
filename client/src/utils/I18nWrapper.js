import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export default function I18nWrapper({ locale, pageProps, children }) {
  useEffect(() => {
    // Change i18n language when locale changes
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  useEffect(() => {
    // Add resources if provided
    if (pageProps._nextI18Next?.initialLocale && pageProps._nextI18Next?.initialI18nStore) {
      const { initialLocale, initialI18nStore } = pageProps._nextI18Next;
      Object.keys(initialI18nStore).forEach((lng) => {
        Object.keys(initialI18nStore[lng]).forEach((ns) => {
          i18n.addResourceBundle(lng, ns, initialI18nStore[lng][ns], true, true);
        });
      });
      if (i18n.language !== initialLocale) {
        i18n.changeLanguage(initialLocale);
      }
    }
  }, [pageProps]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

