import { Router, type IRouter } from "express";
import { NoticeModel, noticeSchemaZ } from "../db/schema";
import multer, { type StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

const noticeUploadDir = path.resolve(process.cwd(), "uploads/notice-images");
if (!fs.existsSync(noticeUploadDir)) fs.mkdirSync(noticeUploadDir, { recursive: true });

const noticeStorage: StorageEngine = multer.diskStorage({
  destination: (
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => cb(null, noticeUploadDir),
  filename: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const noticeUpload = multer({ storage: noticeStorage });

// POST /api/notice/upload-image
router.post("/notice/upload-image", noticeUpload.single("image"), (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const url = `/api/notice/image/${file.filename}`;
  res.json({ filename: file.filename, url });
});

// GET /api/notice/image/:filename
router.get("/notice/image/:filename", (req, res) => {
  const filePath = path.join(noticeUploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.sendFile(filePath);
});

// CREATE
router.post("/notice", async (req, res) => {
  const parsed = noticeSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const created = await NoticeModel.create(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notice" });
  }
});

// READ ALL
router.get("/notice", async (_req, res) => {
  try {
    const notices = await NoticeModel.find().sort({ order: 1, createdAt: -1 });
    res.json({ notices });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

// READ ONE
router.get("/notice/:id", async (req, res) => {
  try {
    const notice = await NoticeModel.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: "Not found" });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notice" });
  }
});

// UPDATE
router.put("/notice/:id", async (req, res) => {
  const parsed = noticeSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const updated = await NoticeModel.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notice" });
  }
});

// DELETE
router.delete("/notice/:id", async (req, res) => {
  try {
    const deleted = await NoticeModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

export default router;
