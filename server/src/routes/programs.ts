import { Router, type IRouter } from "express";
import { ProgramModel, programSchemaZ } from "../db/schema";
import multer, { type StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

// --- Program Image Upload Setup ---
const programUploadDir = path.resolve(process.cwd(), "uploads/program-images");
if (!fs.existsSync(programUploadDir)) fs.mkdirSync(programUploadDir, { recursive: true });

const programStorage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, programUploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const programUpload = multer({ storage: programStorage });

// POST /api/programs/upload-image
router.post("/programs/upload-image", programUpload.single("image"), (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/api/programs/image/${file.filename}`;
  res.json({ filename: file.filename, url });
});

// GET /api/programs/image/:filename
router.get("/programs/image/:filename", (req, res) => {
  const filePath = path.join(programUploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.sendFile(filePath);
});

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
    const programs = await ProgramModel.find().sort({ order: -1, createdAt: -1 });
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
