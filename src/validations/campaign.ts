import { z } from 'zod';

export const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  targetAmount: z.number().min(1, 'Target amount must be greater than 0'),
  currentAmount: z.number().min(0),
  status: z.enum(['Active', 'Completed', 'Draft']),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
