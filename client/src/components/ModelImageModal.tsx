import { useEffect, useState, useCallback, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const resolveUrl = (url: string) =>
  /^https?:\/\//.test(url) ? url : `${API_BASE}${url}`;

interface ModelImageModalProps {
  open?: boolean;
  onClose?: () => void;
  variant?: "modal" | "inline";
  className?: string;
}

export default function ModelImageModal({
  open: controlledOpen,
  onClose,
  variant = "modal",
  className = "",
}: ModelImageModalProps) {
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [current, setCurrent] = useState(0);
  const [show, setShow] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : show;

  useEffect(() => {
    if (isControlled) return;
    const timer = setTimeout(() => {
      fetch(`${API_BASE}/api/model-image`)
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          const list: { id: string; url: string }[] = (data.images || []).map(
            (img: any) => ({
              id: img.id,
              url: resolveUrl(img.url),
            })
          );
          setImages(list);
        })
        .catch(() => setImages([]));
      setShow(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isControlled]);

  useEffect(() => {
    if (isControlled) {
      fetch(`${API_BASE}/api/model-image`)
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          const list: { id: string; url: string }[] = (data.images || []).map(
            (img: any) => ({
              id: img.id,
              url: resolveUrl(img.url),
            })
          );
          setImages(list);
        })
        .catch(() => setImages([]));
    }
  }, [isControlled]);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
    }
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  const handleGoNext = useCallback(() => {
    goNext();
    resetInterval();
  }, [goNext, resetInterval]);

  const handleGoPrev = useCallback(() => {
    goPrev();
    resetInterval();
  }, [goPrev, resetInterval]);

  const handleDotClick = useCallback((idx: number) => {
    setCurrent(idx);
    resetInterval();
  }, [resetInterval]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    setShow(false);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen || images.length <= 1) return;
      if (e.key === "ArrowRight") handleGoNext();
      if (e.key === "ArrowLeft") handleGoPrev();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, images.length, handleGoNext, handleGoPrev, handleClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[current];

  if (variant === "inline") {
    return (
      <div className={`relative w-full aspect-square max-w-lg mx-auto overflow-hidden rounded-2xl bg-slate-100 ${className}`}>
        <img
          key={currentImg.id}
          src={currentImg.url}
          alt="Model"
          className="w-full h-full object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handleGoPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/60 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center transition-all"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleGoNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/60 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center transition-all"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`rounded-full transition-all ${
                  idx === current
                    ? "w-6 h-1.5 bg-white shadow-md"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
      <div className="relative w-[min(85vw,700px)] aspect-square" onClick={(e) => e.stopPropagation()}>
        <img
          key={currentImg.id}
          src={currentImg.url}
          alt="Model"
          className="w-full h-full object-contain"
        />

        <button
          className="absolute top-2 right-2 z-20 text-white bg-black/60 hover:bg-black/80 rounded-full w-9 h-9 flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={handleGoPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/60 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleGoNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/60 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`rounded-full transition-all ${
                  idx === current
                    ? "w-8 h-2 bg-white shadow-md"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
