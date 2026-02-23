import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from './translate';

export async function getInitialLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value;

  if (lang && SUPPORTED_LOCALES.includes(lang as Locale)) {
    return lang as Locale;
  }

  return DEFAULT_LOCALE;
}
