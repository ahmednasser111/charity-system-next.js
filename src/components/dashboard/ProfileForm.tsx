'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/components/providers/I18nProvider';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { t } = useI18n();

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{t('profile.info')}</CardTitle>
        <CardDescription>{t('profile.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('profile.name')}</Label>
            <Input value={user.name} disabled />
          </div>

          <div className="space-y-2">
            <Label>{t('profile.email')}</Label>
            <Input value={user.email} disabled type="email" />
          </div>

          <div className="space-y-2">
            <Label>{t('profile.phone')}</Label>
            <Input value={user.phone || ''} disabled />
          </div>

          <Button type="button" disabled className="w-full">
            {t('profile.readOnly')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
