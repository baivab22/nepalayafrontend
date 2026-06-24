import { PageTransition } from "@/components/PageTransition";
import { Calendar, ArrowRight, Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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

const categoryGradients: Record<string, string> = {
  event: "from-amber-500 to-orange-600",
  academic: "from-blue-500 to-blue-600",
  alumni: "from-emerald-500 to-teal-600",
  achievement: "from-amber-500 to-orange-600",
  announcement: "from-rose-500 to-pink-600",
};

function getCategoryGradient(category: string): string {
  const key = Object.keys(categoryGradients).find((k) =>
    category.toLowerCase().includes(k)
  );
  return key ? categoryGradients[key] : "from-primary to-blue-700";
}

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
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-400 transition-all"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 8 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 p-2 flex gap-1 z-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(shareLinks(url, title || "")[0].href, "_blank", "noopener,noreferrer");
              setOpen(false);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-[#1877F2]/10 transition-all"
            title="Share on Facebook"
          >
            <FaFacebook className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(shareLinks(url, title || "")[1].href, "_blank", "noopener,noreferrer");
              setOpen(false);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-[#1DA1F2]/10 transition-all"
            title="Share on Twitter"
          >
            <FaTwitter className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(shareLinks(url, title || "")[2].href, "_blank", "noopener,noreferrer");
              setOpen(false);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-[#25D366]/10 transition-all"
            title="Share on WhatsApp"
          >
            <FaWhatsapp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(shareLinks(url, title || "")[3].href, "_blank", "noopener,noreferrer");
              setOpen(false);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-[#0A66C2]/10 transition-all"
            title="Share on LinkedIn"
          >
            <FaLinkedinIn className="w-4 h-4" />
          </button>
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
  <section className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
        News & Events
      </h1>

      <p className="mt-3 text-lg text-slate-600 max-w-2xl">
        Stay informed with the latest announcements, achievements, events,
        and stories from our institution.
      </p>
    </div>
  </section>

  <section className="py-12 md:py-16 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6">

      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-[420px] rounded-3xl" />

          <div className="grid lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[350px] rounded-3xl" />
            ))}
          </div>
        </div>
      ) : newsItems.length === 0 ? (
        <div className="text-center py-24">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />

          <h3 className="text-xl font-semibold text-slate-700">
            No news available
          </h3>

          <p className="text-slate-500 mt-2">
            Check back later for updates.
          </p>
        </div>
      ) : (
        <>
          {/* Featured News */}
          {newsItems[0] && (
            <Link href={`/news/${newsItems[0]._id}`}>
              <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200 mb-14 hover:shadow-xl transition-all duration-300 cursor-pointer">

                <div className="grid lg:grid-cols-2">

                  <div className="h-[320px] lg:h-[500px]">
                    <img
                      src={getImageUrl(newsItems[0].image)}
                      alt={newsItems[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8 lg:p-12 flex flex-col justify-center">

                    <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-5">
                      {newsItems[0].category}
                    </span>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      {formatDisplayDate(newsItems[0].date)}
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-5">
                      {newsItems[0].title}
                    </h2>

                    <p className="text-slate-600 text-lg leading-relaxed line-clamp-4 mb-8">
                      {newsItems[0].description}
                    </p>

                    <div className="inline-flex items-center gap-2 font-medium text-primary">
                      Read Full Story
                      <ArrowRight className="w-4 h-4" />
                    </div>

                  </div>

                </div>

              </div>
            </Link>
          )}

          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Latest Stories
            </h2>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {newsItems.slice(1).map((news, idx) => (
              <Link
                key={news._id || idx}
                href={`/news/${news._id}`}
              >
                <article className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 h-full cursor-pointer">

                  <div className="h-60 bg-slate-100">
                    {news.image ? (
                      <img
                        src={getImageUrl(news.image)}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">

                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 mb-4">
                      {news.category}
                    </span>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      {formatDisplayDate(news.date)}
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 leading-snug mb-3 line-clamp-2">
                      {news.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed line-clamp-3 mb-5">
                      {news.description}
                    </p>

                    <span className="inline-flex items-center gap-2 text-primary font-medium">
                      Read More
                      <ArrowRight className="w-4 h-4" />
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
