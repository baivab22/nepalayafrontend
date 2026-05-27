import mongoose from "mongoose";
import { z } from "zod/v4";

export const facultySchemaZ = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  description: z.string().min(2),
  department: z.string().min(2),
  photo: z.string().optional(), // photo url
  order: z.number().optional(),
});

export type Faculty = z.infer<typeof facultySchemaZ>;

const facultySchema = new mongoose.Schema<Faculty>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    photo: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FacultyModel =
  mongoose.models.Faculty || mongoose.model<Faculty>("Faculty", facultySchema);
