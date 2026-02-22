import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Donation from '@/models/Donation';
import { donationSchema } from '@/validations/donation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import Campaign from '@/models/Campaign';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // Admin sees all donations, users/donors see their own
    const query = session.user.role === 'admin' ? {} : { donorId: session.user.id };
    
    const donations = await Donation.find(query).populate('campaignId', 'title').sort({ createdAt: -1 });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Anyone logged in can donate
    if (!session) {
      return NextResponse.json({ error: 'Please login to make a donation' }, { status: 401 });
    }

    const body = await request.json();
    
    // Automatically attach donor ID from session if not anonymous
    if (!body.donorId) {
       body.donorId = session.user.id;
    }

    const validatedData = donationSchema.parse(body);

    await dbConnect();
    
    // Create the donation
    const donation = await Donation.create(validatedData);
    
    // Update Campaign currentAmount
    if (donation.status === 'Completed') {
       await Campaign.findByIdAndUpdate(
         validatedData.campaignId,
         { $inc: { currentAmount: validatedData.amount } }
       );
    }
    
    return NextResponse.json(donation, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
  }
}
