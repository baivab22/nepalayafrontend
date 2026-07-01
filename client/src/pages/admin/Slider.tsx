import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Image, Film, X, Save, GripVertical, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const API_URL = "https://nepalaya-apis.onrender.com";

interface Slide {
  _id: string;
  media: string;
  type: "image" | "video";
  order: number;
  active: boolean;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  createdAt?: string;
}

function SortableSlide({ slide, idx, onEdit, onDelete, onToggleActive, slidesCount }: {
  slide: Slide;
  idx: number;
  onEdit: (s: Slide) => void;
  onDelete: (id: string) => void;
  onToggleActive: (s: Slide) => void;
  slidesCount: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto" as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="group overflow-hidden border-slate-200/60 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-video bg-slate-900">
          {slide.type === "video" ? (
            <video
              src={`${API_URL}${slide.media}`}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={e => (e.target as HTMLVideoElement).play()}
              onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
            />
          ) : (
            <img
              src={`${API_URL}${slide.media}`}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className={slide.active ? "bg-green-500/90 text-white" : "bg-slate-400/90 text-white"}>
              {slide.active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              {slide.active ? "Active" : "Hidden"}
            </Badge>
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs">
              {slide.type === "video" ? <Film className="w-3 h-3 mr-1" /> : <Image className="w-3 h-3 mr-1" />}
              {slide.type}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">#{idx + 1}</Badge>
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg" onClick={() => onEdit(slide)}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </Button>
            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:text-red-500" onClick={() => onDelete(slide._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              {...attributes}
              {...listeners}
              className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing touch-none"
            >
              <GripVertical className="w-4 h-4" />
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onToggleActive(slide)} className="text-slate-500 h-7">
            {slide.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/slider`);
      const data = await res.json();
      setSlides(data?.slides || []);
    } catch {
      toast.error("Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex(s => s._id === active.id);
    const newIndex = slides.findIndex(s => s._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setSlides(reordered);

    try {
      const payload = reordered.map((item, idx) => ({ _id: item._id, order: idx }));
      const res = await fetch(`${API_URL}/api/slider/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: payload }),
      });
      if (!res.ok) throw new Error("Reorder failed");
    } catch {
      toast.error("Failed to save order");
      fetchSlides();
    }
  };

  const handleFileSelect = (file: File) => {
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setMediaType(file.type.startsWith("video/") ? "video" : "image");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile && !editing) { toast.error("Please select a file"); return; }
    setUploading(true);
    try {
      let mediaUrl = editing?.media || "";
      let type = mediaType;
      if (mediaFile) {
        const fd = new FormData();
        fd.append("media", mediaFile);
        const uploadRes = await fetch(`${API_URL}/api/slider/upload`, { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const data = await uploadRes.json();
        mediaUrl = data.url;
        type = data.type;
      }
      if (!mediaUrl) { toast.error("Upload failed"); setUploading(false); return; }

      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API_URL}/api/slider/${editing._id}` : `${API_URL}/api/slider`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media: mediaUrl, type, order: editing?.order ?? slides.length, active: editing?.active ?? true, title, subtitle, description, ctaText, ctaLink }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(editing ? "Slide updated" : "Slide created");
      resetForm();
      setModalOpen(false);
      fetchSlides();
    } catch {
      toast.error("Failed to save slide");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (slide: Slide) => {
    setEditing(slide);
    setMediaPreview(`${API_URL}${slide.media}`);
    setMediaType(slide.type);
    setMediaFile(null);
    setTitle(slide.title ?? "");
    setSubtitle(slide.subtitle ?? "");
    setDescription(slide.description ?? "");
    setCtaText(slide.ctaText ?? "");
    setCtaLink(slide.ctaLink ?? "");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      const res = await fetch(`${API_URL}/api/slider/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Slide deleted");
      fetchSlides();
    } catch {
      toast.error("Failed to delete slide");
    }
  };

  const toggleActive = async (slide: Slide) => {
    try {
      const res = await fetch(`${API_URL}/api/slider/${slide._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...slide, active: !slide.active }),
      });
      if (!res.ok) throw new Error();
      fetchSlides();
    } catch {
      toast.error("Failed to toggle");
    }
  };

  const resetForm = () => {
    setEditing(null);
    setMediaFile(null);
    setMediaPreview("");
    setMediaType("image");
    setTitle("");
    setSubtitle("");
    setDescription("");
    setCtaText("");
    setCtaLink("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Hero Slider</h1>
              <p className="text-slate-500 mt-1">Manage homepage carousel media — drag to reorder</p>
            </div>
            <Button onClick={() => { resetForm(); setModalOpen(true); }} className="bg-primary hover:bg-primary/90 shadow-lg">
              <Plus className="w-4 h-4 mr-2" /> Add Media
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-slate-200/60">
                <div className="aspect-video bg-slate-100 animate-pulse" />
              </Card>
            ))}
          </div>
        ) : slides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <Image className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No slides yet</h3>
            <p className="text-sm text-slate-400 mb-6">Add images or videos for the homepage carousel</p>
            <Button onClick={() => { resetForm(); setModalOpen(true); }} className="bg-primary shadow-lg">
              <Plus className="w-4 h-4 mr-2" /> Add your first media
            </Button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <SortableContext items={slides.map(s => s._id)} strategy={rectSortingStrategy}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide, idx) => (
                  <SortableSlide
                    key={slide._id}
                    slide={slide}
                    idx={idx}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleActive={toggleActive}
                    slidesCount={slides.length}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <h2 className="text-2xl font-bold">{editing ? "Edit Slide" : "Add New Slide"}</h2>
            <p className="text-sm text-slate-500 mt-1">
              Upload an image or video for the homepage carousel
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Media File (Image or Video) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                <Image className="w-3 h-3" /> Images: JPG, PNG, WebP | <Film className="w-3 h-3" /> Videos: MP4, WebM (max 200MB)
              </p>
            </div>

            {mediaPreview && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative aspect-video">
                {mediaType === "video" ? (
                  <video ref={videoRef} src={mediaPreview} className="w-full h-full object-cover" controls playsInline />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                )}
                <Badge className="absolute top-2 right-2 bg-black/60 text-white border-0">
                  {mediaType === "video" ? <Film className="w-3 h-3 mr-1" /> : <Image className="w-3 h-3 mr-1" />}
                  {mediaType}
                </Badge>
              </div>
            )}

            {editing && !mediaFile && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative aspect-video">
                {editing.type === "video" ? (
                  <video src={`${API_URL}${editing.media}`} className="w-full h-full object-cover" controls playsInline />
                ) : (
                  <img src={`${API_URL}${editing.media}`} alt="" className="w-full h-full object-cover" />
                )}
              </div>
            )}

            <div>
              <Label className="text-sm font-semibold mb-1 block">Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Welcome to Nepalaya" className="h-10" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-1 block">Subtitle</Label>
              <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Empowering minds since 1984" className="h-10" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-1 block">Description</Label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description for this slide..." rows={2} className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-1 block">CTA Button Text</Label>
                <Input value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="e.g. Apply Now" className="h-10" />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-1 block">CTA Button Link</Label>
                <Input value={ctaLink} onChange={e => setCtaLink(e.target.value)} placeholder="e.g. /admissions" className="h-10" />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" disabled={uploading} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : editing ? "Update" : "Add to Slider"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
