import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  supabaseId: string;
  email: string;
  name: string;
  role: string;
  section?: string;
  department?: string;
  student_id?: string;
  semester?: string;
}

const UserSchema: Schema = new Schema(
  {
    supabaseId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    section: { type: String },
    department: { type: String },
    student_id: { type: String },
    semester: { type: String },
  },
  { timestamps: true }
);

// Avoid model overwrite when hot-reloading
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
