import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const headerPassword = req.headers["x-admin-password"] as string | undefined;
  if (!adminPassword || !headerPassword || headerPassword !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const imagesJsonPath = path.join(uploadDir, "model-images.json");

const readImages = (): any[] => {
  try {
    if (fs.existsSync(imagesJsonPath)) {
      return JSON.parse(fs.readFileSync(imagesJsonPath, "utf8"));
    }
  } catch {}
  return [];
};

const writeImages = (images: any[]) => {
  fs.writeFileSync(imagesJsonPath, JSON.stringify(images, null, 2), "utf8");
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// POST /api/model-image (admin uploads model image)
router.post("/model-image", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const images = readImages();
  const entry = {
    id: Date.now().toString(),
    filename: req.file.filename,
    url: `/api/model-image/${req.file.filename}`,
    uploadedAt: new Date().toISOString(),
  };
  images.push(entry);
  writeImages(images);
  res.json({ images });
});

// GET /api/model-image (get all model images)
router.get("/model-image", (_req, res) => {
  const images = readImages();
  if (images.length === 0) return res.json({ images: [] });
  res.json({ images });
});

// DELETE /api/model-image/:id (remove a model image by id)
router.delete("/model-image/:id", requireAdmin, (req, res) => {
  const images = readImages();
  const idx = images.findIndex((img: any) => img.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Image not found" });
  const [removed] = images.splice(idx, 1);
  const filePath = path.join(uploadDir, removed.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  writeImages(images);
  res.json({ images });
});

// Serve uploaded images
router.get("/model-image/:filename", (req, res) => {
  if (req.params.filename === "model-images.json") return res.status(404).end();
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.sendFile(filePath);
});

export default router;
