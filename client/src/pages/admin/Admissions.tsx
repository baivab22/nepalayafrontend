// import { useEffect, useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
// import { 
//   Users, 
//   Mail, 
//   BookOpen, 
//   Plus, 
//   Pencil, 
//   Trash2, 
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   GraduationCap,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Eye,
//   Filter,
//   Download,
//   Send
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import { format } from "date-fns";

// const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// interface Admission {
//   _id: string;
//   name: string;
//   email: string;
//   program: string;
//   status?: "pending" | "approved" | "rejected";
//   appliedDate?: string;
//   phone?: string;
//   message?: string;
// }

// interface AdmissionForm {
//   name: string;
//   email: string;
//   program: string;
//   phone?: string;
//   message?: string;
// }

// const programs = [
//   "Bachelor of Computer Science",
//   "Bachelor of Business Administration",
//   "Bachelor of Arts",
//   "Bachelor of Science",
//   "Master of Computer Science",
//   "Master of Business Administration",
//   "PhD Program",
//   "Diploma in IT"
// ];

// export default function AdminAdmissions() {
//   const [admissions, setAdmissions] = useState<Admission[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [form, setForm] = useState<AdmissionForm>({ 
//     name: "", 
//     email: "", 
//     program: "",
//     phone: "",
//     message: ""
//   });
//   const [editing, setEditing] = useState<Admission | null>(null);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [programFilter, setProgramFilter] = useState<string>("all");
//   const [viewing, setViewing] = useState<Admission | null>(null);
//   const [selectedAdmissions, setSelectedAdmissions] = useState<string[]>([]);
  
//   const pageSize = 10;

//   const fetchAdmissions = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/admissions`);
//       const data = await response.json();
//       setAdmissions(data.admissions || []);
//       toast.success("Admissions loaded successfully");
//     } catch (error) {
//       console.error("Error fetching admissions:", error);
//       toast.error("Failed to load admissions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { 
//     fetchAdmissions(); 
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const method = editing ? "PUT" : "POST";
//     const url = editing ? `${API_URL}/api/admissions/${editing._id}` : `${API_URL}/api/admissions`;
    
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });
      
//       if (!response.ok) throw new Error("Save failed");
      
//       toast.success(editing ? "Application updated successfully" : "Application added successfully");
//       resetForm();
//       setModalOpen(false);
//       fetchAdmissions();
//     } catch (error) {
//       console.error("Error saving admission:", error);
//       toast.error("Failed to save application");
//     }
//   };

//   const handleEdit = (item: Admission) => {
//     setEditing(item);
//     setForm({
//       name: item.name,
//       email: item.email,
//       program: item.program,
//       phone: item.phone || "",
//       message: item.message || ""
//     });
//     setModalOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    
//     try {
//       const response = await fetch(`${API_URL}/api/admissions/${id}`, { method: "DELETE" });
//       if (!response.ok) throw new Error("Delete failed");
      
//       toast.success("Application deleted successfully");
//       fetchAdmissions();
//     } catch (error) {
//       console.error("Error deleting admission:", error);
//       toast.error("Failed to delete application");
//     }
//   };

//   const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
//     try {
//       const response = await fetch(`${API_URL}/api/admissions/${id}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status })
//       });
      
//       if (!response.ok) throw new Error("Status update failed");
      
//       toast.success(`Application ${status} successfully`);
//       fetchAdmissions();
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Failed to update status");
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedAdmissions.length === 0) return;
//     if (!window.confirm(`Delete ${selectedAdmissions.length} selected applications?`)) return;
    
//     try {
//       await Promise.all(
//         selectedAdmissions.map(id => 
//           fetch(`${API_URL}/api/admissions/${id}`, { method: "DELETE" })
//         )
//       );
//       toast.success(`${selectedAdmissions.length} applications deleted successfully`);
//       setSelectedAdmissions([]);
//       fetchAdmissions();
//     } catch (error) {
//       console.error("Error bulk deleting:", error);
//       toast.error("Failed to delete some applications");
//     }
//   };

//   const resetForm = () => {
//     setForm({ name: "", email: "", program: "", phone: "", message: "" });
//     setEditing(null);
//   };

//   const handleAddNew = () => {
//     resetForm();
//     setModalOpen(true);
//   };

//   const toggleSelectAll = () => {
//     if (selectedAdmissions.length === paginated.length) {
//       setSelectedAdmissions([]);
//     } else {
//       setSelectedAdmissions(paginated.map(a => a._id));
//     }
//   };

//   const toggleSelect = (id: string) => {
//     setSelectedAdmissions(prev =>
//       prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//     );
//   };

//   // Filtering and pagination
//   const filtered = admissions.filter(item => {
//     const matchesSearch = 
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.email.toLowerCase().includes(search.toLowerCase()) ||
//       item.program.toLowerCase().includes(search.toLowerCase());
    
//     const matchesStatus = statusFilter === "all" || item.status === statusFilter;
//     const matchesProgram = programFilter === "all" || item.program === programFilter;
    
//     return matchesSearch && matchesStatus && matchesProgram;
//   });
  
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case "approved": return "bg-emerald-100 text-emerald-700";
//       case "rejected": return "bg-red-100 text-red-700";
//       default: return "bg-amber-100 text-amber-700";
//     }
//   };

//   const getStatusIcon = (status?: string) => {
//     switch (status) {
//       case "approved": return <CheckCircle className="w-3 h-3" />;
//       case "rejected": return <XCircle className="w-3 h-3" />;
//       default: return <Clock className="w-3 h-3" />;
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "N/A";
//     try {
//       return format(new Date(dateString), "MMM dd, yyyy");
//     } catch {
//       return dateString;
//     }
//   };

//   const exportToCSV = () => {
//     const headers = ["Name", "Email", "Program", "Status", "Applied Date", "Phone"];
//     const csvData = filtered.map(item => [
//       item.name,
//       item.email,
//       item.program,
//       item.status || "pending",
//       item.appliedDate ? format(new Date(item.appliedDate), "yyyy-MM-dd") : "",
//       item.phone || ""
//     ]);
    
//     const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `admissions_${format(new Date(), "yyyy-MM-dd")}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success("Exported successfully");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900">Admissions Management</h1>
//               <p className="text-slate-500 mt-1">Manage student applications and admissions</p>
//             </div>
//             <div className="flex gap-3">
//               {selectedAdmissions.length > 0 && (
//                 <Button 
//                   variant="destructive" 
//                   onClick={handleBulkDelete}
//                   className="gap-2"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete Selected ({selectedAdmissions.length})
//                 </Button>
//               )}
//               <Button 
//                 onClick={exportToCSV}
//                 variant="outline"
//                 className="gap-2"
//               >
//                 <Download className="w-4 h-4" />
//                 Export CSV
//               </Button>
//               <Button 
//                 onClick={handleAddNew} 
//                 className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <Plus className="w-4 h-4 mr-2" /> 
//                 Add Application
//               </Button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Filters Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
//         >
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <Input 
//               className="pl-10 bg-white border-slate-200" 
//               placeholder="Search by name, email, program..." 
//               value={search} 
//               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             />
//           </div>
          
//           <select
//             className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//             value={statusFilter}
//             onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
          
//           <select
//             className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//             value={programFilter}
//             onChange={(e) => { setProgramFilter(e.target.value); setPage(1); }}
//           >
//             <option value="all">All Programs</option>
//             {programs.map(program => (
//               <option key={program} value={program}>{program}</option>
//             ))}
//           </select>
          
//           <div className="text-sm text-slate-500 flex items-center">
//             Total: {filtered.length} applications
//           </div>
//         </motion.div>

//         {/* Admissions Table */}
//         <Card className="border-slate-200 shadow-lg overflow-hidden">
//           <CardContent className="p-0">
//             {loading ? (
//               <div className="p-6 space-y-4">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Skeleton key={i} className="h-16 rounded-lg" />
//                 ))}
//               </div>
//             ) : paginated.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="text-slate-400 mb-2">No applications found</div>
//                 <Button variant="outline" onClick={handleAddNew}>
//                   Add your first application
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left">
//                     <thead className="bg-slate-50 border-b border-slate-200">
//                       <tr>
//                         <th className="px-6 py-4 w-12">
//                           <input
//                             type="checkbox"
//                             checked={selectedAdmissions.length === paginated.length && paginated.length > 0}
//                             onChange={toggleSelectAll}
//                             className="rounded border-slate-300"
//                           />
//                         </th>
//                         <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
//                         <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
//                         <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied Date</th>
//                         <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                       <AnimatePresence>
//                         {paginated.map((item, idx) => (
//                           <motion.tr 
//                             key={item._id}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             transition={{ delay: idx * 0.05 }}
//                             className="hover:bg-slate-50 transition-colors"
//                           >
//                             <td className="px-6 py-4">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedAdmissions.includes(item._id)}
//                                 onChange={() => toggleSelect(item._id)}
//                                 className="rounded border-slate-300"
//                               />
//                             </td>
//                             <td className="px-6 py-4">
//                               <div>
//                                 <div className="font-medium text-slate-900">{item.name}</div>
//                                 <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
//                                   <Mail className="w-3 h-3" />
//                                   {item.email}
//                                 </div>
//                                 {item.phone && (
//                                   <div className="text-xs text-slate-400 mt-1">{item.phone}</div>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <Badge variant="outline" className="bg-primary/5">
//                                 {item.program}
//                               </Badge>
//                             </td>
//                             <td className="px-6 py-4 text-slate-600">
//                               <div className="flex items-center gap-1">
//                                 <Calendar className="w-3 h-3 text-slate-400" />
//                                 {formatDate(item.appliedDate)}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
//                                 {getStatusIcon(item.status)}
//                                 {item.status || "pending"}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <Button 
//                                   size="icon" 
//                                   variant="ghost" 
//                                   className="h-8 w-8 hover:bg-slate-100"
//                                   onClick={() => setViewing(item)}
//                                 >
//                                   <Eye className="w-4 h-4" />
//                                 </Button>
//                                 <Button 
//                                   size="icon" 
//                                   variant="ghost" 
//                                   className="h-8 w-8 hover:bg-slate-100"
//                                   onClick={() => handleEdit(item)}
//                                 >
//                                   <Pencil className="w-4 h-4" />
//                                 </Button>
//                                 {item.status !== "approved" && (
//                                   <Button 
//                                     size="icon" 
//                                     variant="ghost" 
//                                     className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
//                                     onClick={() => handleStatusUpdate(item._id, "approved")}
//                                   >
//                                     <CheckCircle className="w-4 h-4" />
//                                   </Button>
//                                 )}
//                                 {item.status !== "rejected" && (
//                                   <Button 
//                                     size="icon" 
//                                     variant="ghost" 
//                                     className="h-8 w-8 text-red-600 hover:bg-red-50"
//                                     onClick={() => handleStatusUpdate(item._id, "rejected")}
//                                   >
//                                     <XCircle className="w-4 h-4" />
//                                   </Button>
//                                 )}
//                                 <Button 
//                                   size="icon" 
//                                   variant="ghost" 
//                                   className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
//                                   onClick={() => handleDelete(item._id)}
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </AnimatePresence>
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100">
//                     <div className="text-sm text-slate-500">
//                       Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} applications
//                     </div>
//                     <div className="flex gap-2">
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         disabled={page === 1} 
//                         onClick={() => handlePageChange(page - 1)}
//                       >
//                         <ChevronLeft className="w-4 h-4 mr-1" /> Previous
//                       </Button>
//                       <div className="flex gap-1">
//                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                           let pageNum = page;
//                           if (totalPages <= 5) {
//                             pageNum = i + 1;
//                           } else if (page <= 3) {
//                             pageNum = i + 1;
//                           } else if (page >= totalPages - 2) {
//                             pageNum = totalPages - 4 + i;
//                           } else {
//                             pageNum = page - 2 + i;
//                           }
                          
//                           if (pageNum > totalPages || pageNum < 1) return null;
                          
//                           return (
//                             <Button
//                               key={pageNum}
//                               variant={page === pageNum ? "default" : "outline"}
//                               size="sm"
//                               onClick={() => handlePageChange(pageNum)}
//                               className="w-10"
//                             >
//                               {pageNum}
//                             </Button>
//                           );
//                         })}
//                       </div>
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         disabled={page === totalPages} 
//                         onClick={() => handlePageChange(page + 1)}
//                       >
//                         Next <ChevronRight className="w-4 h-4 ml-1" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Add/Edit Admission Modal */}
//       <Dialog open={modalOpen} onOpenChange={setModalOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <h2 className="text-2xl font-bold">
//               {editing ? "Edit Application" : "Add New Application"}
//             </h2>
//             <p className="text-sm text-slate-500 mt-1">
//               {editing ? "Update student application details" : "Enter student information for admission"}
//             </p>
//           </DialogHeader>
          
//           <form onSubmit={handleSubmit} className="space-y-5 mt-4">
//             <div>
//               <Label htmlFor="name" className="text-sm font-semibold mb-2 block">
//                 Full Name <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative">
//                 <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <Input
//                   id="name"
//                   value={form.name}
//                   onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//                   required
//                   placeholder="Enter full name"
//                   className="pl-10"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <Label htmlFor="email" className="text-sm font-semibold mb-2 block">
//                 Email Address <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <Input
//                   id="email"
//                   type="email"
//                   value={form.email}
//                   onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
//                   required
//                   placeholder="student@example.com"
//                   className="pl-10"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">
//                 Phone Number
//               </Label>
//               <Input
//                 id="phone"
//                 value={form.phone}
//                 onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
//                 placeholder="+1 234 567 8900"
//               />
//             </div>
            
//             <div>
//               <Label htmlFor="program" className="text-sm font-semibold mb-2 block">
//                 Program <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative">
//                 <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <select
//                   id="program"
//                   value={form.program}
//                   onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
//                   required
//                   className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
//                 >
//                   <option value="">Select a program</option>
//                   {programs.map(program => (
//                     <option key={program} value={program}>{program}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div>
//               <Label htmlFor="message" className="text-sm font-semibold mb-2 block">
//                 Additional Message
//               </Label>
//               <textarea
//                 id="message"
//                 value={form.message}
//                 onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
//                 placeholder="Any additional information..."
//               />
//             </div>
            
//             <DialogFooter className="gap-2 pt-4">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => {
//                   setModalOpen(false);
//                   resetForm();
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit" 
//                 className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90"
//               >
//                 {editing ? "Update Application" : "Submit Application"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* View Details Modal */}
//       <Dialog open={!!viewing} onOpenChange={open => { if (!open) setViewing(null); }}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <h2 className="text-2xl font-bold">Application Details</h2>
//           </DialogHeader>
          
//           {viewing && (
//             <div className="space-y-4">
//               <div className="bg-slate-50 rounded-lg p-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-xs text-slate-500">Full Name</p>
//                     <p className="font-medium text-slate-900">{viewing.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Status</p>
//                     <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(viewing.status)}`}>
//                       {getStatusIcon(viewing.status)}
//                       {viewing.status || "pending"}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Email</p>
//                     <p className="text-sm text-slate-700">{viewing.email}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Phone</p>
//                     <p className="text-sm text-slate-700">{viewing.phone || "N/A"}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-slate-500">Program</p>
//                     <Badge variant="outline" className="mt-1">{viewing.program}</Badge>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Applied Date</p>
//                     <p className="text-sm text-slate-700">{formatDate(viewing.appliedDate)}</p>
//                   </div>
//                   {viewing.message && (
//                     <div className="col-span-2">
//                       <p className="text-xs text-slate-500">Additional Message</p>
//                       <p className="text-sm text-slate-700 mt-1">{viewing.message}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setViewing(null)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // Missing Clock import for status icon
// const Clock = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );




import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { 
  Users, 
  Mail, 
  BookOpen, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface Admission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  district: string;
  program: string;
  level: string;
  previousSchool: string;
  gpa?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface AdmissionForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  district: string;
  program: string;
  level: string;
  previousSchool: string;
  gpa: string;
  message: string;
}

const programs = [
  "B.E. Civil Engineering",
  "B.E. Computer Engineering",
  "B.E. Electrical Engineering",
  "B.E. Mechanical Engineering",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Business Studies (BBS)",
  "Bachelor of Science (B.Sc.)",
  "Master of Business Administration (MBA)",
  "Master of Computer Science (MSc CS)",
  "PhD in Engineering"
];

const levels = ["bachelor", "master", "phd"];
const genders = ["male", "female", "other"];
const districts = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", 
  "Dharan", "Biratnagar", "Butwal", "Nepalgunj", "Dhangadhi"
];

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AdmissionForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    district: "Kathmandu",
    program: "B.E. Computer Engineering",
    level: "bachelor",
    previousSchool: "",
    gpa: "",
    message: ""
  });
  const [editing, setEditing] = useState<Admission | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<Admission | null>(null);
  const [selectedAdmissions, setSelectedAdmissions] = useState<string[]>([]);
  
  const pageSize = 10;

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admissions`);
      const data = await response.json();
      // Handle both array and object responses
      const admissionsData = Array.isArray(data) ? data : (data.admissions || []);
      setAdmissions(admissionsData);
      toast.success("Applications loaded successfully");
    } catch (error) {
      console.error("Error fetching admissions:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAdmissions(); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API_URL}/api/admissions/${editing.id}` : `${API_URL}/api/admissions`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) throw new Error("Save failed");
      
      toast.success(editing ? "Application updated successfully" : "Application added successfully");
      resetForm();
      setModalOpen(false);
      fetchAdmissions();
    } catch (error) {
      console.error("Error saving admission:", error);
      toast.error("Failed to save application");
    }
  };

  const handleEdit = (item: Admission) => {
    setEditing(item);
    setForm({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone,
      dateOfBirth: item.dateOfBirth.split('T')[0] || "",
      gender: item.gender,
      address: item.address,
      district: item.district,
      program: item.program,
      level: item.level,
      previousSchool: item.previousSchool,
      gpa: item.gpa || "",
      message: item.message || ""
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/admissions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      
      toast.success("Application deleted successfully");
      fetchAdmissions();
    } catch (error) {
      console.error("Error deleting admission:", error);
      toast.error("Failed to delete application");
    }
  };

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`${API_URL}/api/admissions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error("Status update failed");
      
      toast.success(`Application ${status} successfully`);
      fetchAdmissions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAdmissions.length === 0) return;
    if (!window.confirm(`Delete ${selectedAdmissions.length} selected applications?`)) return;
    
    try {
      await Promise.all(
        selectedAdmissions.map(id => 
          fetch(`${API_URL}/api/admissions/${id}`, { method: "DELETE" })
        )
      );
      toast.success(`${selectedAdmissions.length} applications deleted successfully`);
      setSelectedAdmissions([]);
      fetchAdmissions();
    } catch (error) {
      console.error("Error bulk deleting:", error);
      toast.error("Failed to delete some applications");
    }
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      district: "Kathmandu",
      program: "B.E. Computer Engineering",
      level: "bachelor",
      previousSchool: "",
      gpa: "",
      message: ""
    });
    setEditing(null);
  };

  const handleAddNew = () => {
    resetForm();
    setModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedAdmissions.length === paginated.length) {
      setSelectedAdmissions([]);
    } else {
      setSelectedAdmissions(paginated.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedAdmissions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filtering and pagination
  const filtered = admissions.filter(item => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.program.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesProgram = programFilter === "all" || item.program === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved": return "bg-emerald-100 text-emerald-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-3 h-3" />;
      case "rejected": return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const getFullName = (item: Admission) => {
    return `${item.firstName} ${item.lastName}`;
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Program", "Level", "Status", "Applied Date", "District"];
    const csvData = filtered.map(item => [
      getFullName(item),
      item.email,
      item.phone,
      item.program,
      item.level,
      item.status,
      formatDate(item.createdAt),
      item.district
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admissions_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully");
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
              <h1 className="text-3xl font-bold text-slate-900">Admissions Management</h1>
              <p className="text-slate-500 mt-1">Manage student applications and admissions</p>
            </div>
            <div className="flex gap-3">
              {selectedAdmissions.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleBulkDelete}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedAdmissions.length})
                </Button>
              )}
              <Button 
                onClick={exportToCSV}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button 
                onClick={handleAddNew} 
                className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" /> 
                Add Application
              </Button>
            </div>
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
              placeholder="Search by name, email, program..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          
          <select
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={programFilter}
            onChange={(e) => { setProgramFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Programs</option>
            {programs.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
          
          <div className="text-sm text-slate-500 flex items-center">
            Total: {filtered.length} applications
          </div>
        </motion.div>

        {/* Admissions Table */}
        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-2">No applications found</div>
                <Button variant="outline" onClick={handleAddNew}>
                  Add your first application
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 w-12">
                          <input
                            type="checkbox"
                            checked={selectedAdmissions.length === paginated.length && paginated.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-slate-300"
                          />
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence>
                        {paginated.map((item, idx) => (
                          <motion.tr 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedAdmissions.includes(item.id)}
                                onChange={() => toggleSelect(item.id)}
                                className="rounded border-slate-300"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-slate-900">{getFullName(item)}</div>
                                <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                  <Mail className="w-3 h-3" />
                                  {item.email}
                                </div>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                  <Phone className="w-3 h-3" />
                                  {item.phone}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="bg-primary/5 max-w-[200px] truncate">
                                {item.program}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <span className="capitalize text-sm text-slate-600">{item.level}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {formatDate(item.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                {getStatusIcon(item.status)}
                                {item.status}
                              </span>
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
                                  onClick={() => handleEdit(item)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                {item.status !== "approved" && (
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                                    onClick={() => handleStatusUpdate(item.id, "approved")}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                {item.status !== "rejected" && (
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                                    onClick={() => handleStatusUpdate(item.id, "rejected")}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100">
                    <div className="text-sm text-slate-500">
                      Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} applications
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
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Admission Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <h2 className="text-2xl font-bold">
              {editing ? "Edit Application" : "Add New Application"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editing ? "Update student application details" : "Enter student information for admission"}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">First Name *</Label>
                <Input
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  required
                  placeholder="Ram"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Last Name *</Label>
                <Input
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  required
                  placeholder="Sharma"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Email Address *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Phone Number *</Label>
                <Input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required
                  placeholder="+977-98XXXXXXXX"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Date of Birth *</Label>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Gender *</Label>
                <select
                  value={form.gender}
                  onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {genders.map(g => (
                    <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Address *</Label>
              <Input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                required
                placeholder="Gwarko, Lalitpur"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">District *</Label>
                <select
                  value={form.district}
                  onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Study Level *</Label>
                <select
                  value={form.level}
                  onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {levels.map(l => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}'s Degree</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Program *</Label>
              <select
                value={form.program}
                onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {programs.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Previous School / College *</Label>
              <Input
                value={form.previousSchool}
                onChange={e => setForm(f => ({ ...f, previousSchool: e.target.value }))}
                required
                placeholder="Trinity International College"
              />
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">GPA / Percentage</Label>
              <Input
                value={form.gpa}
                onChange={e => setForm(f => ({ ...f, gpa: e.target.value }))}
                placeholder="e.g., 3.8 or 85%"
              />
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Additional Message</Label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Any additional information..."
              />
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
                className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90"
              >
                {editing ? "Update Application" : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!viewing} onOpenChange={open => { if (!open) setViewing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <h2 className="text-2xl font-bold">Application Details</h2>
          </DialogHeader>
          
          {viewing && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="font-medium text-slate-900">{getFullName(viewing)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(viewing.status)}`}>
                      {getStatusIcon(viewing.status)}
                      {viewing.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm text-slate-700">{viewing.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm text-slate-700">{viewing.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date of Birth</p>
                    <p className="text-sm text-slate-700">{formatDate(viewing.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Gender</p>
                    <p className="text-sm text-slate-700 capitalize">{viewing.gender}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="text-sm text-slate-700">{viewing.address}, {viewing.district}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Program</p>
                    <Badge variant="outline" className="mt-1">{viewing.program}</Badge>
                    <p className="text-xs text-slate-400 mt-1 capitalize">{viewing.level}'s Degree</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Previous School</p>
                    <p className="text-sm text-slate-700">{viewing.previousSchool}</p>
                  </div>
                  {viewing.gpa && (
                    <div>
                      <p className="text-xs text-slate-500">GPA/Percentage</p>
                      <p className="text-sm text-slate-700">{viewing.gpa}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500">Applied Date</p>
                    <p className="text-sm text-slate-700">{formatDate(viewing.createdAt)}</p>
                  </div>
                  {viewing.message && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Additional Message</p>
                      <p className="text-sm text-slate-700 mt-1">{viewing.message}</p>
                    </div>
                  )}
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

// Clock component for pending status
const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);