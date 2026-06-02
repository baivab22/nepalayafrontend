import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Fullscreen } from "lucide-react";

interface GalleryImage {
  _id: string;
  url: string;
  title?: string;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`);
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

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 mt-4">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h4 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3"
          >
            Photo Gallery
          </motion.h4>
          <h2 className="text-5xl md:text-6xl font-display font-black text-slate-900 mb-4">
            Moments from Campus
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore the vibrant campus life, academic activities, and memorable moments from Nepalaya School
          </p>
        </motion.div>

        {/* Featured Hero Image with Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-16 group"
        >
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-video w-full overflow-hidden cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              >
                <img
                  src={currentImage.url}
                  alt={currentImage.title || `Gallery image ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFullscreen(true)}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 border border-white/30"
                  >
                    <Fullscreen className="w-8 h-8" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.button
              onClick={prevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Image Counter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
          </div>
        </motion.div>

        {/* Thumbnail Strip */}
        <div className="mb-16 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 min-w-min px-1 py-4">
            {images.map((image, idx) => (
              <motion.button
                key={image._id}
                onClick={() => setCurrentIndex(idx)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                  idx === currentIndex
                    ? "border-blue-500 shadow-lg ring-2 ring-blue-300"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === currentIndex && (
                  <motion.div 
                    layoutId="highlight"
                    className="absolute inset-0 bg-blue-500/20"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid Gallery */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {images.slice(0, 12).map((image, idx) => (
            <motion.div
              key={image._id}
              variants={item}
              onClick={() => {
                setCurrentIndex(images.indexOf(image));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              whileHover={{ y: -10 }}
              className="group relative cursor-pointer h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={image.url}
                alt={image.title || `Gallery ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />

              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                whileHover={{ opacity: 1, backdropFilter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(images.indexOf(image));
                      setIsFullscreen(true);
                    }}
                    className="bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all"
                  >
                    <Fullscreen className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Corner Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold"
              >
                #{idx + 1}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {images.length > 12 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
              View All {images.length} Photos
            </button>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={currentImage.url}
                  alt={currentImage.title}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain"
                />
              </AnimatePresence>

              {/* Fullscreen Navigation */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-colors backdrop-blur-md"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-colors backdrop-blur-md"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>

              {/* Image Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 text-white"
              >
                <p className="text-lg font-bold">
                  {currentIndex + 1} / {images.length}
                </p>
                {currentImage.title && (
                  <p className="text-sm text-white/80 mt-1">{currentImage.title}</p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
