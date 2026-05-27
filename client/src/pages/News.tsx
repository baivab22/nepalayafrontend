import { PageTransition } from "@/components/PageTransition";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface NewsItem {
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

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.news || []);
        setNewsItems(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-display font-black text-white mb-6"
          >
            News & Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-slate-300 max-w-2xl mx-auto font-light"
          >
            Stay updated with the latest happenings, achievements, and events from our vibrant campus.
          </motion.p>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Latest Updates</h2>
              <p className="text-sm text-slate-500 mt-1">
                Browse recent announcements, events, and achievements from our campus.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-80 rounded-2xl" />
              ))
            ) : newsItems.length === 0 ? (
              <div className="col-span-full text-center text-slate-500">No news found.</div>
            ) : (
              newsItems.map((news, idx) => (
                <motion.div 
                  key={news._id || idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="group cursor-pointer h-full"
                  onClick={() => setSelected(news)}
                >
                  <div className="bg-white rounded-2xl p-6 h-full flex flex-col border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                    <div className="h-44 rounded-xl bg-slate-100 mb-5 overflow-hidden">
                      {news.image ? (
                        <img
                          src={getImageUrl(news.image)}
                          alt={news.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                          Image coming soon
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {news.category}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> {formatDisplayDate(news.date)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors font-display leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed flex-grow line-clamp-3">
                      {news.description}
                    </p>
                    <span className="text-primary font-medium inline-flex items-center group-hover:underline">
                      Read full story <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              {selected.image && (
                <div className="w-full h-64 rounded-xl overflow-hidden mb-5 bg-slate-100">
                  <img
                    src={getImageUrl(selected.image)}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                    {selected.category}
                  </span>
                  <span className="text-sm text-slate-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDisplayDate(selected.date)}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 border-t pt-4">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selected.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}