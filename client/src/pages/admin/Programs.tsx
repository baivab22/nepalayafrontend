import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  List,
  X,
  Save,
  Layers,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface Program {
  _id: string;
  title: string;
  items: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProgramForm {
  title: string;
  items: string;
}

const formatItemsInput = (items: string[]) => {
  return items.join(", ");
};

const parseItemsInput = (itemsString: string): string[] => {
  return itemsString
    .split(",")
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProgramForm>({ title: "", items: "" });
  const [editing, setEditing] = useState<Program | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewingItems, setViewingItems] = useState<Program | null>(null);
  
  const pageSize = 10;

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/programs`);
      const data = await response.json();
      const raw = Array.isArray(data) ? data : (data?.programs || []);
      const normalized: Program[] = raw.map((p: any) => ({
        ...p,
        items: Array.isArray(p.items)
          ? p.items
          : p.description
            ? parseItemsInput(p.description)
            : [],
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
    
    const itemsArray = parseItemsInput(form.items);
    
    if (itemsArray.length === 0) {
      toast.error("Please add at least one item");
      return;
    }
    
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API_URL}/api/programs/${editing._id}` : `${API_URL}/api/programs`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: form.title, 
          // Store items as a single description string in the backend
          description: form.items 
        })
      });
      
      if (!response.ok) throw new Error("Save failed");
      
      toast.success(editing ? "Program updated successfully" : "Program added successfully");
      resetForm();
      setModalOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Failed to save program");
    }
  };

  const handleEdit = (prog: Program) => {
    setEditing(prog);
    setForm({ 
      title: prog.title, 
      items: formatItemsInput(prog.items || [])
    });
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
    setForm({ title: "", items: "" });
    setEditing(null);
  };

  // Filtering and pagination
  const filtered = programs.filter(prog =>
    prog.title.toLowerCase().includes(search.toLowerCase()) ||
    (prog.items || []).some(item => item.toLowerCase().includes(search.toLowerCase()))
  );
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getItemCount = (items: string[]) => {
    return items.length;
  };

  const getPreviewItems = (items: string[], maxItems: number = 3) => {
    return items.slice(0, maxItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Programs Management</h1>
              <p className="text-slate-500 mt-1">Manage academic programs, courses, and their curriculum details</p>
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

        {/* Search Section */}
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
              placeholder="Search programs by title or curriculum items..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : paginated.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-slate-400 mb-2">No programs found</div>
              <Button variant="outline" onClick={() => {
                resetForm();
                setModalOpen(true);
              }}>
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
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200 h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Icon and Title */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-primary/10 to-sky-500/10 rounded-xl">
                          <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {getItemCount(prog.items)} Items
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {prog.title}
                      </h3>
                      
                      {/* Items Preview */}
                      <div className="flex-grow mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <List className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">Curriculum Highlights:</span>
                        </div>
                        <ul className="space-y-1.5">
                          {getPreviewItems(prog.items, 3).map((item, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                        {prog.items.length > 3 && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="mt-2 p-0 h-auto text-primary"
                            onClick={() => setViewingItems(prog)}
                          >
                            + {prog.items.length - 3} more items
                          </Button>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-slate-100">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setViewingItems(prog)}
                          className="flex-1"
                        >
                          <BookOpen className="w-4 h-4 mr-1" /> View All
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(prog)}
                          className="flex-1"
                        >
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(prog._id)}
                          className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
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

      {/* Add/Edit Program Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <h2 className="text-2xl font-bold">
              {editing ? "Edit Program" : "Add New Program"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editing ? "Update program details and curriculum" : "Create a new academic program with its curriculum"}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
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
            
            <div>
              <Label htmlFor="items" className="text-sm font-semibold mb-2 block">
                Curriculum Items <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <List className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Textarea
                  id="items"
                  value={form.items}
                  onChange={e => setForm(f => ({ ...f, items: e.target.value }))}
                  required
                  placeholder="Enter curriculum items separated by commas&#10;e.g., Data Structures, Algorithms, Database Systems, Web Development"
                  rows={6}
                  className="pl-10 resize-none font-mono text-sm"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                Separate items with commas. Each item will be displayed as a bullet point.
              </p>
            </div>
            
            {/* Preview Section */}
            {form.items && parseItemsInput(form.items).length > 0 && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Preview ({parseItemsInput(form.items).length} items)
                </p>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {parseItemsInput(form.items).slice(0, 10).map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    {parseItemsInput(form.items).length > 10 && (
                      <li className="text-sm text-slate-400 italic">
                        + {parseItemsInput(form.items).length - 10} more items
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            
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
                className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {editing ? "Update Program" : "Create Program"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View All Items Modal */}
      <Dialog open={!!viewingItems} onOpenChange={open => { if (!open) setViewingItems(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-sky-500/10 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{viewingItems?.title}</h2>
                <p className="text-sm text-slate-500">Complete Curriculum Overview</p>
              </div>
            </div>
          </DialogHeader>
          
          {viewingItems && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-slate-700">Total Items:</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {viewingItems.items.length}
                  </Badge>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  {viewingItems.items.map((item, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-primary font-semibold min-w-[24px]">{idx + 1}.</span>
                      <span className="text-slate-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingItems(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}