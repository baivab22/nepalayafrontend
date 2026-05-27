
// import { useEffect, useState, useRef } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { Eye, Pencil, Trash2 } from "lucide-react";


// const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// export default function AdminFaculty() {
//   const [faculty, setFaculty] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [form, setForm] = useState({ name: "", role: "", description: "", department: "", photo: "" });
//   const [editing, setEditing] = useState<any>(null);
//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [viewing, setViewing] = useState<any>(null);

//   const fetchFaculty = () => {
//     setLoading(true);
//     fetch(`${API_URL}/api/faculty`)
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) setFaculty(data);
//         else setFaculty(data.faculty || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   };

//   useEffect(() => { fetchFaculty(); }, []);


//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     let photoUrl = form.photo;
//     if (photoFile) {
//       setUploading(true);
//       const data = new FormData();
//       data.append("photo", photoFile);
//       const res = await fetch(`${API_URL}/api/faculty/upload-photo`, {
//         method: "POST",
//         body: data,
//       });
//       if (res.ok) {
//         const result = await res.json();
//         photoUrl = result.url;
//       }
//       setUploading(false);
//     }
//     const method = editing ? "PUT" : "POST";
//     const url = editing ? `${API_URL}/api/faculty/${editing._id}` : `${API_URL}/api/faculty`;
//     fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...form, photo: photoUrl })
//     })
//       .then(() => {
//         setForm({ name: "", role: "", description: "", department: "", photo: "" });
//         setEditing(null);
//         setPhotoFile(null);
//         setModalOpen(false);
//         fetchFaculty();
//       });
//   };


//   const handleEdit = (fac: any) => {
//     setEditing(fac);
//     setForm({
//       name: fac.name || "",
//       role: fac.role || "",
//       description: fac.description || "",
//       department: fac.department || "",
//       photo: fac.photo || ""
//     });
//     setPhotoFile(null);
//     setModalOpen(true);
//   };


//   const handleDelete = (id: string) => {
//     fetch(`${API_URL}/api/faculty/${id}`, { method: "DELETE" })
//       .then(() => fetchFaculty());
//   };


//   // Search, filter, and pagination state
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   // Filtered and paginated data
//   const filtered = faculty.filter(fac =>
//     [fac.name, fac.role, fac.department, fac.description].join(" ").toLowerCase().includes(search.toLowerCase())
//   );
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);


//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">Manage Faculty</h1>
//       <div className="mb-6 flex justify-between items-center">
//         <Dialog open={modalOpen} onOpenChange={setModalOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => { setEditing(null); setForm({ name: "", role: "", description: "", department: "", photo: "" }); setPhotoFile(null); setModalOpen(true); }}>
//               Add Faculty
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <span className="text-lg font-bold mb-2">{editing ? "Edit Faculty" : "Add Faculty"}</span>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <Label>Name</Label>
//                 <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required disabled={uploading} />
//               </div>
//               <div>
//                 <Label>Role</Label>
//                 <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required disabled={uploading} />
//               </div>
//               <div>
//                 <Label>Department</Label>
//                 <Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required disabled={uploading} />
//               </div>
//               <div>
//                 <Label>Introduction / Description</Label>
//                 <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required disabled={uploading} />
//               </div>
//               <div>
//                 <Label>Photo</Label>
//                 <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setPhotoFile(e.target.files?.[0] || null)} disabled={uploading} />
//                 {form.photo && !photoFile && (
//                   <img src={form.photo} alt="Faculty" className="mt-2 w-20 h-20 object-cover rounded-full border" />
//                 )}
//               </div>
//               <DialogFooter>
//                 <Button type="submit" disabled={uploading}>{uploading ? "Saving..." : (editing ? "Update" : "Add")}</Button>
//                 <Button type="button" variant="outline" onClick={() => { setModalOpen(false); setEditing(null); setForm({ name: "", role: "", description: "", department: "", photo: "" }); setPhotoFile(null); }} disabled={uploading}>Cancel</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//         <Input className="w-64" placeholder="Search faculty..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
//       </div>
//       <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
//         {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg mb-2" />) : (
//           paginated.length === 0 ? (
//             <div className="text-center text-slate-400 py-8">No faculty found.</div>
//           ) : (
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="text-slate-500 text-xs uppercase">
//                   <th className="py-2">Photo</th>
//                   <th className="py-2">Name</th>
//                   <th className="py-2">Role</th>
//                   <th className="py-2">Department</th>
//                   <th className="py-2">Description</th>
//                   <th className="py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map(fac => (
//                   <tr key={fac._id} className="border-t">
//                     <td className="py-2">
//                       {fac.photo ? (
//                         <img
//                           src={
//                             fac.photo.startsWith("http://") || fac.photo.startsWith("https://")
//                               ? fac.photo
//                               : `${import.meta.env.VITE_API_BASE_URL ?? ""}${fac.photo.startsWith("/api/") ? fac.photo : `/api/faculty/photo/${fac.photo}`}`
//                           }
//                           alt={fac.name}
//                           className="w-12 h-12 object-cover rounded-full border"
//                         />
//                       ) : <span className="text-slate-300">No photo</span>}
//                     </td>
//                     <td className="py-2 font-medium">{fac.name}</td>
//                     <td className="py-2">{fac.role}</td>
//                     <td className="py-2">{fac.department}</td>
//                     <td className="py-2">{fac.description}</td>
//                     <td className="py-2 space-x-2">
//                       <Button size="icon" variant="ghost" title="View Details" onClick={() => setViewing(fac)}>
//                         <Eye className="w-5 h-5" />
//                       </Button>
//                       <Button size="icon" variant="outline" title="Edit" onClick={() => handleEdit(fac)}>
//                         <Pencil className="w-4 h-4" />
//                       </Button>
//                       <Button size="icon" variant="destructive" title="Delete" onClick={() => handleDelete(fac._id)}>
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )
//         )}
//         {/* Single View Details Modal */}
//         <Dialog open={!!viewing} onOpenChange={open => { if (!open) setViewing(null); }}>
//           <DialogContent>
//             <DialogHeader>
//               <span className="text-lg font-bold">Faculty Details</span>
//             </DialogHeader>
//             {viewing && (
//               <div className="space-y-4">
//                 <div className="flex flex-col items-center">
//                   <img
//                     src={
//                       viewing.photo && (viewing.photo.startsWith("http://") || viewing.photo.startsWith("https://"))
//                         ? viewing.photo
//                         : `${import.meta.env.VITE_API_BASE_URL ?? ""}${viewing.photo && viewing.photo.startsWith("/api/") ? viewing.photo : `/api/faculty/photo/${viewing.photo}`}`
//                     }
//                     alt={viewing.name}
//                     className="w-32 h-32 object-cover rounded-full border mb-2"
//                   />
//                   <div className="font-semibold text-xl">{viewing.name}</div>
//                   <div className="text-slate-500">{viewing.role}</div>
//                 </div>
//                 <div>
//                   <span className="font-semibold">Department:</span> {viewing.department}
//                 </div>
//                 <div>
//                   <span className="font-semibold">Introduction:</span> {viewing.description}
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//         {/* Pagination Controls */}
//         <div className="flex justify-end items-center gap-2 mt-4">
//           <Button type="button" size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>&lt;</Button>
//           <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
//           <Button type="button" size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>&gt;</Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  X,
  User,
  Briefcase,
  Building2,
  FileText,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface Faculty {
  _id: string;
  name: string;
  role: string;
  description: string;
  department: string;
  photo: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FacultyForm {
  name: string;
  role: string;
  description: string;
  department: string;
  photo: string;
}

const departments = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Economics",
  "Business Administration",
  "Engineering"
];

const roles = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Senior Lecturer",
  "Lecturer",
  "Teaching Assistant",
  "Visiting Faculty",
  "Department Head",
  "Dean"
];

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FacultyForm>({ 
    name: "", 
    role: "", 
    description: "", 
    department: "", 
    photo: "" 
  });
  const [editing, setEditing] = useState<Faculty | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState<Faculty | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "role" | "department">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 10;

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/faculty`);
      const data = await response.json();
      setFaculty(Array.isArray(data) ? data : data.faculty || []);
      toast.success("Faculty loaded successfully");
    } catch (error) {
      console.error("Error fetching faculty:", error);
      toast.error("Failed to load faculty data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchFaculty(); 
  }, []);

  const getPhotoUrl = (photo: string) => {
    if (!photo) return "";
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }
    if (photo.startsWith("/api/")) {
      return `${API_URL}${photo}`;
    }
    return `${API_URL}/api/faculty/photo/${photo}`;
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await fetch(`${API_URL}/api/faculty/upload-photo`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) throw new Error("Upload failed");
    const result = await response.json();
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let photoUrl = form.photo;
    
    if (photoFile) {
      setUploading(true);
      try {
        photoUrl = await uploadPhoto(photoFile);
        toast.success("Photo uploaded successfully");
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast.error("Failed to upload photo");
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API_URL}/api/faculty/${editing._id}` : `${API_URL}/api/faculty`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo: photoUrl })
      });
      
      if (!response.ok) throw new Error("Save failed");
      
      toast.success(editing ? "Faculty updated successfully" : "Faculty added successfully");
      resetForm();
      setModalOpen(false);
      fetchFaculty();
    } catch (error) {
      console.error("Error saving faculty:", error);
      toast.error("Failed to save faculty data");
    }
  };

  const handleEdit = (fac: Faculty) => {
    setEditing(fac);
    setForm({
      name: fac.name || "",
      role: fac.role || "",
      description: fac.description || "",
      department: fac.department || "",
      photo: fac.photo || ""
    });
    setPhotoFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this faculty member? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/faculty/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      
      toast.success("Faculty member deleted successfully");
      fetchFaculty();
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast.error("Failed to delete faculty member");
    }
  };

  const resetForm = () => {
    setForm({ name: "", role: "", description: "", department: "", photo: "" });
    setEditing(null);
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filtering and sorting logic
  const filtered = faculty.filter(fac => {
    const matchesSearch = [fac.name, fac.role, fac.department, fac.description]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || fac.department === departmentFilter;
    const matchesRole = roleFilter === "all" || fac.role === roleFilter;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") comparison = a.name.localeCompare(b.name);
    else if (sortBy === "role") comparison = a.role.localeCompare(b.role);
    else if (sortBy === "department") comparison = a.department.localeCompare(b.department);
    
    return sortOrder === "asc" ? comparison : -comparison;
  });
  
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
              <h1 className="text-3xl font-bold text-slate-900">Faculty Management</h1>
              <p className="text-slate-500 mt-1">Manage faculty members, their roles, and information</p>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }} 
              className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" /> 
              Add Faculty Member
            </Button>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              className="pl-10 bg-white border-slate-200" 
              placeholder="Search by name, role, department..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={(val) => { setDepartmentFilter(val); setPage(1); }}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setPage(1); }}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={cn("flex-1", sortBy === "name" && "bg-primary/10 border-primary")}
              onClick={() => handleSort("name")}
            >
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn("flex-1", sortBy === "role" && "bg-primary/10 border-primary")}
              onClick={() => handleSort("role")}
            >
              Role {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
          </div>
        </motion.div>

        {/* Faculty Grid/Card View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : paginated.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-slate-400 mb-2">No faculty members found</div>
              <Button variant="outline" onClick={() => {
                resetForm();
                setModalOpen(true);
              }}>
                Add your first faculty member
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {paginated.map((fac, idx) => (
                <motion.div
                  key={fac._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200">
                    <CardContent className="p-6">
                      {/* Photo Section */}
                      <div className="flex justify-center mb-4">
                        <Avatar className="w-24 h-24 ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all">
                          <AvatarImage src={getPhotoUrl(fac.photo)} alt={fac.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white text-xl">
                            {getInitials(fac.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      {/* Name and Role */}
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{fac.name}</h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {fac.role}
                        </Badge>
                      </div>
                      
                      {/* Department */}
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-3">
                        <Building2 className="w-4 h-4" />
                        <span>{fac.department}</span>
                      </div>
                      
                      {/* Description Preview */}
                      <p className="text-sm text-slate-500 line-clamp-3 mb-4">
                        {fac.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-center gap-2 pt-2 border-t border-slate-100">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setViewing(fac)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEdit(fac)}
                          className="flex-1"
                        >
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(fac._id)}
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
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, sorted.length)} of {sorted.length} faculty members
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

      {/* Add/Edit Faculty Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <h2 className="text-2xl font-bold">
              {editing ? "Edit Faculty Member" : "Add New Faculty Member"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editing ? "Update faculty information" : "Fill in the details to add a new faculty member"}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold mb-2 block">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  disabled={uploading}
                  placeholder="Dr. John Doe"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role" className="text-sm font-semibold mb-2 block">
                  Role <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Select 
                    value={form.role} 
                    onValueChange={(value) => setForm(f => ({ ...f, role: value }))}
                    required
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="department" className="text-sm font-semibold mb-2 block">
                  Department <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Select 
                    value={form.department} 
                    onValueChange={(value) => setForm(f => ({ ...f, department: value }))}
                    required
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-semibold mb-2 block">
                Introduction / Description <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                  disabled={uploading}
                  placeholder="Write a brief introduction about the faculty member..."
                  rows={4}
                  className="pl-10 resize-none"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                  className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                />
                {(form.photo || photoFile) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setForm({ ...form, photo: "" });
                      setPhotoFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {(form.photo && !photoFile) && (
                <div className="mt-3 flex items-center gap-3">
                  <img 
                    src={getPhotoUrl(form.photo)} 
                    alt="Current" 
                    className="w-16 h-16 object-cover rounded-full border-2 border-primary"
                  />
                  <span className="text-xs text-slate-500">Current photo</span>
                </div>
              )}
              
              {photoFile && (
                <div className="mt-3 flex items-center gap-3">
                  <img 
                    src={URL.createObjectURL(photoFile)} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-full border-2 border-primary"
                  />
                  <span className="text-xs text-slate-500">New photo (will replace current)</span>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }} 
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploading}
                className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  editing ? "Update Faculty" : "Add Faculty"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!viewing} onOpenChange={open => { if (!open) setViewing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <h2 className="text-2xl font-bold">Faculty Profile</h2>
          </DialogHeader>
          
          {viewing && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                  <AvatarImage src={getPhotoUrl(viewing.photo)} alt={viewing.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white text-2xl">
                    {getInitials(viewing.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-2xl mt-4 mb-1">{viewing.name}</h3>
                <Badge className="bg-primary/10 text-primary text-sm px-3 py-1">
                  {viewing.role}
                </Badge>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-slate-500">Department</p>
                    <p className="text-slate-900">{viewing.department}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-slate-500">Introduction</p>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {viewing.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
