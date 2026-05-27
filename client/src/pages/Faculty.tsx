// import { PageTransition } from "@/components/PageTransition";
// import { Mail } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useEffect, useState } from "react";

// const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// interface FacultyItem {
//   _id?: string;
//   name: string;
//   role: string;
//   department: string;
//   description: string;
//   photo?: string;
// }

// export default function Faculty() {
//   const [faculties, setFaculties] = useState<FacultyItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const getPhotoUrl = (photo?: string) => {
//     if (!photo) return "";
//     if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
//     if (photo.startsWith("/api/")) return `${API_URL}${photo}`;
//     return `${API_URL}/api/faculty/photo/${photo}`;
//   };

//   useEffect(() => {
//     const fetchFaculty = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_URL}/api/faculty`);
//         const data = await res.json();
//         const items = Array.isArray(data) ? data : data.faculty || [];
//         setFaculties(items);
//       } catch (err) {
//         console.error("Error fetching faculty:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFaculty();
//   }, []);

//   return (
//     <PageTransition>
//       <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900 pt-32 pb-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">
//             Our Distinguished Faculty
//           </h1>
//           <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light">
//             Learn from passionate educators, industry experts, and researchers who are committed to
//             shaping the next generation of leaders.
//           </p>
//         </div>
//       </div>

//       <div className="py-24 bg-slate-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
//             <div>
//               <h2 className="text-2xl font-semibold text-slate-900">Meet Our Academic Team</h2>
//               <p className="text-sm text-slate-500 mt-1">
//                 Carefully selected mentors across departments to guide you throughout your journey.
//               </p>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {loading ? (
//               Array.from({ length: 6 }).map((_, idx) => (
//                 <Skeleton key={idx} className="h-72 rounded-3xl" />
//               ))
//             ) : faculties.length === 0 ? (
//               <div className="col-span-full text-center text-slate-500">No faculty found.</div>
//             ) : (
//               faculties.map((fac, idx) => (
//                 <div
//                   key={fac._id || idx}
//                   className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
//                 >
//                   <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

//                   <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-1 mb-5 shadow-lg">
//                     {fac.photo ? (
//                       <img
//                         src={getPhotoUrl(fac.photo)}
//                         alt={fac.name}
//                         className="w-full h-full rounded-full object-cover bg-slate-100"
//                       />
//                     ) : (
//                       <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-display font-bold text-slate-800">
//                         {fac.name ? fac.name.charAt(0) : "?"}
//                       </div>
//                     )}
//                   </div>

//                   <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary/5 text-primary mb-3">
//                     {fac.department}
//                   </span>

//                   <h3 className="text-xl font-bold text-slate-900 mb-1">
//                     {fac.name}
//                   </h3>
//                   <div className="text-primary font-medium text-sm mb-4">
//                     {fac.role}
//                   </div>
//                   <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-4">
//                     {fac.description}
//                   </p>
//                   <div className="mt-auto flex items-center justify-center gap-3">
//                     <button
//                       type="button"
//                       className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-500 hover:bg-primary hover:text-white transition-colors"
//                     >
//                       <Mail className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }



// import { PageTransition } from "@/components/PageTransition";
// import { Mail, GraduationCap, Award, BookOpen, Users, Building2, User } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// interface Faculty {
//   _id: string;
//   name: string;
//   role: string;
//   description: string;
//   department: string;
//   photo: string;
//   order?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export default function Faculty() {
//   const [faculties, setFaculties] = useState<Faculty[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchFaculty();
//   }, []);

//   const fetchFaculty = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/faculty`);
//       const data = await response.json();
//       // Handle both array response and object with faculty property
//       const facultyData = Array.isArray(data) ? data : (data.faculty || []);
//       setFaculties(facultyData);
//     } catch (error) {
//       console.error("Error fetching faculty:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPhotoUrl = (photo: string) => {
//     if (!photo) return null;
//     if (photo.startsWith("http://") || photo.startsWith("https://")) {
//       return photo;
//     }
//     if (photo.startsWith("/api/")) {
//       return `${API_URL}${photo}`;
//     }
//     return `${API_URL}/api/faculty/photo/${photo}`;
//   };

//   const getInitials = (name: string) => {
//     if (!name) return "?";
//     return name
//       .split(" ")
//       .map(word => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const getRoleIcon = (role: string) => {
//     const roleLower = role?.toLowerCase() || "";
//     if (roleLower.includes("professor")) return <GraduationCap className="w-4 h-4" />;
//     if (roleLower.includes("lecturer")) return <BookOpen className="w-4 h-4" />;
//     if (roleLower.includes("dean") || roleLower.includes("head")) return <Award className="w-4 h-4" />;
//     return <Users className="w-4 h-4" />;
//   };

//   // Get unique departments for filter
//   const departments = ["all", ...new Set(faculties.map(f => f.department).filter(Boolean))];

//   // Filter faculties based on department and search
//   const filteredFaculties = faculties.filter(fac => {
//     const matchesDepartment = selectedDepartment === "all" || fac.department === selectedDepartment;
//     const matchesSearch = searchTerm === "" || 
//       fac.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       fac.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       fac.department?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesDepartment && matchesSearch;
//   });

//   return (
//     <PageTransition>
//       {/* Hero Section */}
//       <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 relative overflow-hidden">
//         <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
//           <motion.h1 
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-4xl md:text-5xl font-display font-black text-white mb-6"
//           >
//             Our Distinguished Faculty
//           </motion.h1>
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="text-xl text-slate-300 max-w-2xl mx-auto font-light"
//           >
//             Learn from the brightest minds. Our professors are renowned experts, researchers, and thought leaders dedicated to your success.
//           </motion.p>
//         </div>
//       </div>

//       <div className="py-16 bg-gradient-to-br from-slate-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           {/* Filters Section */}
//           <div className="mb-12 space-y-4">
//             {/* Search Bar */}
//             <div className="max-w-md mx-auto">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search by name, role, or department..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
//                 />
//                 <svg
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>
            
//             {/* Department Filters */}
//             {departments.length > 1 && (
//               <div className="flex flex-wrap justify-center gap-2">
//                 {departments.map(dept => (
//                   <button
//                     key={dept}
//                     onClick={() => setSelectedDepartment(dept)}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                       selectedDepartment === dept
//                         ? "bg-gradient-to-r from-primary to-emerald-500 text-white shadow-md"
//                         : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
//                     }`}
//                   >
//                     {dept === "all" ? "All Departments" : dept}
//                   </button>
//                 ))}
//               </div>
//             )}
            
//             {/* Results Count */}
//             {!loading && (
//               <p className="text-center text-sm text-slate-500">
//                 Showing {filteredFaculties.length} of {faculties.length} faculty members
//               </p>
//             )}
//           </div>

//           {/* Faculty Grid */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {loading ? (
//               Array.from({ length: 6 }).map((_, idx) => (
//                 <Card key={idx} className="overflow-hidden border-slate-200">
//                   <CardContent className="p-6">
//                     <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
//                     <Skeleton className="h-6 w-32 mx-auto mb-2" />
//                     <Skeleton className="h-4 w-24 mx-auto mb-4" />
//                     <Skeleton className="h-4 w-full mb-2" />
//                     <Skeleton className="h-4 w-full mb-2" />
//                     <Skeleton className="h-4 w-3/4 mx-auto" />
//                   </CardContent>
//                 </Card>
//               ))
//             ) : filteredFaculties.length === 0 ? (
//               <div className="col-span-full text-center py-12">
//                 <div className="text-slate-400 mb-2">No faculty members found</div>
//                 <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
//               </div>
//             ) : (
//               filteredFaculties.map((fac, idx) => (
//                 <motion.div
//                   key={fac._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: idx * 0.05 }}
//                 >
//                   <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200 h-full">
//                     <CardContent className="p-6 text-center">
//                       {/* Profile Image */}
//                       <div className="relative mb-4">
//                         <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-1 group-hover:scale-105 transition-transform duration-300">
//                           {fac.photo ? (
//                             <img
//                               src={getPhotoUrl(fac.photo) || ""}
//                               alt={fac.name}
//                               className="w-full h-full rounded-full object-cover bg-white"
//                               onError={(e) => {
//                                 (e.target as HTMLImageElement).style.display = "none";
//                                 (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
//                               }}
//                             />
//                           ) : null}
//                           <div className={`w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-display font-bold text-slate-800 ${fac.photo ? "hidden" : ""}`}>
//                             {getInitials(fac.name)}
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Name and Role */}
//                       <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
//                         {fac.name}
//                       </h3>
//                       <div className="flex items-center justify-center gap-1 text-primary font-medium text-sm mb-3">
//                         {getRoleIcon(fac.role)}
//                         <span>{fac.role}</span>
//                       </div>
                      
//                       {/* Department Badge */}
//                       {fac.department && (
//                         <Badge variant="outline" className="mb-4 bg-slate-50">
//                           <Building2 className="w-3 h-3 mr-1" />
//                           {fac.department}
//                         </Badge>
//                       )}
                      
//                       {/* Description */}
//                       <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
//                         {fac.description}
//                       </p>
                      
//                       {/* Contact Button */}
//                       <div className="flex justify-center gap-2 pt-2 border-t border-slate-100">
//                         <a 
//                           href={`mailto:${fac.email || "info@tce.edu.np"}`}
//                           className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-600 hover:bg-primary hover:text-white transition-all duration-300 text-sm"
//                         >
//                           <Mail className="w-4 h-4" />
//                           Contact
//                         </a>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }



import { PageTransition } from "@/components/PageTransition";
import { 
  Mail, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Users, 
  Building2, 
  Phone, 
  Calendar, 
  MapPin, 
  X,
  ExternalLink
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface Faculty {
  _id: string;
  name: string;
  role: string;
  description: string;
  department: string;
  photo: string;
  order?: number;
  email?: string;
  phone?: string;
  qualifications?: string[];
  expertise?: string[];
  joinedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Faculty() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/faculty`);
      const data = await response.json();
      const facultyData = Array.isArray(data) ? data : (data.faculty || []);
      setFaculties(facultyData);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (photo: string) => {
    if (!photo) return null;
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }
    if (photo.startsWith("/api/")) {
      return `${API_URL}${photo}`;
    }
    return `${API_URL}/api/faculty/photo/${photo}`;
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: string) => {
    const roleLower = role?.toLowerCase() || "";
    if (roleLower.includes("professor")) return <GraduationCap className="w-5 h-5" />;
    if (roleLower.includes("lecturer")) return <BookOpen className="w-5 h-5" />;
    if (roleLower.includes("dean") || roleLower.includes("head")) return <Award className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  // Get unique departments for filter
  const departments = ["all", ...new Set(faculties.map(f => f.department).filter(Boolean))];

  // Filter faculties based on department and search
  const filteredFaculties = faculties.filter(fac => {
    const matchesDepartment = selectedDepartment === "all" || fac.department === selectedDepartment;
    const matchesSearch = searchTerm === "" || 
      fac.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const openFacultyDetails = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setModalOpen(true);
  };

  return (
    <PageTransition>
      {/* Hero Section - Clean and Minimal */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-display font-black text-white mb-4"
          >
            Meet Our Faculty
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-24 h-1 bg-gradient-to-r from-primary to-sky-500 mx-auto rounded-full"
          />
        </div>
      </div>

      <div className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters Section */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, role, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 pl-12 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Department Filters */}
            {departments.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedDepartment === dept
                        ? "bg-gradient-to-r from-primary to-sky-500 text-white shadow-md"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {dept === "all" ? "All Departments" : dept}
                  </button>
                ))}
              </div>
            )}
            
            {/* Results Count */}
            {!loading && filteredFaculties.length > 0 && (
              <p className="text-center text-sm text-slate-500">
                {filteredFaculties.length} {filteredFaculties.length === 1 ? "faculty member" : "faculty members"} found
              </p>
            )}
          </div>

          {/* Faculty Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="overflow-hidden border-slate-200">
                  <CardContent className="p-6">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-40 mx-auto mb-2" />
                    <Skeleton className="h-4 w-28 mx-auto mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))
            ) : filteredFaculties.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-slate-400 mb-3">
                  <Users className="w-16 h-16 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-1">No faculty members found</h3>
                <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredFaculties.map((fac, idx) => (
                <motion.div
                  key={fac._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200 h-full cursor-pointer"
                    onClick={() => openFacultyDetails(fac)}
                  >
                    <CardContent className="p-6 text-center">
                      {/* Profile Image - Larger Size */}
                      <div className="relative mb-5">
                        <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-primary to-sky-500 p-1 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                          {fac.photo ? (
                            <img
                              src={getPhotoUrl(fac.photo) || ""}
                              alt={fac.name}
                              className="w-full h-full rounded-full object-cover bg-white"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-display font-bold text-slate-800 ${fac.photo ? "hidden" : ""}`}>
                            {getInitials(fac.name)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Name and Role */}
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {fac.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-primary font-medium text-sm mb-3">
                        {getRoleIcon(fac.role)}
                        <span>{fac.role}</span>
                      </div>
                      
                      {/* Department Badge */}
                      {fac.department && (
                        <Badge variant="outline" className="mb-4 bg-slate-50">
                          <Building2 className="w-3 h-3 mr-1" />
                          {fac.department}
                        </Badge>
                      )}
                      
                      {/* Description Preview */}
                      <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-2">
                        {fac.description}
                      </p>
                      
                      {/* View Details Button */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          openFacultyDetails(fac);
                        }}
                      >
                        View Full Profile
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Faculty Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedFaculty && (
            <>
              <div className="relative">
                {/* Hero Image Section */}
                <div className="relative h-48 bg-gradient-to-r from-primary to-sky-500">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors z-10"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                {/* Profile Image - Overlapping */}
                <div className="relative -mt-20 px-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-primary to-sky-500 p-1 shadow-2xl">
                      {selectedFaculty.photo ? (
                        <img
                          src={getPhotoUrl(selectedFaculty.photo) || ""}
                          alt={selectedFaculty.name}
                          className="w-full h-full rounded-full object-cover bg-white"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full rounded-full bg-white flex items-center justify-center text-5xl font-display font-bold text-slate-800 ${selectedFaculty.photo ? "hidden" : ""}`}>
                        {getInitials(selectedFaculty.name)}
                      </div>
                    </div>
                    
                    <div className="flex-1 pt-4 md:pt-0">
                      <h2 className="text-3xl font-bold text-slate-900 mb-1">{selectedFaculty.name}</h2>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 text-primary">
                          {getRoleIcon(selectedFaculty.role)}
                          <span className="font-medium">{selectedFaculty.role}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <Badge variant="outline" className="bg-slate-50">
                          <Building2 className="w-3 h-3 mr-1" />
                          {selectedFaculty.department}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogHeader className="px-6 pt-4">
                <DialogTitle className="sr-only">Faculty Details</DialogTitle>
              </DialogHeader>
              
              <div className="px-6 pb-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Biography</h3>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedFaculty.description}
                  </p>
                </div>
                
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  {(selectedFaculty.email || selectedFaculty.phone) && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <a 
                          href={`mailto:${selectedFaculty.email || "info@tce.edu.np"}`}
                          className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                          <span>{selectedFaculty.email || "info@tce.edu.np"}</span>
                        </a>
                        {selectedFaculty.phone && (
                          <div className="flex items-center gap-3 text-slate-600">
                            <Phone className="w-5 h-5" />
                            <span>{selectedFaculty.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedFaculty.joinedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Additional Info</h3>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Calendar className="w-5 h-5" />
                        <span>Joined: {formatDate(selectedFaculty.joinedDate)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Qualifications Section */}
                {selectedFaculty.qualifications && selectedFaculty.qualifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Qualifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.qualifications.map((qual, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-slate-100">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Expertise Section */}
                {selectedFaculty.expertise && selectedFaculty.expertise.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="outline" className="border-primary/30 text-primary">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="px-6 pb-6 pt-2">
                <Button 
                  onClick={() => setModalOpen(false)}
                  variant="outline"
                >
                  Close
                </Button>
                <a 
                  href={`mailto:${selectedFaculty.email || "info@tce.edu.np"}`}
                  className="inline-flex"
                >
                  <Button className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Faculty
                  </Button>
                </a>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}