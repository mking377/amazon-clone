import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin" | "support" | "moderator" | "manager";
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastPasswordChange?: Date;       // ✅ آخر مرة غير فيها الباسورد
  passwordChangeCount?: number;    // ✅ عدد مرات تغيير الباسورد
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin", "support", "moderator", "manager"],
      default: "user",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastPasswordChange: { type: Date, default: null }, // ✅ مبدئيًا null
    passwordChangeCount: { type: Number, default: 0 }, // ✅ يبدأ من 0
  },
  { collection: "users", timestamps: true } // ✅ يضيف createdAt و updatedAt
);

export default mongoose.model<IUser>("User", userSchema);



