import en from './locales/en.json';
import ar from './locales/ar.json';

export type Locale = 'en' | 'ar';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'ar';

const translations: Record<Locale, any> = {
  en,
  ar,
};

export function translate(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key missing in Arabic
      if (locale === 'ar') {
        return translate('en', key);
      }
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}

export function formatNumber(locale: Locale, number: number): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-GB').format(number);
}

export function formatDate(locale: Locale, date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'medium',
  }).format(d);
}
