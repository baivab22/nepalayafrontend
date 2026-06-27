import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, FolderOpen, ImageIcon } from "lucide-react";

interface GalleryImage {
  _id: string;
  url: string;
  title?: string;
  category?: string;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchAllImages();
  }, []);

  const fetchAllImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        setImages(Array.isArray(data) ? data : data.images || []);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const nextImage = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); prevImage(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nextImage(); }
      else if (e.key === "Escape") { setIsFullscreen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, nextImage, prevImage]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 mt-4">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Gallery</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-3">
            MOMENTS FROM NEPALAYA
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Explore the vibrant campus life, academic activities, and memorable moments
          </p>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All ({images.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Image Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No images in this category</p>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openFullscreen(idx)}
                  className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={image.url}
                    alt={image.title || "Gallery"}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium truncate">{image.title}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && filteredImages[currentIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            {/* Close */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={filteredImages[currentIndex].url}
                  alt={filteredImages[currentIndex].title || "Gallery"}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {/* Prev */}
              {filteredImages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next */}
              {filteredImages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all border border-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm border border-white/20 pointer-events-none">
                {currentIndex + 1} / {filteredImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
