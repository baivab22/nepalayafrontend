import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Eye, X, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GalleryImage {
  _id: string;
  url: string;
  title?: string;
  category?: string;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export function AdminGalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadCategory, setUploadCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchGalleryImages();
    fetchCategories();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const url = selectedCategory === "All"
        ? `${API_URL}/api/gallery`
        : `${API_URL}/api/gallery?category=${encodeURIComponent(selectedCategory)}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setImages(Array.isArray(data) ? data : data.images || []);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, [selectedCategory]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
        formData.append("category", uploadCategory || "Uncategorized");

        const response = await fetch(`${API_URL}/api/gallery`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const newImage = await response.json();
          setImages((prev) => [newImage, ...prev]);
          if (uploadCategory && !categories.includes(uploadCategory)) {
            setCategories((prev) => [...prev, uploadCategory].sort());
          }
        }
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img._id !== id));
        if (previewImage?._id === id) {
          setPreviewImage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleCategoryChange = async (image: GalleryImage, newCategory: string) => {
    try {
      const response = await fetch(`${API_URL}/api/gallery/${image._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory }),
      });
      if (response.ok) {
        setImages((prev) =>
          prev.map((img) =>
            img._id === image._id ? { ...img, category: newCategory } : img
          )
        );
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const allCategories = ["All", ...categories];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Gallery Manager</h2>
        <p className="text-slate-600">
          Upload images with categories and manage your gallery
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 hover:border-blue-500 hover:bg-blue-50 transition-all">
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
            Category for uploads
          </label>
          <Input
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            placeholder='e.g., "Campus", "Events", "Sports" — leave empty for "Uncategorized"'
            className="max-w-md"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center space-y-3 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {uploading ? "Uploading..." : "Drop images here or click to select"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP (Max 50MB each)
            </p>
          </div>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat === "All" ? "All" : cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({categories.filter((c) => c === cat).length + (cat === selectedCategory ? images.filter(i => i.category === cat).length : 0)})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div>
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {selectedCategory === "All"
              ? "No images in gallery yet. Upload your first image above."
              : `No images in "${selectedCategory}" category.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((image) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setPreviewImage(image)}
                      className="bg-white text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {image.title || "Gallery Image"}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        <FolderOpen className="w-3 h-3" />
                        {image.category || "Uncategorized"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(image.createdAt || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-lg overflow-hidden max-w-2xl w-full"
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-auto"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {previewImage.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <FolderOpen className="w-3 h-3" />
                    {previewImage.category || "Uncategorized"}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Uploaded: {new Date(previewImage.createdAt || "").toLocaleString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
