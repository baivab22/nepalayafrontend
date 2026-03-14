import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { admissionsTable, insertAdmissionSchema } from "@workspace/db/schema";

const router: IRouter = Router();

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

    const [admission] = await db
      .insert(admissionsTable)
      .values(parsed.data)
      .returning();

    res.status(201).json({
      ...admission,
      createdAt: admission.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Admission submission error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

router.get("/admissions", async (_req, res) => {
  try {
    const admissions = await db.select().from(admissionsTable);
    res.json(
      admissions.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error("Fetch admissions error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

export default router;
