import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
