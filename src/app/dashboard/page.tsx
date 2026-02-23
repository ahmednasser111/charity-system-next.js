import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import User from '@/models/User';
import { Users, UserPlus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getInitialLocale } from '@/i18n/server';
import { formatNumber, translate } from '@/i18n/translate';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const locale = await getInitialLocale();
  await dbConnect();
  const session = await getServerSession(authOptions);

  let patientCount = 0;
  let userCount = 0;

  try {
    patientCount = await Patient.countDocuments();
    userCount = await User.countDocuments();
  } catch (error) {
    console.error('Error fetching dashboard stats', error);
  }

  const t = (key: string) => translate(locale, key);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.overviewTitle')}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {session?.user?.role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalUsers')}</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(locale, userCount)}</div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalPatients')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(locale, patientCount)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
