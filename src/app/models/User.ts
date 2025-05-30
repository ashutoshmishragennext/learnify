import mongoose, { Schema, Document } from "mongoose";
// import { CourseSchema, ICourse } from './Course'; // Assuming the Course schema is exported properly.

export interface ISubmoduleProgress {
  submoduleId: number; // Unique
  completed: boolean; // true if completed
  // watchedPercentage?: number;
  // timeSpent?: number; // In seconds
}
export type UserRole = 'STUDENT' | 'ADMIN';

export interface IModuleProgress {
  moduleId: number; // Identifier for the module
  submodules: ISubmoduleProgress[];
}

export interface ICourseProgress {
  courseId: string;
  modules: IModuleProgress[];
  overallCompletionPercentage: number; // Calculated percentage
  completionStatus: boolean; // True if overallCompletionPercentage === 100
  dateStarted: Date;
  dateCompleted?: Date;
  lastUpdated: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: number;
  verified: boolean;
  otp?: number;
  password?: string; // Optional for OAuth users
  avatar?: string;
  githubId?: string;
  googleId?: string;
  // coursesBought?: ICourse[];
  coursesBought?: string[];
  cart?: number[];
  wishlist?: number[];
  reviews?: string[];
  courseProgress?: ICourseProgress[];
  resetToken?: string;
  resetTokenExpiry?: Date;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  role: UserRole;
}

const SubmoduleProgressSchema: Schema = new Schema({
  submoduleId: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  // Optionally, you can include:
  // watchedPercentage: { type: Number, default: 0 },
  // timeSpent: { type: Number, default: 0 },
});

const ModuleProgressSchema: Schema = new Schema({
  moduleId: { type: Number, required: true },
  submodules: { type: [SubmoduleProgressSchema], required: true },
});

const CourseProgressSchema: Schema = new Schema({
  courseId: { type: String, required: true },
  modules: { type: [ModuleProgressSchema], required: true },
  overallCompletionPercentage: { type: Number, default: 0 },
  completionStatus: { type: Boolean, default: false },
  dateStarted: { type: Date, default: Date.now },
  dateCompleted: { type: Date },
  lastUpdated: { type: Date, default: Date.now },
});

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: {type: Number, unique: true, sparse: true},
    verified: {type: Boolean, default: false, required: true},
    otp: {type: Number},
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.githubId && !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ['STUDENT', 'ADMIN'],
      default: 'STUDENT',
      required: true,
    },
    avatar: { type: String },
    githubId: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    coursesBought: {
      type: [String], // Embedding just the courseId
      default: [],
    },
    cart: {
      type: [String],
      default: [],
    },
    wishlist: {
      type: [String],
      default: [],
    },
    reviews: { type: [String], default: [] },
    courseProgress: {
      type: [CourseProgressSchema],
      default: [],
    },
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Date, required: false },
    lastLoginAt: {type: Date, required: false},
    lastActiveAt: {type: Date, required: false}
  },
  { timestamps: true }
);

export default (mongoose.models?.User || 
  mongoose.model<IUser>("User", UserSchema));