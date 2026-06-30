import mongoose from "mongoose";
import { z } from "zod/v4";

export const noticeSchemaZ = z.object({
  title: z.string().min(2),
  date: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(2),
  image: z.string().optional(),
  order: z.number().optional(),
});

export type Notice = z.infer<typeof noticeSchemaZ>;

const noticeSchema = new mongoose.Schema<Notice>(
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

export const NoticeModel =
  mongoose.models.Notice || mongoose.model<Notice>("Notice", noticeSchema);
