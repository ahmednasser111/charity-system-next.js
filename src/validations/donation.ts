import { z } from 'zod';

export const donationSchema = z.object({
  donorId: z.string().optional(), // Can be anonymous if optional, or linked to User
  campaignId: z.string(), // Linked to Campaign
  amount: z.number().min(1, 'Donation amount must be at least 1'),
  status: z.enum(['Pending', 'Completed', 'Failed']),
  paymentMethod: z.enum(['Credit Card', 'PayPal', 'Bank Transfer', 'Cash']),
  transactionDate: z.string().or(z.date()).optional(),
});

export type DonationInput = z.infer<typeof donationSchema>;
