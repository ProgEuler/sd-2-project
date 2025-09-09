import mongoose, { Schema, Document } from 'mongoose';

export interface IPermissionSlip extends Document {
  student_id: string;
  reason_of_exception: string;
  description: string;
  due_amount: number;
  emergency_contact_phone: string;
  status: 'pending' | 'approved' | 'rejected';
  faculty_reviewer_id?: string;
  faculty_comments?: string;
  reviewed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const PermissionSlipSchema: Schema = new Schema({
  student_id: {
    type: String,
    required: true,
    index: true
  },
  reason_of_exception: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  due_amount: {
    type: Number,
    required: true,
    min: 0
  },
  emergency_contact_phone: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  faculty_reviewer_id: {
    type: String,
    index: true
  },
  faculty_comments: {
    type: String
  },
  reviewed_at: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better performance
PermissionSlipSchema.index({ student_id: 1, status: 1 });
PermissionSlipSchema.index({ created_at: -1 });
PermissionSlipSchema.index({ due_amount: 1 });

export default mongoose.models.PermissionSlip || mongoose.model<IPermissionSlip>('PermissionSlip', PermissionSlipSchema);