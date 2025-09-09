import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: Date;
  updated_at: Date;
}

const NotificationSchema: Schema = new Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better performance
NotificationSchema.index({ user_id: 1, read: 1 });
NotificationSchema.index({ created_at: -1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);