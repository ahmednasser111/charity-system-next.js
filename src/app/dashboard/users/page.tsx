import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { CreateUserDialog } from '@/components/dashboard/users/CreateUserDialog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getInitialLocale } from '@/i18n/server';
import { formatDate, translate } from '@/i18n/translate';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const locale = await getInitialLocale();
  const t = (key: string) => translate(locale, key);
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await dbConnect();
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between px-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{t('users.title')}</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t('users.subtitle') || 'Manage and monitor system user accounts and roles'}
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <div className='rounded-xl border bg-card shadow-sm overflow-hidden mx-4'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-start whitespace-nowrap'>{t('users.table.systemId')}</TableHead>
                <TableHead className='text-start whitespace-nowrap'>{t('users.table.name')}</TableHead>
                <TableHead className='text-start whitespace-nowrap'>{t('users.table.email')}</TableHead>
                <TableHead className='text-start whitespace-nowrap'>{t('users.table.phone')}</TableHead>
                <TableHead className='text-start whitespace-nowrap'>{t('users.table.role')}</TableHead>
                <TableHead className='text-end whitespace-nowrap'>{t('users.table.joinedDate')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    {t('users.table.noUsers')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u._id.toString()}>
                    <TableCell className='text-muted-foreground text-xs font-medium tabular-nums'>
                      {u._id.toString()}
                    </TableCell>
                    <TableCell className='font-medium text-start'>{u.name}</TableCell>
                    <TableCell className='text-start'>{u.email}</TableCell>
                    <TableCell className='text-start'>{u.phone}</TableCell>
                    <TableCell className='text-start'>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        u.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 ring-purple-700/10' 
                          : 'bg-blue-50 text-blue-700 ring-blue-700/10'
                      }`}>
                        {t(`users.dialog.${u.role}`)}
                      </span>
                    </TableCell>
                    <TableCell className='text-end tabular-nums whitespace-nowrap'>
                      {formatDate(locale, u.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
