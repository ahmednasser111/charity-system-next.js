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

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await dbConnect();
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Users Management</h1>
        <CreateUserDialog />
      </div>

      <div className='rounded-md border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>System ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className='text-right'>Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No users found.
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
                  <TableCell className='capitalize'>{u.role}</TableCell>
                  <TableCell className='text-right'>
                    {new Date(u.createdAt).toLocaleDateString('en-GB')}
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
