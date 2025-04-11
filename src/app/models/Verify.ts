import mongoose, { Schema, Document } from 'mongoose';
// import { CourseSchema, ICourse } from './Course'; // Assuming the Course schema is exported properly.

export interface IVerify extends Document {
    email: string;
    token: string;
    expires: Date;
}

const VerifySchema: Schema = new Schema(
    {
        email:{ type: String, unique: true },
        token: { type: String, unique: true },
        expires: { type: Date }
    },
    { timestamps: true }
);


export default mongoose.models.Verify || mongoose.model<IVerify>('Verify', VerifySchema);

