import mongoose from "mongoose";
import { z } from "zod/v4";

export const programSchemaZ = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  duration: z.string().optional(),
  seats: z.number().optional(),
  level: z.enum(["+2", "bachelor", "masters"]),
  icon: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
});

export type Program = z.infer<typeof programSchemaZ>;

const programSchema = new mongoose.Schema<Program>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
    seats: { type: Number },
    level: { type: String, enum: ["+2", "bachelor", "masters"], required: true },
    icon: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProgramModel =
  mongoose.models.Program || mongoose.model<Program>("Program", programSchema);
