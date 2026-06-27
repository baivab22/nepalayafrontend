import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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
  image?: string;
  duration?: string;
  seats?: number;
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
      const normalized: Program[] = raw.map((p: any) => ({
        _id: p._id,
        title: p.title,
        description: p.description || "",
        image: p.image,
        duration: p.duration || "",
        seats: p.seats,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      setPrograms(normalized);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter programs by search term
  const filteredPrograms = programs.filter(prog => {
    const matchesSearch = searchTerm === "" || 
      prog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(prog.description).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getDescriptionExcerpt = (html: string, max = 120) => {
    const text = stripHtml(html);
    return truncate(text, max);
  };

  return (
    <PageTransition>
      <div className="pt-16 pb-4">
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
          
          {/* Search Section */}
          <div className="mb-12 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search programs by name or description..."
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

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="overflow-hidden border-slate-200/60">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
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
                <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredPrograms.map((prog, idx) => (
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
                          {prog.duration && (
                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 border-0 shadow-sm">
                              <Clock className="w-3 h-3 mr-1" />
                              {prog.duration}
                            </Badge>
                          )}
                          {prog.seats && (
                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 border-0 shadow-sm">
                              <Users className="w-3 h-3 mr-1" />
                              {prog.seats}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {prog.title}
                        </h3>

                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                          {getDescriptionExcerpt(prog.description, 150)}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-3 pt-4 mt-auto border-t border-slate-100">
                          {prog.duration && (
                            <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              {prog.duration}
                            </div>
                          )}
                          {prog.seats && (
                            <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                              <Users className="w-3.5 h-3.5" />
                              {prog.seats} seats
                            </div>
                          )}
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
      </div>
    </PageTransition>
  );
}
