import dbConnect from '@/lib/dbConnect';
import Campaign from '@/models/Campaign';
import { CreateCampaignDialog } from '@/components/dashboard/campaigns/CreateCampaignDialog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  const campaigns = await Campaign.find({}).sort({ createdAt: -1 });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        {['admin', 'editor'].includes(session.user.role) && <CreateCampaignDialog />}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Goal Progress</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Target Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No campaigns found.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => {
                const progress = campaign.targetAmount > 0 
                  ? Math.min(Math.round((campaign.currentAmount / campaign.targetAmount) * 100), 100) 
                  : 0;
                
                return (
                 <TableRow key={campaign._id.toString()}>
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-[60%]" />
                      <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${campaign.targetAmount.toLocaleString()}</TableCell>
                 </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
