import mongoose, { Schema, Document } from "mongoose";

export interface IPermissionRequest extends Document {
  userId: string; // Supabase user ID
  studentId: string; // Student ID from User collection
  studentName: string;
  email: string;
  department: string;
  section: string;
  semester: string;
  requestType: string; // 'leave', 'exam_absence', 'medical', 'personal', etc.
  subject: string;
  reason: string;
  attachments?: string[]; // File URLs if any
  status: 'pending' | 'approved' | 'rejected';
  facultyComments?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Faculty user ID
}

const PermissionRequestSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: String, required: true },
    requestType: { 
      type: String, 
      required: true,
      enum: ['leave', 'exam_absence', 'medical', 'personal', 'family_emergency', 'official_work']
    },
    subject: { type: String, required: true },
    reason: { type: String, required: true },
    attachments: [{ type: String }],
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    facultyComments: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
  },
  { timestamps: true }
);

// Avoid model overwrite when hot-reloading
export default mongoose.models.PermissionRequest || 
  mongoose.model<IPermissionRequest>("PermissionRequest", PermissionRequestSchema);
