import { Suspense } from 'react';
import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInitialLocale } from '@/i18n/server';
import { translate } from '@/i18n/translate';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default async function LoginPage() {
  const locale = await getInitialLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl tracking-tight">{t('common.appName')}</CardTitle>
            <CardDescription>
              {t('auth.loginSubtitle')}
            </CardDescription>
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
