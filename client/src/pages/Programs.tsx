// import { PageTransition } from "@/components/PageTransition";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "wouter";
// import { ChevronRight } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useEffect, useState } from "react";

// const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// export default function Programs() {
//   const [programs, setPrograms] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`${API_URL}/api/programs`)
//       .then(res => res.json())
//       .then(data => {
//         const raw = Array.isArray(data) ? data : (data?.programs || []);
//         const normalized = raw.map((p: any) => ({
//           ...p,
//           items: Array.isArray(p.items)
//             ? p.items
//             : p.description
//               ? String(p.description)
//                   .split(",")
//                   .map((item) => item.trim())
//                   .filter((item) => item.length > 0)
//               : [],
//         }));
//         setPrograms(normalized);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   return (
//     <PageTransition>
//       <div className="bg-slate-900 pt-32 pb-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <Badge variant="outline" className="text-amber-400 border-amber-400/50 bg-amber-400/10 mb-6">Academics</Badge>
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6">Our Programs</h1>
//           <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
//             Discover comprehensive degree programs designed to equip you with the knowledge and skills needed in today's dynamic world.
//           </p>
//         </div>
//       </div>

//       <div className="py-24 bg-slate-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {loading ? (
//               Array.from({ length: 6 }).map((_, idx) => (
//                 <Skeleton key={idx} className="h-64 rounded-3xl" />
//               ))
//             ) : programs.length === 0 ? (
//               <div className="col-span-full text-center text-slate-500">No programs found.</div>
//             ) : (
//               programs.map((prog, idx) => (
//                 <div key={prog._id || idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
//                   <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
//                     {/* Optionally render icon if available */}
//                   </div>
//                   <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">{prog.title}</h2>
//                   <ul className="space-y-4">
//                     {prog.items && prog.items.length > 0 ? prog.items.map((item: string, i: number) => (
//                       <li key={i} className="flex items-start group">
//                         <ChevronRight className="w-5 h-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-2 shrink-0" />
//                         <Link href="/admissions" className="text-slate-600 hover:text-primary font-medium transition-colors cursor-pointer">
//                           {item}
//                         </Link>
//                       </li>
//                     )) : <li className="text-slate-400">No details</li>}
//                   </ul>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }


import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface Program {
  _id: string;
  title: string;
  items: string[];
  description?: string;
  image?: string;
  duration?: string;
  level?: string;
  seats?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function Programs() {
  const [, navigate] = useLocation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/programs`);
      const data = await response.json();
      const raw = Array.isArray(data) ? data : (data?.programs || []);
      const normalized = raw.map((p: any) => ({
        ...p,
        items: Array.isArray(p.items)
          ? p.items
          : p.description
            ? String(p.description)
                .split(",")
                .map((item: string) => item.trim())
                .filter((item: string) => item.length > 0)
            : [],
        duration: p.duration || "4 Years",
        level: p.level || "Bachelor",
        seats: p.seats || 60,
        featured: p.featured || false
      }));
      setPrograms(normalized);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique levels for filter
  const levels = ["all", ...new Set(programs.map(p => p.level).filter(Boolean))];

  // Filter programs
  const filteredPrograms = programs.filter(prog => {
    const matchesLevel = selectedLevel === "all" || prog.level === selectedLevel;
    const matchesSearch = searchTerm === "" || 
      prog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.items?.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  // Featured programs (first 2 or any with featured flag)
  const featuredPrograms = filteredPrograms.filter(p => p.featured).slice(0, 2);
  const regularPrograms = filteredPrograms.filter(p => !p.featured);

  const getLevelBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "bachelor": return "bg-blue-100 text-blue-700";
      case "master": return "bg-blue-100 text-blue-700";
      case "phd": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Academics</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-4">
              Our Programs
            </h1>
            <p className="text-lg text-slate-600">
              Choose from our range of undergraduate and postgraduate programs designed to equip you with the knowledge and skills for today's world.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters Section */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search programs by name or curriculum..."
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
            </motion.div>
            
            {/* Level Filters */}
            {levels.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap justify-center gap-2"
              >
                {levels.map((level) => {
                  const levelValue = level ?? "all";

                  return (
                  <button
                    key={levelValue}
                    onClick={() => setSelectedLevel(levelValue)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedLevel === levelValue
                        ? "bg-gradient-to-r from-primary to-sky-500 text-white shadow-md"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {levelValue === "all" ? "All Programs" : levelValue}
                  </button>
                  );
                })}
              </motion.div>
            )}
            
            {/* Results Count */}
            {!loading && filteredPrograms.length > 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-slate-500"
              >
                {filteredPrograms.length} {filteredPrograms.length === 1 ? "program" : "programs"} available
              </motion.p>
            )}
          </div>

          {/* Featured Programs Section */}
          {featuredPrograms.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <Badge className="bg-amber-100 text-amber-700 mb-3">Featured Programs</Badge>
                <h2 className="text-2xl font-bold text-slate-900">Most Popular Choices</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPrograms.map((prog, idx) => (
                  <motion.div
                    key={prog._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      onClick={() => navigate(`/programs/${prog._id}`)}
                      className="group relative overflow-hidden bg-white border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                      {/* Image */}
                      <div className={`relative w-full h-56 overflow-hidden ${!prog.image ? "bg-gradient-to-br from-slate-100 to-slate-200" : "bg-slate-100"}`}>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Badge className="bg-amber-500 text-white border-0 shadow-sm">Featured</Badge>
                          {prog.level && (
                            <Badge className={cn("border-0 shadow-sm", getLevelBadgeColor(prog.level ?? "all"))}>
                              {prog.level}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors">
                          {prog.title}
                        </h3>

                        {/* Items as tags */}
                        <div className="flex-1 mb-4">
                          <div className="flex flex-wrap gap-1.5">
                            {prog.items && prog.items.length > 0 ? (
                              prog.items.slice(0, 4).map((item: string, i: number) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200/60">
                                  {item}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">Coming soon</span>
                            )}
                            {prog.items && prog.items.length > 4 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-primary bg-primary/5 border border-primary/20">
                                +{prog.items.length - 4}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 pt-4 mt-auto border-t border-slate-100">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {prog.duration}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Users className="w-3 h-3" />
                            {prog.seats} seats
                          </div>
                          <div className="ml-auto">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-xs font-normal">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {prog.items?.length || 0}
                            </Badge>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-4">
                          <Link href="/admissions" onClick={(e) => e.stopPropagation()}>
                            <Button className="w-full bg-gradient-to-r from-primary to-sky-500 text-white hover:from-primary/90 hover:to-sky-500/90 shadow-md group/btn">
                              <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                              Apply
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Programs Grid */}
          {regularPrograms.length > 0 && (
            <div>
              {featuredPrograms.length > 0 && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">All Programs</h2>
                  <p className="text-slate-500 mt-2">Explore our complete range of academic offerings</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <Card key={idx} className="overflow-hidden border-slate-200/60">
                      <Skeleton className="h-48 w-full rounded-none" />
                      <CardContent className="p-5 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <div className="flex gap-1.5 pt-2">
                          <Skeleton className="h-6 w-20 rounded-md" />
                          <Skeleton className="h-6 w-24 rounded-md" />
                          <Skeleton className="h-6 w-16 rounded-md" />
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex gap-2">
                          <Skeleton className="h-8 flex-1" />
                          <Skeleton className="h-8 flex-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredPrograms.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <div className="text-slate-400 mb-3">
                      <BookOpen className="w-16 h-16 mx-auto opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-1">No programs found</h3>
                    <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {regularPrograms.map((prog, idx) => (
                      <motion.div
                        key={prog._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card
                          onClick={() => navigate(`/programs/${prog._id}`)}
                          className="group relative overflow-hidden bg-white border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                        >
                          {/* Image */}
                          <div className={`relative w-full h-48 overflow-hidden ${!prog.image ? "bg-gradient-to-br from-slate-100 to-slate-200" : "bg-slate-100"}`}>
                            {prog.image ? (
                              <img
                                src={`${API_URL}${prog.image}`}
                                alt={prog.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <GraduationCap className="w-14 h-14 text-slate-300" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-3 right-3 flex gap-2">
                              {prog.level && (
                                <Badge className={cn("border-0 shadow-sm", getLevelBadgeColor(prog.level ?? "all"))}>
                                  {prog.level}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <CardContent className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-slate-900 mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {prog.title}
                            </h3>

                            {/* Items as tags */}
                            <div className="flex-1 mb-4">
                              <div className="flex flex-wrap gap-1.5">
                                {prog.items && prog.items.length > 0 ? (
                                  prog.items.slice(0, 4).map((item: string, i: number) => (
                                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200/60">
                                      {item}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Coming soon</span>
                                )}
                                {prog.items && prog.items.length > 4 && (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-primary bg-primary/5 border border-primary/20">
                                    +{prog.items.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-3 pt-4 mt-auto border-t border-slate-100">
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock className="w-3 h-3" />
                                {prog.duration}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Users className="w-3 h-3" />
                                {prog.seats} seats
                              </div>
                              <div className="ml-auto">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-xs font-normal">
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  {prog.items?.length || 0}
                                </Badge>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); navigate(`/programs/${prog._id}`); }}
                                className="flex-1 border-slate-200 hover:border-primary hover:text-primary text-slate-600"
                              >
                                <BookOpen className="w-3.5 h-3.5 mr-1" />
                                Details
                              </Button>
                              <Link href="/admissions" className="flex-1" onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" className="w-full bg-gradient-to-r from-primary to-sky-500 text-white hover:from-primary/90 hover:to-sky-500/90">
                                  <ArrowRight className="w-3.5 h-3.5 mr-1" />
                                  Apply
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
