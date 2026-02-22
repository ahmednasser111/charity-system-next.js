import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';
import { userSchema, userRoleSchema } from '../validations/auth';

export interface IUser extends z.infer<typeof userSchema>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user', 'donor', 'volunteer'], default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
