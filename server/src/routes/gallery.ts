import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { GalleryModel } from "../db/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const uploadsDir = path.resolve(__dirname, "../../artifacts/api-server/uploads/gallery");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
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
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// GET all gallery images, optionally filtered by category
router.get("/", async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const images = await GalleryModel.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
});

// GET all distinct categories
router.get("/categories", async (_req, res) => {
  try {
    const categories = await GalleryModel.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST - Add image to gallery
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/api/gallery/images/${req.file.filename}`;

    const image = await GalleryModel.create({
      url: imageUrl,
      filename: req.file.filename,
      title: req.body.title || "Gallery Image",
      category: req.body.category || "Uncategorized",
    });

    res.status(201).json(image);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// PUT - Update image (e.g. change category)
router.put("/:id", async (req, res) => {
  try {
    const updated = await GalleryModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Image not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update image" });
  }
});

// DELETE - Remove image from gallery
router.delete("/:id", async (req, res) => {
  try {
    const result = await GalleryModel.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Image not found" });
    }

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
