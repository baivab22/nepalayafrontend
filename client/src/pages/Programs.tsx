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
  Layers,
  Award,
  Search,
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
  level?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Programs() {
  const [location, navigate] = useLocation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const levelParam = params.get("level");
    if (levelParam && ["+2", "bachelor", "masters"].includes(levelParam)) {
      setSelectedLevel(levelParam);
    }
  }, [location]);

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
        level: p.level || "",
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

  // Filter programs by search term and level
  const filteredPrograms = programs.filter(prog => {
    const matchesSearch = searchTerm === "" || 
      prog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(prog.description).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" || prog.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getDescriptionExcerpt = (html: string, max = 120) => {
    const text = stripHtml(html);
    return truncate(text, max);
  };

  const levelConfigs = [
    { level: "+2", label: "+2", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-500/30", desc: "Higher Secondary Education programs building a strong academic foundation." },
    { level: "bachelor", label: "Bachelor", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-500/30", desc: "Undergraduate degree programs for in-depth knowledge and specialized skills." },
    { level: "masters", label: "Masters", icon: Award, color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-500/30", desc: "Postgraduate programs for advanced expertise and professional mastery." },
  ];

  const programsByLevel: Record<string, Program[]> = {};
  levelConfigs.forEach(({ level }) => { programsByLevel[level] = []; });
  programs.forEach(p => { if (p.level && programsByLevel[p.level]) programsByLevel[p.level].push(p); });

  const searchFilter = (p: Program) =>
    searchTerm === "" ||
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stripHtml(p.description).toLowerCase().includes(searchTerm.toLowerCase());

  const visibleLevels = levelConfigs.filter(lc => selectedLevel === "all" || lc.level === selectedLevel);

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

          {/* Level Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {levelConfigs.map(({ level, label, icon: Icon, color, bg, ring, desc }) => {
              const count = programsByLevel[level]?.length || 0;
              return (
                <motion.button
                  key={level}
                  onClick={() => setSelectedLevel(selectedLevel === level ? "all" : level)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 ${
                    selectedLevel === level
                      ? `${bg} ring-2 ${ring} shadow-lg`
                      : 'bg-white border border-slate-200 hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedLevel === level ? 'bg-white' : bg}`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <span className={`text-3xl font-black ${count > 0 ? color : 'text-slate-300'}`}>
                      {count}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  {count > 0 && (
                    <div className={`mt-4 text-xs font-semibold ${color} flex items-center gap-1`}>
                      <span>{count} program{count !== 1 ? 's' : ''}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={selectedLevel === "all" ? "Search all programs..." : `Search ${selectedLevel === "+2" ? "+2" : selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} programs...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
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
              ))}
            </div>
          ) : /* Programs Organized by Level */
            visibleLevels.length > 0 ? (
              visibleLevels.map(({ level, label, icon: Icon, color, bg }) => {
                const levelPrograms = (programsByLevel[level] || []).filter(searchFilter);
                if (levelPrograms.length === 0 && selectedLevel !== "all") {
                  return (
                    <motion.div
                      key={level}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <div className="text-slate-400 mb-3">
                        <Search className="w-16 h-16 mx-auto opacity-50" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-700 mb-1">No {label.toLowerCase()} programs found</h3>
                      <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
                    </motion.div>
                  );
                }
                if (levelPrograms.length === 0) return null;

                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mb-16 last:mb-0"
                  >
                    {/* Level Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-100">
                      <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-8 h-8 ${color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{label} Programs</h2>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${bg} ${color}`}>
                            {levelPrograms.length} program{levelPrograms.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{levelConfigs.find(lc => lc.level === level)?.desc}</p>
                      </div>
                    </div>

                    {/* Program Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      <AnimatePresence mode="popLayout">
                        {levelPrograms.map((prog, idx) => (
                          <motion.div
                            key={prog._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.04 }}
                          >
                            <Card
                              onClick={() => navigate(`/programs/${prog._id}`)}
                              className="group relative overflow-hidden bg-white border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                            >
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
                                    <Icon className={`w-14 h-14 ${color} opacity-40`} />
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
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-slate-400 mb-3">
                  <BookOpen className="w-16 h-16 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-1">No programs found</h3>
                <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
              </motion.div>
            )}
        </div>
      </div>
    </PageTransition>
  );
}
