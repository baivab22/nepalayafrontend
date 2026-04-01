import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.resolve(process.cwd(), "artifacts/api-server/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// POST /api/model-image (admin uploads model image)
router.post("/model-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Save filename for retrieval (simple: write to a file)
  fs.writeFileSync(path.join(uploadDir, "latest.txt"), req.file.filename, "utf8");
  res.json({ filename: req.file.filename, url: `/api/model-image/${req.file.filename}` });
});

// GET /api/model-image (get latest model image)
router.get("/model-image", (_req, res) => {
  const latestPath = path.join(uploadDir, "latest.txt");
  if (!fs.existsSync(latestPath)) return res.status(404).json({ error: "No model image set" });
  const filename = fs.readFileSync(latestPath, "utf8");
  res.json({ filename, url: `/api/model-image/${filename}` });
});

// Serve uploaded images
router.get("/model-image/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.sendFile(filePath);
});

export default router;
