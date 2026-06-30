import mongoose from "mongoose";
import { z } from "zod/v4";

export const gallerySchemaZ = z.object({
  url: z.string().min(1, "URL is required"),
  filename: z.string().min(1, "Filename is required"),
  title: z.string().default("Gallery Image"),
  category: z.string().default("Uncategorized"),
});

export type Gallery = z.infer<typeof gallerySchemaZ>;

const gallerySchema = new mongoose.Schema<Gallery>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    title: { type: String, default: "Gallery Image" },
    category: { type: String, default: "Uncategorized" },
  },
  { timestamps: true }
);

export const GalleryModel =
  mongoose.models.Gallery || mongoose.model<Gallery>("Gallery", gallerySchema);
