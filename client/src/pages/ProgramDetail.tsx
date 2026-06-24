import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import { ArrowLeft, GraduationCap, BookOpen, Clock, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface Program {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProgramDetail() {
  const { id } = useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  const items = program?.description
    ? String(program.description).split(",").map(s => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/api/programs/${id}`)
      .then(res => res.json())
      .then(data => { setProgram(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-slate-50 pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-72 w-full rounded-2xl mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-5 w-1/3 mb-8" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!program) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-700 mb-2">Program not found</h1>
            <p className="text-slate-500 mb-6">The program you're looking for doesn't exist or has been removed.</p>
            <Link href="/programs">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const createdDate = program.createdAt
    ? new Date(program.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <div className={`relative w-full h-72 md:h-96 overflow-hidden ${!program.image ? "bg-gradient-to-br from-slate-200 to-slate-300" : "bg-slate-900"}`}>
          {program.image ? (
            <img
              src={`${API_URL}${program.image}`}
              alt={program.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GraduationCap className="w-24 h-24 text-slate-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
          {/* Back button */}
          <Link href="/programs">
            <Button
              variant="outline"
              size="sm"
              className="mb-6 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
            </Button>
          </Link>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="p-6 md:p-10">
              {/* Title & Meta */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {program.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    {items.length} {items.length === 1 ? "Subject" : "Subjects"}
                  </Badge>
                  {createdDate && (
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <CalendarDays className="w-4 h-4" />
                      {createdDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Curriculum List */}
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Curriculum
                </h2>
                {items.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-700 pt-0.5">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic p-4 bg-slate-50 rounded-xl">No curriculum details available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
