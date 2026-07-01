
import { PageTransition } from "@/components/PageTransition";
import { Calendar, ArrowRight, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Link } from "wouter";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";

const API_URL = "https://nepalaya-apis.onrender.com";

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

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

const shareLinks = (url: string, title: string) => [
  {
    name: "Facebook",
    icon: FaFacebook,
    color: "hover:text-[#1877F2]",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    color: "hover:text-[#1DA1F2]",
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    color: "hover:text-[#25D366]",
    href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    color: "hover:text-[#0A66C2]",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

function SharePopover({ newsId, title }: { newsId?: string; title?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const url = `${window.location.origin}/news/${newsId}`;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-400 transition-all active:scale-95 touch-manipulation"
        title="Share"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full right-0 mt-2 sm:bottom-full sm:right-0 sm:mb-2 sm:mt-0 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 p-2 flex gap-1 z-50 min-w-[160px] sm:min-w-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {shareLinks(url, title || "").map((link, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(link.href, "_blank", "noopener,noreferrer");
                setOpen(false);
              }}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all active:scale-95 touch-manipulation"
              title={`Share on ${link.name}`}
              aria-label={`Share on ${link.name}`}
            >
              <link.icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 break-words">
            News &amp; Events
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl break-words">
            Stay informed with the latest announcements, achievements, events,
            and stories from our institution.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-14 xl:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-6 sm:space-y-8">
              <Skeleton className="h-[200px] sm:h-[280px] md:h-[360px] lg:h-[420px] rounded-xl sm:rounded-2xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[260px] sm:h-[300px] md:h-[340px] rounded-xl sm:rounded-2xl" />
                ))}
              </div>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 break-words">
                No news available
              </h3>
              <p className="text-sm sm:text-base text-slate-500 mt-2 break-words">
                Check back later for updates.
              </p>
            </div>
          ) : (
            <>
              {/* Featured News */}
              {newsItems[0] && (
                <Link href={`/news/${newsItems[0]._id}`}>
                  <div className="group bg-white rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 mb-6 sm:mb-8 md:mb-10 lg:mb-14 hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.99] sm:active:scale-100">
                    <div className="grid md:grid-cols-2">
                      {/* Image */}
                      <div className="h-48 sm:h-56 md:h-[380px] lg:h-[450px] xl:h-[500px] bg-slate-100">
                        <img
                          src={getImageUrl(newsItems[0].image)}
                          alt={newsItems[0].title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
                        <span className="inline-flex w-fit px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3 sm:mb-4 break-words">
                          {newsItems[0].category}
                        </span>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          <span className="break-words">{formatDisplayDate(newsItems[0].date)}</span>
                        </div>

                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 leading-tight mb-3 sm:mb-4 break-words">
                          {newsItems[0].title}
                        </h2>

                        <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed mb-4 sm:mb-6 break-words line-clamp-5">
                          {stripHtml(newsItems[0].description)}
                        </p>

                        <div className="inline-flex items-center gap-2 font-semibold text-primary py-2 -my-2 text-sm sm:text-base">
                          Read Full Story
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Section Title */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 break-words">
                  Latest Stories
                </h2>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {newsItems.slice(1).map((news, idx) => (
                  <Link
                    key={news._id || idx}
                    href={`/news/${news._id}`}
                  >
                    <article className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 h-full cursor-pointer active:scale-[0.98] sm:active:scale-100 flex flex-col">
                      {/* Image */}
                      <div className="h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 bg-slate-100 flex-shrink-0">
                        {news.image ? (
                          <img
                            src={getImageUrl(news.image)}
                            alt={news.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                        <span className="inline-flex w-fit px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-slate-100 text-slate-700 mb-2 sm:mb-3 break-words">
                          {news.category}
                        </span>

                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2.5">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          <span className="break-words">{formatDisplayDate(news.date)}</span>
                        </div>

                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug mb-2 break-words">
                          {news.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 sm:mb-4 flex-1 break-words line-clamp-4">
                          {stripHtml(news.description)}
                        </p>

                        <span className="inline-flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm py-1 -my-1">
                          Read More
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
