import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import { ArrowLeft, Calendar, Megaphone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const API_URL = "https://nepalaya-apis.onrender.com";

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

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/api/notice/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Notice not found");
        return res.json();
      })
      .then((data) => {
        setNotice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notice:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!notice) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white flex items-center justify-center pt-20 pb-16 px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <Megaphone className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Notice Not Found</h2>
            <p className="text-slate-500">This notice may have been removed or doesn't exist.</p>
            <Link href="/notices">
              <Button className="mt-2 bg-primary text-white hover:bg-primary/95 rounded-full px-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notices
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const imageUrl = getImageUrl(notice.image);

  return (
    <PageTransition>
      <article className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/notices">
            <Button
              variant="ghost"
              className="mb-6 text-slate-500 hover:text-primary hover:bg-slate-50 -ml-3 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notices
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyle(notice.category)}`}>
              {notice.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDisplayDate(notice.date)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            {notice.title}
          </h1>

          {imageUrl && (
            <div className="w-full rounded-2xl overflow-hidden bg-slate-100 mb-10 shadow-sm">
              <img
                src={imageUrl}
                alt={notice.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="max-w-3xl">
            <div className="prose prose-slate max-w-none break-words overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_code]:break-words [&_img]:max-w-full [&_img]:h-auto">
              <div dangerouslySetInnerHTML={{ __html: notice.description }} />
            </div>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
