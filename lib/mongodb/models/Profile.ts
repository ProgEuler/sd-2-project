import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  supabase_user_id: string;
  email: string;
  full_name: string;
  role: 'student' | 'faculty' | 'admin';
  student_id?: string;
  department?: string;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema: Schema = new Schema({
  supabase_user_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  student_id: {
    type: String,
    sparse: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better performance
ProfileSchema.index({ role: 1 });
ProfileSchema.index({ email: 1 });
ProfileSchema.index({ student_id: 1 }, { sparse: true });

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);