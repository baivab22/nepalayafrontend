import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import { ArrowLeft, GraduationCap, Clock, Users, CalendarDays } from "lucide-react";
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
  duration?: string;
  seats?: number;
  level?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProgramDetail() {
  const { id } = useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen bg-slate-50 pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-72 w-full rounded-2xl mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex gap-3 mb-8">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!program) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-slate-50 pt-20 pb-12 flex items-center justify-center">
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

        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
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
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60">
            <div className="p-6 md:p-10">
              {/* Title & Meta */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {program.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {program.level && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 capitalize gap-1.5">
                      {program.level}
                    </Badge>
                  )}
                  {program.duration && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {program.duration}
                    </Badge>
                  )}
                  {program.seats && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {program.seats} seats
                    </Badge>
                  )}
                  {createdDate && (
                    <span className="flex items-center gap-1.5 text-sm text-slate-400 ml-auto">
                      <CalendarDays className="w-4 h-4" />
                      {createdDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Description rendered as HTML */}
              {program.description ? (
                <div className="prose prose-slate max-w-none break-words overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_code]:break-words [&_img]:max-w-full [&_img]:h-auto">
                  <div dangerouslySetInnerHTML={{ __html: program.description }} />
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic p-4 bg-slate-50 rounded-xl">No description available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
