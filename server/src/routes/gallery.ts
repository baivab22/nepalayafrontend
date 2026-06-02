import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Configure multer for image uploads
const uploadsDir = path.resolve(__dirname, "../../artifacts/api-server/uploads/gallery");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Ensure directory exists
    if (!existsSync(uploadsDir)) {
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (err) {
        console.error("Error creating uploads directory:", err);
      }
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// In-memory gallery storage (for demo)
// In production, use a database
let galleryImages: any[] = [];

// GET all gallery images
router.get("/", (req, res) => {
  try {
    res.json(galleryImages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
});

// POST - Add image to gallery
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/api/gallery/images/${req.file.filename}`;
    const imageData = {
      _id: Date.now().toString(),
      url: imageUrl,
      filename: req.file.filename,
      title: req.body.title || "Gallery Image",
      createdAt: new Date(),
    };

    galleryImages.push(imageData);
    res.status(201).json(imageData);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// DELETE - Remove image from gallery
router.delete("/:id", (req, res) => {
  try {
    const index = galleryImages.findIndex((img) => img._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Image not found" });
    }

    galleryImages.splice(index, 1);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// Serve uploaded images
router.get("/images/:filename", (req, res) => {
  try {
    const filepath = path.join(uploadsDir, req.params.filename);
    res.sendFile(filepath);
  } catch (error) {
    res.status(404).json({ error: "Image not found" });
  }
});

export default router;
