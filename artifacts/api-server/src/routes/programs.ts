import { Router, type IRouter } from "express";
import { ProgramModel, programSchemaZ } from "@workspace/db/schema";

const router: IRouter = Router();

// CREATE
router.post("/programs", async (req, res) => {
  const parsed = programSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const created = await ProgramModel.create(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create program" });
  }
});

// READ ALL
router.get("/programs", async (_req, res) => {
  try {
    const programs = await ProgramModel.find().sort({ order: 1, createdAt: -1 });
    // Frontend (public + admin) expects { programs: [...] }
    res.json({ programs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

// READ ONE
router.get("/programs/:id", async (req, res) => {
  try {
    const program = await ProgramModel.findById(req.params.id);
    if (!program) return res.status(404).json({ error: "Not found" });
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch program" });
  }
});

// UPDATE
router.put("/programs/:id", async (req, res) => {
  const parsed = programSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const updated = await ProgramModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update program" });
  }
});

// DELETE
router.delete("/programs/:id", async (req, res) => {
  try {
    const deleted = await ProgramModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete program" });
  }
});

export default router;
