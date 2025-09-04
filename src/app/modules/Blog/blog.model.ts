import { model, Schema } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    coverImage: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Blog = model<IBlog>('Blog', blogSchema);
