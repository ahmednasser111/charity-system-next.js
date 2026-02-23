import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { getInitialLocale } from '@/i18n/server';
import { translate } from '@/i18n/translate';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const locale = await getInitialLocale();
  const t = (key: string) => translate(locale, key);
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  await dbConnect();
  const user = await User.findById(session.user.id).select('-password');

  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
        <p className="text-muted-foreground">{t('profile.userNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
      
      <div className="grid gap-6 items-start">
        <ProfileForm 
          user={{
            name: user.name,
            email: user.email,
            phone: user.phone,
          }} 
        />
      </div>
    </div>
  );
}
