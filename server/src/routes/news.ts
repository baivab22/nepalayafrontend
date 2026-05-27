import { Router, type IRouter } from "express";
import { NewsModel, newsSchemaZ } from "../db/schema";
import multer, { type StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

// --- News Image Upload Setup ---
const newsUploadDir = path.resolve(
  process.cwd(),
  "uploads/news-images",
);
if (!fs.existsSync(newsUploadDir)) fs.mkdirSync(newsUploadDir, { recursive: true });

const newsStorage: StorageEngine = multer.diskStorage({
  destination: (
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => cb(null, newsUploadDir),
  filename: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const newsUpload = multer({ storage: newsStorage });

// POST /api/news/upload-image
router.post("/news/upload-image", newsUpload.single("image"), (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const url = `/api/news/image/${file.filename}`;
  res.json({ filename: file.filename, url });
});

// GET /api/news/image/:filename
router.get("/news/image/:filename", (req, res) => {
  const filePath = path.join(newsUploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.sendFile(filePath);
});

// CREATE
router.post("/news", async (req, res) => {
  const parsed = newsSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const created = await NewsModel.create(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create news" });
  }
});

// READ ALL
router.get("/news", async (_req, res) => {
  try {
    const news = await NewsModel.find().sort({ order: 1, createdAt: -1 });
    // Frontend (public + admin) expects { news: [...] }
    res.json({ news });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// READ ONE
router.get("/news/:id", async (req, res) => {
  try {
    const news = await NewsModel.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "Not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// UPDATE
router.put("/news/:id", async (req, res) => {
  const parsed = newsSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const updated = await NewsModel.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update news" });
  }
});

// DELETE
router.delete("/news/:id", async (req, res) => {
  try {
    const deleted = await NewsModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete news" });
  }
});

export default router;
