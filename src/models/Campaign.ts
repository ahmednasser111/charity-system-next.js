import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';
import { campaignSchema } from '../validations/campaign';

export interface ICampaign extends z.infer<typeof campaignSchema>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Completed', 'Draft'], default: 'Draft' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
