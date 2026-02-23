'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translate as t } from '@/i18n/translate';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Persist in cookie
    document.cookie = `lang=${newLocale}; path=/; max-age=31536000`;
    // Reload to apply direction changes to html tag (simplest way to ensure everything updates)
    window.location.reload();
  };

  const translate = (key: string) => t(locale, key);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translate }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
