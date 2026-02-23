'use client';

import { useI18n } from '@/components/providers/I18nProvider';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
      title={locale === 'ar' ? 'English' : 'العربية'}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">Switch Language</span>
    </Button>
  );
}
