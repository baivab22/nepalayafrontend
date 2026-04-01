import mongoose from "mongoose";
import { z } from "zod/v4";

export const programSchemaZ = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  icon: z.string().optional(), // icon name or url
  order: z.number().optional(),
});

export type Program = z.infer<typeof programSchemaZ>;

const programSchema = new mongoose.Schema<Program>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProgramModel =
  mongoose.models.Program || mongoose.model<Program>("Program", programSchema);
