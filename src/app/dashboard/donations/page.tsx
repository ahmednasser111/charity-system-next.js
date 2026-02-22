import dbConnect from '@/lib/dbConnect';
import Donation from '@/models/Donation';
import Campaign from '@/models/Campaign';
import { CreateDonationDialog } from '@/components/dashboard/donations/CreateDonationDialog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function DonationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  
  const query = session.user.role === 'admin' ? {} : { donorId: session.user.id };
  const donations = await Donation.find(query).populate('campaignId', 'title').sort({ createdAt: -1 });

  // Fetch active campaigns for the donation dropdown
  const activeCampaigns = await Campaign.find({ status: 'Active' }).select('_id title');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
        <CreateDonationDialog campaigns={JSON.parse(JSON.stringify(activeCampaigns))} />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {session.user.role === 'admin' && <TableHead>Donor ID</TableHead>}
              <TableHead>Campaign</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={session.user.role === 'admin' ? 6 : 5} className="h-24 text-center">
                  No donations found.
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => (
                <TableRow key={donation._id.toString()}>
                  {session.user.role === 'admin' && (
                     <TableCell className="font-medium text-xs text-muted-foreground break-all">
                       {donation.donorId?.toString() || 'Anonymous'}
                     </TableCell>
                  )}
                  <TableCell>{donation.campaignId?.title || 'Unknown'}</TableCell>
                  <TableCell className="font-semibold text-green-600">${donation.amount}</TableCell>
                  <TableCell>{donation.paymentMethod}</TableCell>
                  <TableCell>{donation.status}</TableCell>
                  <TableCell className="text-right">{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
