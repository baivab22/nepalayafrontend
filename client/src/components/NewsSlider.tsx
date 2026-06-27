import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Share2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

const getImageUrl = (image?: string) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/api/")) return `${API_URL}${image}`;
  return `${API_URL}/api/news/image/${image}`;
};

const formatDisplayDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  } catch {
    return dateString;
  }
};

export default function NewsSlider() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleShare = async (e: React.MouseEvent, id?: string, title?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    const shareUrl = `${window.location.origin}/news/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: title || "Nepalaya News", url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        await navigator.clipboard.writeText(shareUrl);
      }
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/news`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.news || [];
        setNewsList(list);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading || newsList.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div>
            <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Updates</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
              Latest News & Events
            </h2>
            <p className="text-lg text-slate-600 mt-2">Stay informed with the latest updates and key events from our campus.</p>
          </div>
          <Link href="/news">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-slate-200 hover:border-primary hover:text-primary whitespace-nowrap">
              View All News <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {newsList.map((item, idx) => (
            <Link key={item._id || idx} href={`/news/${item._id}`}>
              <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 h-full cursor-pointer hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-800 shadow-sm border border-slate-200/50">
                      {item.category || "News"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      {formatDisplayDate(item.date)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleShare(e, item._id, item.title)}
                    className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-primary shadow-sm transition-all duration-300 border border-slate-200/50"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors font-display leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-2 font-sans">
                    {stripHtml(item.description)}
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
          ))}
        </div>
      </div>
    </section>
  );
}
