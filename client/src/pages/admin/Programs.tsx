import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  X,
  Save,
  GraduationCap,
  Clock,
  Users,
  AlignLeft,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const API_URL = "https://nepalaya-apis.onrender.com";

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

interface Program {
  _id: string;
  title: string;
  description: string;
  duration?: string;
  seats?: number;
  level?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProgramForm {
  title: string;
  description: string;
  duration: string;
  seats: string;
  level: string;
  image?: string;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold", "italic", "underline", "strike",
  "list", "bullet",
  "blockquote", "code-block",
  "color", "background",
  "link",
];

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProgramForm>({ title: "", description: "", duration: "", seats: "", level: "" });
  const [editing, setEditing] = useState<Program | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const quillRef = useRef<ReactQuill>(null);

  const pageSize = 10;

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/programs`);
      const data = await response.json();
      const raw = Array.isArray(data) ? data : (data?.programs || []);
      const normalized: Program[] = raw.map((p: any) => ({
        _id: p._id,
        title: p.title,
        description: p.description || "",
        duration: p.duration || "",
        seats: p.seats,
        level: p.level || "",
        image: p.image,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      setPrograms(normalized);
      toast.success("Programs loaded successfully");
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPrograms(); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.description || stripHtml(form.description).trim().length < 2) {
      toast.error("Description must have at least 2 characters");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = form.image || "";

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);

        const uploadRes = await fetch(`${API_URL}/api/programs/upload-image`, {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API_URL}/api/programs/${editing._id}` : `${API_URL}/api/programs`;

      const body: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        level: form.level,
      };
      if (form.duration) body.duration = form.duration;
      if (form.seats) body.seats = Number(form.seats);
      if (imageUrl) body.image = imageUrl;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Save failed");

      toast.success(editing ? "Program updated successfully" : "Program added successfully");
      resetForm();
      setModalOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Failed to save program");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (prog: Program) => {
    setEditing(prog);
    setForm({
      title: prog.title,
      description: prog.description || "",
      duration: prog.duration || "",
      seats: prog.seats ? String(prog.seats) : "",
      level: prog.level || "",
      image: prog.image || "",
    });
    if (prog.image) {
      setImagePreview(`${API_URL}${prog.image}`);
    }
    setImageFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this program? All associated data will be removed.")) return;

    try {
      const response = await fetch(`${API_URL}/api/programs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");

      toast.success("Program deleted successfully");
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Failed to delete program");
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", duration: "", seats: "", level: "", image: "" });
    setEditing(null);
    setImageFile(null);
    setImagePreview("");
  };

  const filtered = programs.filter(prog =>
    prog.title.toLowerCase().includes(search.toLowerCase()) ||
    stripHtml(prog.description).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDescriptionExcerpt = (html: string, max = 120) => {
    const text = stripHtml(html);
    return truncate(text, max);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Programs Management</h1>
              <p className="text-slate-500 mt-1">Manage academic programs, duration, seats, and descriptions</p>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }} 
              className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" /> 
              Add Program
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              className="pl-10 bg-white border-slate-200" 
              placeholder="Search programs by title or description..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-slate-200/60">
                <Skeleton className="h-52 w-full rounded-none" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : paginated.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <GraduationCap className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No programs found</h3>
              <p className="text-sm text-slate-400 mb-6">Get started by creating your first academic program</p>
              <Button onClick={() => {
                resetForm();
                setModalOpen(true);
              }} className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add your first program
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {paginated.map((prog, idx) => (
                <motion.div
                  key={prog._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="group relative overflow-hidden border-slate-200/60 bg-white shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                    {/* Image */}
                    <div className={`relative w-full h-52 overflow-hidden ${!prog.image ? "bg-gradient-to-br from-slate-100 to-slate-200" : "bg-slate-100"}`}>
                      {prog.image ? (
                        <img 
                          src={`${API_URL}${prog.image}`} 
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap className="w-16 h-16 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {prog.level && (
                          <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm border-0 font-medium capitalize">
                            {prog.level}
                          </Badge>
                        )}
                        {prog.seats && (
                          <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm border-0 font-medium">
                            <Users className="w-3 h-3 mr-1" />
                            {prog.seats} seats
                          </Badge>
                        )}
                      </div>
                      {/* Hover actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <Button 
                          size="icon"
                          variant="secondary" 
                          onClick={() => setViewingProgram(prog)}
                          className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                        >
                          <Eye className="w-4 h-4 text-slate-700" />
                        </Button>
                        <Button 
                          size="icon"
                          variant="secondary" 
                          onClick={() => handleEdit(prog)}
                          className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                        >
                          <Pencil className="w-4 h-4 text-slate-700" />
                        </Button>
                        <Button 
                          size="icon"
                          variant="secondary" 
                          onClick={() => handleDelete(prog._id)}
                          className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug line-clamp-2">
                        {prog.title}
                      </h3>

                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-3 flex-1">
                        {getDescriptionExcerpt(prog.description, 150)}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 pt-3 mt-auto border-t border-slate-100">
                        {prog.level && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 capitalize text-xs">
                            {prog.level}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {prog.duration || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Users className="w-3.5 h-3.5" />
                          {prog.seats ? `${prog.seats} seats` : "N/A"}
                        </div>
                        {prog.createdAt && (
                          <span className="ml-auto text-xs text-slate-400">
                            {new Date(prog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200"
          >
            <div className="text-sm text-slate-500">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} programs
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1} 
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = page;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  if (pageNum > totalPages || pageNum < 1) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === totalPages} 
                onClick={() => handlePageChange(page + 1)}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <h2 className="text-2xl font-bold">
              {editing ? "Edit Program" : "Add New Program"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editing ? "Update program details" : "Create a new academic program"}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-semibold mb-2 block">
                Program Title <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  placeholder="e.g., Bachelor of Computer Science"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Duration & Seats row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-sm font-semibold mb-2 block">
                  Duration
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g., 4 Years"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="seats" className="text-sm font-semibold mb-2 block">
                  Seats Available
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="seats"
                    type="number"
                    min={0}
                    value={form.seats}
                    onChange={e => setForm(f => ({ ...f, seats: e.target.value }))}
                    placeholder="e.g., 60"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Level */}
            <div>
              <Label htmlFor="level" className="text-sm font-semibold mb-2 block">
                Level <span className="text-red-500">*</span>
              </Label>
              <select
                id="level"
                value={form.level}
                onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                required
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="" disabled>Select level...</option>
                <option value="+2">+2</option>
                <option value="bachelor">Bachelor</option>
                <option value="masters">Masters</option>
              </select>
            </div>

            {/* Rich Text Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-semibold mb-2 block">
                Description <span className="text-red-500">*</span>
              </Label>
              <div className="border border-slate-200 rounded-lg overflow-hidden [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-x-0 [&_.ql-container]:border-0">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={form.description}
                  onChange={(value) => setForm(f => ({ ...f, description: value }))}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Describe the program, curriculum, learning outcomes..."
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <AlignLeft className="w-3 h-3" />
                Use the editor to format your description with headings, lists, and styling.
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image" className="text-sm font-semibold mb-2 block">
                Program Image
              </Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                        setForm(f => ({ ...f, image: "" }));
                      }
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      setForm(f => ({ ...f, image: "" }));
                    }}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 w-48 h-32">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                Upload an image to represent this program. Recommended size: 1200x600px.
              </p>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploading}
                className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : editing ? "Update Program" : "Create Program"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Description Modal */}
      <Dialog open={!!viewingProgram} onOpenChange={open => { if (!open) setViewingProgram(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-sky-500/10 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{viewingProgram?.title}</h2>
                <p className="text-sm text-slate-500">Program Overview</p>
              </div>
            </div>
          </DialogHeader>

          {viewingProgram && (
            <div className="space-y-4">
              {viewingProgram.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={`${API_URL}${viewingProgram.image}`}
                    alt={viewingProgram.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-3">
                {viewingProgram.level && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 capitalize gap-1">
                    {viewingProgram.level}
                  </Badge>
                )}
                {viewingProgram.duration && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1">
                    <Clock className="w-3 h-3" />
                    {viewingProgram.duration}
                  </Badge>
                )}
                {viewingProgram.seats && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1">
                    <Users className="w-3 h-3" />
                    {viewingProgram.seats} seats
                  </Badge>
                )}
              </div>

              <div className="prose prose-sm max-w-none text-slate-700">
                <div dangerouslySetInnerHTML={{ __html: viewingProgram.description }} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingProgram(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
