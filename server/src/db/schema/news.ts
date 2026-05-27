import mongoose from "mongoose";
import { z } from "zod/v4";

export const newsSchemaZ = z.object({
  title: z.string().min(2),
  date: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(2),
  image: z.string().optional(), // image url
  order: z.number().optional(),
});

export type News = z.infer<typeof newsSchemaZ>;

const newsSchema = new mongoose.Schema<News>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const NewsModel =
  mongoose.models.News || mongoose.model<News>("News", newsSchema);
