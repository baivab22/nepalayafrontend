import mongoose from "mongoose";
import { z } from "zod/v4";

export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;

interface ContactDbRecord extends InsertContact {
  createdAt: Date;
}

const contactSchema = new mongoose.Schema<ContactDbRecord>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export const ContactModel =
  (mongoose.models.Contact as mongoose.Model<ContactDbRecord>) ||
  mongoose.model<ContactDbRecord>("Contact", contactSchema);
