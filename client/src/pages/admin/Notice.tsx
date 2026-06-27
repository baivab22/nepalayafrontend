import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar as CalendarIcon,
  AlertCircle,
  Megaphone,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
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

interface NoticeItem {
  _id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface NoticeForm {
  title: string;
  date: Date | undefined;
  category: string;
  description: string;
  image: string;
  order: number;
}

const categories = [
  "General Notice",
  "Exam Notice",
  "Admission Notice",
  "Holiday Notice",
  "Event Notice",
  "Result Notice",
  "Scholarship Notice",
  "Meeting Notice",
  "Tender Notice",
  "Important Announcement",
];

export default function NoticeAdmin() {
  const { toast } = useToast();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState<NoticeItem | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 10;

  const [form, setForm] = useState<NoticeForm>({
    title: "",
    date: new Date(),
    category: "",
    description: "",
    image: "",
    order: 0,
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notice`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data?.notices || []);
      setNotices(items);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpen = (item?: NoticeItem) => {
    if (item) {
      setEditId(item._id);
      setForm({
        title: item.title,
        date: item.date ? new Date(item.date) : new Date(),
        category: item.category,
        description: item.description,
        image: item.image || "",
        order: item.order || 0,
      });
    } else {
      setEditId(null);
      setForm({
        title: "",
        date: new Date(),
        category: "",
        description: "",
        image: "",
        order: notices.length,
      });
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "order" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const getImageUrl = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/api/")) return `${API_URL}${image}`;
    return `${API_URL}/api/notice/image/${image}`;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("image", file);
    const response = await fetch(`${API_URL}/api/notice/upload-image`, {
      method: "POST",
      body: data,
    });
    if (response.ok) {
      const result = await response.json();
      return result.url;
    }
    throw new Error("Upload failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.description || stripHtml(form.description).trim().length < 2) newErrors.description = "Description is required";
    if (!form.date) newErrors.date = "Please select a date";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = form.image;

    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploading(false);
        toast({ title: "Upload Failed", description: "Could not upload the image. Please try again.", variant: "destructive" });
        return;
      }
      setUploading(false);
    }

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${API_URL}/api/notice/${editId}`
      : `${API_URL}/api/notice`;

    const payload = {
      title: form.title.trim(),
      date: format(form.date || new Date(), "yyyy-MM-dd"),
      category: form.category,
      description: form.description,
      image: imageUrl,
      order: form.order,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg =
          errData?.details?.[0]?.message ||
          errData?.error ||
          "Failed to save notice";
        toast({ title: "Error", description: msg, variant: "destructive" });
        return;
      }

      fetchNotices();
      handleClose();
      toast({
        title: editId ? "Updated" : "Created",
        description: `Notice ${editId ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving notice:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/api/notice/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to delete");
      }
      fetchNotices();
      toast({ title: "Deleted", description: "Notice removed successfully." });
      setDeleteConfirm(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const filtered = notices.filter((item) =>
    [item.title, item.category, stripHtml(item.description)]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Notice Management</h1>
              <p className="text-slate-500 mt-1">
                Create, edit, and manage notices and announcements
              </p>
            </div>
            <Button
              onClick={() => handleOpen()}
              className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Notice
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Input
            className="max-w-md bg-white border-slate-200 focus:ring-2 focus:ring-primary/20"
            placeholder="Search by title, category, or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Megaphone className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-slate-400 mb-2">No notices found</div>
              <Button variant="outline" onClick={() => handleOpen()}>
                Create your first notice
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {paginated.map((item) => (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {item.image ? (
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <Megaphone className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900 line-clamp-2">{item.title}</div>
                            <div className="text-xs text-slate-400 line-clamp-1 mt-1">
                              {stripHtml(item.description).substring(0, 80)}
                              {stripHtml(item.description).length > 80 ? "..." : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                            {formatDisplayDate(item.date)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {item.order}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-slate-100"
                                onClick={() => setViewing(item)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-slate-100"
                                onClick={() => handleOpen(item)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {deleteConfirm === item._id ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 text-xs px-2"
                                    onClick={() => handleDelete(item._id)}
                                    disabled={deleting === item._id}
                                  >
                                    {deleting === item._id ? "..." : "Confirm"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-xs px-2"
                                    onClick={() => setDeleteConfirm(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => setDeleteConfirm(item._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100">
                  <div className="text-sm text-slate-500">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, sorted.length)} of {sorted.length} items
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editId ? "Edit Notice" : "Create New Notice"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Title *</Label>
              <Input
                name="title"
                value={form.title}
                onChange={(e) => { handleChange(e); if (errors.title) setErrors((prev) => ({ ...prev, title: "" })); }}
                placeholder="Enter notice title..."
                required
                className={`w-full ${errors.title ? "border-red-400 focus-visible:ring-red-400" : ""}`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => { setForm({ ...form, category: value }); if (errors.category) setErrors((prev) => ({ ...prev, category: "" })); }}
                  required
                >
                  <SelectTrigger className={errors.category ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.category}</p>}
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.date && "text-muted-foreground", errors.date && "border-red-400")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.date ? format(form.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(date) => { setForm({ ...form, date }); if (errors.date) setErrors((prev) => ({ ...prev, date: "" })); }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.date}</p>}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Display Order</Label>
              <Input name="order" type="number" value={form.order} onChange={handleChange} placeholder="Order (lower numbers appear first)" className="w-full" />
              <p className="text-xs text-slate-400 mt-1">Items with lower order numbers will appear first</p>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Description *</Label>
              <div className={`border border-slate-200 rounded-lg overflow-hidden [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-x-0 [&_.ql-container]:border-0 ${errors.description ? "border-red-400" : ""}`}>
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(value) => { setForm((prev) => ({ ...prev, description: value })); if (errors.description) setErrors((prev) => ({ ...prev, description: "" })); }}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write the notice content here..."
                />
              </div>
              {errors.description && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>}
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Image</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                />
                {form.image && !imageFile && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, image: "" })} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {form.image && !imageFile && (
                <div className="mt-3">
                  <img src={getImageUrl(form.image)} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-slate-200" />
                  <p className="text-xs text-slate-400 mt-1">Current image</p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={uploading}>Cancel</Button>
              <Button type="submit" disabled={uploading} className="bg-primary hover:bg-primary/90">
                {uploading ? "Uploading..." : (editId ? "Update Notice" : "Create Notice")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Notice Details</DialogTitle>
          </DialogHeader>

          {viewing && (
            <div className="space-y-4">
              {viewing.image && (
                <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-100">
                  <img src={getImageUrl(viewing.image)} alt={viewing.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                  {viewing.category}
                </span>
                <span className="text-sm text-slate-500 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDisplayDate(viewing.date)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{viewing.title}</h3>
              <div className="border-t pt-4">
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: viewing.description }} />
              </div>
              {viewing.order !== undefined && (
                <div className="text-sm text-slate-400 border-t pt-4">Display Order: {viewing.order}</div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
