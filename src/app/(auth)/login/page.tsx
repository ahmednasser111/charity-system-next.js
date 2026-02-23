import { Suspense } from 'react';
import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInitialLocale } from '@/i18n/server';
import { translate } from '@/i18n/translate';
import { LanguageSwitcher } from '@/components/dashboard/LanguageSwitcher';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default async function LoginPage() {
  const locale = await getInitialLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-muted/30">
      <div className="absolute top-4 end-4 md:top-8 md:end-8">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Card className="border-none shadow-xl bg-card">
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight text-primary">
                {t('common.appName')}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                {t('auth.loginSubtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-24 flex items-center justify-center">{t('common.loading')}</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
