import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import { ArrowLeft, Calendar, Clock, Bookmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedinIn, FaLink } from "react-icons/fa";

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

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/api/news/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("News not found");
        return res.json();
      })
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news item:", err);
        setLoading(false);
      });
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({ title: "Link Copied!", description: "News link copied to your clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed Bookmark" : "Bookmarked!",
      description: isBookmarked ? "Item removed from your reading list." : "News item saved to your reading list.",
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white pt-20 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-[420px] w-full rounded-2xl" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!news) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white flex items-center justify-center pt-20 pb-16 px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-800">Article Not Found</h2>
            <p className="text-slate-500">This article may have been removed or doesn't exist.</p>
            <Link href="/news">
              <Button className="mt-2 bg-primary text-white hover:bg-primary/95 rounded-full px-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events & News
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const shareUrl = window.location.href;

  return (
    <PageTransition>
      <article className="min-h-screen bg-white pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Link href="/news">
            <Button
              variant="ghost"
              className="mb-8 text-slate-500 hover:text-primary hover:bg-slate-50 -ml-3 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events & News
            </Button>
          </Link>

          {/* Category & Meta Row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`inline-block text-[10px] font-bold tracking-wider uppercase text-white px-3 py-1.5 rounded-md bg-gradient-to-r ${getCategoryGradient(news.category)}`}
            >
              {news.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDisplayDate(news.date)}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              3 min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            {news.title}
          </h1>

          {/* Author Row */}
          <div className="flex items-center gap-3 pb-6 mb-8 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              NA
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Nepalaya Admin</p>
              <p className="text-xs text-slate-400">Publisher</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                  isBookmarked
                    ? "bg-amber-50 text-amber-600"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {news.image && (
            <div className="w-full rounded-2xl overflow-hidden bg-slate-100 mb-10 shadow-sm">
              <img
                src={getImageUrl(news.image)}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="max-w-3xl">
            <div className="prose prose-slate max-w-none break-words overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_code]:break-words [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:overflow-x-auto [&_table]:block">
              <div dangerouslySetInnerHTML={{ __html: news.description }} />
            </div>
          </div>

          {/* Tags */}
          <div className="max-w-3xl flex flex-wrap gap-2 pt-8 mt-10 border-t border-slate-100">
            {(() => {
              const normalized = news.category.toLowerCase();
              let tags: string[];
              if (normalized.includes("event")) tags = ["campus", "event", "education", "gathering", "nepalaya", "inspirations"];
              else if (normalized.includes("academic") || normalized.includes("study")) tags = ["academic", "study", "learning", "research", "nepalaya", "higher education"];
              else if (normalized.includes("alumni")) tags = ["alumni", "achievement", "community", "scholarship", "beyond experiences", "success"];
              else tags = ["news", "nepalaya", "updates", "announcement", "blog", "retreat"];
              return tags;
            })().map((tag, i) => (
              <span
                key={i}
                className="bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 text-xs px-3 py-1.5 rounded-full cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Share */}
          <div className="max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-8 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Share this article</p>
            <div className="flex items-center gap-2">
              {[
                { icon: FaFacebook, color: "bg-[#1877F2] hover:bg-[#1877F2]/90", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                { icon: FaTwitter, color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}` },
                { icon: FaWhatsapp, color: "bg-[#25D366] hover:bg-[#25D366]/90", href: `https://wa.me/?text=${encodeURIComponent(news.title + " " + shareUrl)}` },
                { icon: FaLinkedinIn, color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white transition-all ${s.color} shadow-sm hover:shadow-md hover:-translate-y-0.5`}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
              <button
                onClick={copyLink}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <FaLink className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
