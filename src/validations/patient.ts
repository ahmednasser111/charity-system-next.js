import { z } from 'zod';

export const patientSchema = z.object({
  userId: z.string().optional(), // Will be linked to a User document
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().int().min(0).max(150),
  ssn: z.string().min(14).max(14), // Assuming Egyptian National ID
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
  status: z.enum(['pending', 'approved', 'rejected']),
  children: z.number().int().min(0),
  governorate: z.string().min(2),
  address: z.string().min(5),
  diagnosis: z.string().min(5),
  solution: z.string().min(5),
  cost: z.number().min(0),
});

export type PatientInput = z.infer<typeof patientSchema>;
