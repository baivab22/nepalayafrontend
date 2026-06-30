import mongoose from "mongoose";
import { z } from "zod/v4";

export const sliderSchemaZ = z.object({
  media: z.string().min(1, "Media is required"),
  type: z.enum(["image", "video"]).default("image"),
  order: z.number().default(0),
  active: z.boolean().default(true),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  description: z.string().default(""),
  ctaText: z.string().default(""),
  ctaLink: z.string().default(""),
});

export type Slider = z.infer<typeof sliderSchemaZ>;

const sliderSchema = new mongoose.Schema<Slider>(
  {
    media: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    ctaText: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SliderModel =
  mongoose.models.Slider || mongoose.model<Slider>("Slider", sliderSchema);
