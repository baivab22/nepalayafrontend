import { PageTransition } from "@/components/PageTransition";
import { Calendar, Megaphone, ArrowRight, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "wouter";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

interface NoticeItem {
  _id?: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  order?: number;
}

const getImageUrl = (image?: string) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/api/")) return `${API_URL}${image}`;
  return `${API_URL}/api/notice/image/${image}`;
};

const formatDisplayDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  } catch {
    return dateString;
  }
};

const categoryColors: Record<string, string> = {
  "Exam Notice": "bg-amber-100 text-amber-800 border-amber-200",
  "Admission Notice": "bg-blue-100 text-blue-800 border-blue-200",
  "Holiday Notice": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Result Notice": "bg-purple-100 text-purple-800 border-purple-200",
  "Scholarship Notice": "bg-rose-100 text-rose-800 border-rose-200",
  "Meeting Notice": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Tender Notice": "bg-slate-100 text-slate-800 border-slate-200",
  "Important Announcement": "bg-red-100 text-red-800 border-red-200",
  "Event Notice": "bg-indigo-100 text-indigo-800 border-indigo-200",
};

function getCategoryStyle(category: string): string {
  return categoryColors[category] || "bg-slate-100 text-slate-800 border-slate-200";
}

export default function Notice() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/notice`)
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.notices || []);
        setNotices(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notices:", err);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(
    new Set(notices.map((n) => n.category))
  ).sort();

  const filtered =
    activeFilter === "all"
      ? notices
      : notices.filter((n) => n.category === activeFilter);

  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Notices
              </h1>
              <p className="mt-1 text-base sm:text-lg text-slate-600">
                Official notices, exam schedules, results, and important announcements
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-24">
              <Megaphone className="w-14 h-14 text-slate-300 mx-auto mb-5" />
              <h3 className="text-xl font-semibold text-slate-700">No notices available</h3>
              <p className="text-slate-500 mt-2">Check back later for updates and announcements.</p>
            </div>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      activeFilter === "all"
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                    }`}
                  >
                    All Notices
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        activeFilter === cat
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((notice, idx) => {
                  const imageUrl = getImageUrl(notice.image);
                  return (
                    <motion.div
                      key={notice._id || idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link href={`/notices/${notice._id}`}>
                        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 h-full cursor-pointer hover:-translate-y-1">
                          <div className="relative h-48 overflow-hidden bg-slate-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={notice.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
                                <Megaphone className="w-8 h-8" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm shadow-sm border border-slate-200/50 ${getCategoryStyle(notice.category)}`}>
                                {notice.category || "Notice"}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                                <Calendar className="w-3 h-3" />
                                {formatDisplayDate(notice.date)}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors font-display leading-snug line-clamp-2">
                              {notice.title}
                            </h3>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-2 font-sans">
                              {stripHtml(notice.description)}
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-primary font-semibold text-sm inline-flex items-center group-hover:gap-2 transition-all duration-300">
                                Read more
                                <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {filtered.length === 0 && activeFilter !== "all" && (
                <div className="text-center py-16">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">No {activeFilter.toLowerCase()} notices</h3>
                  <p className="text-slate-500 mt-1">There are currently no notices in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
