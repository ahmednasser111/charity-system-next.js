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
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>{t('users.title')}</h1>
        <CreateUserDialog />
      </div>

      <div className='rounded-md border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('users.table.systemId')}</TableHead>
              <TableHead>{t('users.table.name')}</TableHead>
              <TableHead>{t('users.table.email')}</TableHead>
              <TableHead>{t('users.table.phone')}</TableHead>
              <TableHead>{t('users.table.role')}</TableHead>
              <TableHead className='text-right'>{t('users.table.joinedDate')}</TableHead>
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
                  <TableCell className='text-muted-foreground text-xs font-medium'>
                    {u._id.toString()}
                  </TableCell>
                  <TableCell className='font-medium'>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell className='capitalize'>{t(`users.dialog.${u.role}`)}</TableCell>
                  <TableCell className='text-right'>
                    {formatDate(locale, u.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
