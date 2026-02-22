import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';
import { patientSchema } from '../validations/patient';

export interface IPatient extends z.infer<typeof patientSchema>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    ssn: { type: String, required: true },
    phone: { type: String, required: true },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'], default: 'single' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    children: { type: Number, default: 0 },
    governorate: { type: String, required: true },
    address: { type: String, required: true },
    diagnosis: { type: String, required: true },
    solution: { type: String, required: true },
    cost: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
