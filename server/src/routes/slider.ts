import { Router, type IRouter } from "express";
import { SliderModel, sliderSchemaZ } from "../db/schema";
import multer, { type StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

const sliderUploadDir = path.resolve(process.cwd(), "uploads/slider-images");
if (!fs.existsSync(sliderUploadDir)) fs.mkdirSync(sliderUploadDir, { recursive: true });

const sliderStorage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, sliderUploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const sliderUpload = multer({
  storage: sliderStorage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only image and video files are allowed"));
  },
});

router.post("/slider/upload", sliderUpload.single("media"), (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const isVideo = file.mimetype.startsWith("video/");
  const url = `/api/slider/media/${file.filename}`;
  res.json({ filename: file.filename, url, type: isVideo ? "video" : "image" });
});

router.get("/slider/media/:filename", (req, res) => {
  const filePath = path.join(sliderUploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.sendFile(filePath);
});

router.post("/slider", async (req, res) => {
  const parsed = sliderSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const created = await SliderModel.create(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create slide" });
  }
});

router.get("/slider", async (_req, res) => {
  try {
    const slides = await SliderModel.find().sort({ order: 1, createdAt: -1 });
    res.json({ slides });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slides" });
  }
});

router.get("/slider/active", async (_req, res) => {
  try {
    const slides = await SliderModel.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ slides });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slides" });
  }
});

router.get("/slider/:id", async (req, res) => {
  try {
    const slide = await SliderModel.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: "Not found" });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slide" });
  }
});

router.put("/slider/reorder", async (req, res) => {
  const { slides: orderedSlides } = req.body;
  if (!Array.isArray(orderedSlides)) {
    return res.status(400).json({ error: "slides must be an array" });
  }
  try {
    const ops = orderedSlides.map((item: { _id: string; order: number }, idx: number) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: idx } },
      },
    }));
    await SliderModel.bulkWrite(ops);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to reorder slides" });
  }
});

router.put("/slider/:id", async (req, res) => {
  const parsed = sliderSchemaZ.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  try {
    const updated = await SliderModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update slide" });
  }
});

router.delete("/slider/:id", async (req, res) => {
  try {
    const deleted = await SliderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete slide" });
  }
});

export default router;
