import mongoose from "mongoose";
import { z } from "zod/v4";

const genderValues = ["male", "female", "other"] as const;
const levelValues = ["bachelor", "master", "phd"] as const;
const statusValues = ["pending", "accepted", "rejected"] as const;

export const insertAdmissionSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(1),
  dateOfBirth: z.string().min(1),
  gender: z.enum(genderValues),
  address: z.string().min(1),
  district: z.string().min(1),
  program: z.string().min(1),
  level: z.enum(levelValues),
  previousSchool: z.string().min(1),
  gpa: z.string().optional(),
  message: z.string().optional(),
});

export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;

interface AdmissionDbRecord extends InsertAdmission {
  status: (typeof statusValues)[number];
  createdAt: Date;
}

const admissionSchema = new mongoose.Schema<AdmissionDbRecord>(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true, trim: true },
    gender: { type: String, enum: genderValues, required: true },
    address: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    program: { type: String, required: true, trim: true },
    level: { type: String, enum: levelValues, required: true },
    previousSchool: { type: String, required: true, trim: true },
    gpa: { type: String, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: statusValues,
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export const AdmissionModel =
  (mongoose.models.Admission as mongoose.Model<AdmissionDbRecord>) ||
  mongoose.model<AdmissionDbRecord>("Admission", admissionSchema);

export type Admission = InsertAdmission & {
  id: string;
  status: (typeof statusValues)[number];
  createdAt: Date;
};
