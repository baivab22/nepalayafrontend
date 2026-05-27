import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Eye, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface NewsItem {
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

interface NewsForm {
  title: string;
  date: Date | undefined;
  category: string;
  description: string;
  image: string;
  order: number;
}

const categories = [
  "Announcement",
  "Event",
  "Achievement",
  "Academic",
  "Admission",
  "Cultural",
  "Sports",
  "Alumni",
  "Workshop",
  "Seminar"
];

export default function NewsAdmin() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState<NewsItem | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 10;
  
  const [form, setForm] = useState<NewsForm>({ 
    title: "", 
    date: new Date(), 
    category: "", 
    description: "", 
    image: "", 
    order: 0 
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/news`);
      const data = await res.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchNews(); 
  }, []);

  const handleOpen = (item?: NewsItem) => {
    if (item) {
      setEditId(item._id);
      setForm({ 
        title: item.title, 
        date: item.date ? new Date(item.date) : new Date(),
        category: item.category, 
        description: item.description, 
        image: item.image || "", 
        order: item.order || 0 
      });
    } else {
      setEditId(null);
      setForm({ 
        title: "", 
        date: new Date(), 
        category: "", 
        description: "", 
        image: "", 
        order: news.length 
      });
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleClose = () => { 
    setOpen(false); 
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getImageUrl = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    if (image.startsWith("/api/")) {
      return `${API_URL}${image}`;
    }
    return `${API_URL}/api/news/image/${image}`;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("image", file);
    const response = await fetch(`${API_URL}/api/news/upload-image`, {
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
    
    let imageUrl = form.image;
    
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/news/${editId}` : `${API_URL}/api/news`;
    
    const payload = {
      title: form.title,
      date: form.date ? format(form.date, "yyyy-MM-dd") : "",
      category: form.category,
      description: form.description,
      image: imageUrl,
      order: form.order
    };
    
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchNews();
      handleClose();
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this news item? This action cannot be undone.")) return;
    try {
      await fetch(`${API_URL}/api/news/${id}`, { method: "DELETE" });
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  // Filter and pagination
  const filtered = news.filter(item =>
    [item.title, item.category, item.description]
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
  <>
  </>
  );
}