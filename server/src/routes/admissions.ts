import { Router, type IRouter } from "express";
import { AdmissionModel, insertAdmissionSchema } from "../db/schema";

const router: IRouter = Router();

type AdmissionRecord = {
  _id: { toString(): string };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  district: string;
  program: string;
  level: string;
  previousSchool: string;
  gpa?: string;
  message?: string;
  status: string;
  createdAt: Date | string;
};

const serializeAdmission = (admission: AdmissionRecord) => ({
  id: admission._id.toString(),
  firstName: admission.firstName,
  lastName: admission.lastName,
  email: admission.email,
  phone: admission.phone,
  dateOfBirth: admission.dateOfBirth,
  gender: admission.gender,
  address: admission.address,
  district: admission.district,
  program: admission.program,
  level: admission.level,
  previousSchool: admission.previousSchool,
  gpa: admission.gpa,
  message: admission.message,
  status: admission.status,
  createdAt:
    admission.createdAt instanceof Date
      ? admission.createdAt.toISOString()
      : new Date(admission.createdAt).toISOString(),
});

router.post("/admissions", async (req, res) => {
  try {
    const parsed = insertAdmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: JSON.stringify(parsed.error.issues),
      });
      return;
    }

    const createdAdmission = await AdmissionModel.create(parsed.data);
    res
      .status(201)
      .json(serializeAdmission(createdAdmission.toObject() as AdmissionRecord));
  } catch (err) {
    console.error("Admission submission error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

router.get("/admissions", async (_req, res) => {
  try {
    const admissions = await AdmissionModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json(admissions.map((a) => serializeAdmission(a as AdmissionRecord)));
  } catch (err) {
    console.error("Fetch admissions error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.get("/admissions/:id", async (req, res) => {
  try {
    const admission = await AdmissionModel.findById(req.params.id).lean().exec();
    if (!admission) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json(serializeAdmission(admission as AdmissionRecord));
  } catch (err) {
    console.error("Fetch admission error:", err);
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

router.patch("/admissions/:id", async (req, res) => {
  try {
    const { status } = req.body as { status: string };
    if (!["pending", "accepted", "rejected"].includes(status)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }
    const admission = await AdmissionModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
      .lean()
      .exec();
    if (!admission) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json(serializeAdmission(admission as AdmissionRecord));
  } catch (err) {
    console.error("Update admission error:", err);
    res.status(500).json({ error: "Failed to update application" });
  }
});

router.delete("/admissions/:id", async (req, res) => {
  try {
    const admission = await AdmissionModel.findByIdAndDelete(req.params.id).exec();
    if (!admission) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error("Delete admission error:", err);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

export default router;
