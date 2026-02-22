import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import Campaign from '@/models/Campaign';
import Donation from '@/models/Donation';
import User from '@/models/User';
import { Users, FileText, HeartHandshake, UserPlus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  let patientCount = 0;
  let campaignCount = 0;
  let donationCount = 0;
  let userCount = 0;
  let totalDonations = 0;

  try {
    patientCount = await Patient.countDocuments();
    campaignCount = await Campaign.countDocuments();
    userCount = await User.countDocuments();

    if (session?.user?.role === 'admin') {
      donationCount = await Donation.countDocuments();
      const donAggr = await Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
      totalDonations = donAggr[0]?.total || 0;
    } else if (session?.user?.id) {
       donationCount = await Donation.countDocuments({ donorId: session.user.id });
       const donAggr = await Donation.aggregate([
           { $match: { donorId: session.user.id } },
           { $group: { _id: null, total: { $sum: "$amount" } } }
       ]);
       totalDonations = donAggr[0]?.total || 0;
    }

  } catch (error) {
    console.error('Error fetching dashboard stats', error);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {session?.user?.role === 'admin' && (
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
            </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{campaignCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <HeartHandshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From {donationCount} contributions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
