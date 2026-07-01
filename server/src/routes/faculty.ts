
import { Router, type IRouter } from "express";
import { FacultyModel, facultySchemaZ } from "../db/schema";
import multer, { type StorageEngine } from "multer";
import path from "path";
import fs from "fs";


const router: IRouter = Router();

// --- Faculty Photo Upload Setup ---
const uploadBase = () => process.env.UPLOAD_DIR || process.cwd();
const uploadDir = path.resolve(uploadBase(), "uploads/faculty-photo");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => cb(null, uploadDir),
  filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// POST /api/faculty/upload-photo
router.post("/faculty/upload-photo", upload.single("photo"), (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/api/faculty/photo/${file.filename}`;
  res.json({ filename: file.filename, url });
});

// GET /api/faculty/photo/:filename
router.get("/faculty/photo/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.sendFile(filePath);
});

// CREATE
router.post("/faculty", async (req, res) => {
  const parsed = facultySchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const created = await FacultyModel.create(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create faculty" });
  }
});

// READ ALL
router.get("/faculty", async (_req, res) => {
  try {
    const faculty = await FacultyModel.find().sort({ order: 1, createdAt: -1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
});

// READ ONE
router.get("/faculty/:id", async (req, res) => {
  try {
    const faculty = await FacultyModel.findById(req.params.id);
    if (!faculty) return res.status(404).json({ error: "Not found" });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
});

// UPDATE
router.put("/faculty/:id", async (req, res) => {
  const parsed = facultySchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const updated = await FacultyModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update faculty" });
  }
});

// DELETE
router.delete("/faculty/:id", async (req, res) => {
  try {
    const deleted = await FacultyModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete faculty" });
  }
});

export default router;
