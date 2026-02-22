import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';
import { donationSchema } from '../validations/donation';

export interface IDonation extends z.infer<typeof donationSchema>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema = new Schema(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'User' },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'], required: true },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);
