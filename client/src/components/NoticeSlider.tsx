import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const API_URL = "https://nepalaya-apis.onrender.com";

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
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

export default function NoticeSlider() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notice`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.notices || [];
        setNotices(list);
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading || notices.length === 0) return null;

  const displayNotices = notices.slice(0, 3);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div>
            <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Notice Board</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
              Official Notices
            </h2>
            <p className="text-lg text-slate-600 mt-2">Important announcements, exam schedules, and official updates.</p>
          </div>
          <Link href="/notices">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-slate-200 hover:border-primary hover:text-primary whitespace-nowrap">
              View All Notices <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayNotices.map((item, idx) => (
            <Link key={item._id || idx} href={`/notices/${item._id}`}>
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
                      <Megaphone className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-800 shadow-sm border border-slate-200/50">
                      {item.category || "Notice"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      {formatDisplayDate(item.date)}
                    </span>
                  </div>
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
