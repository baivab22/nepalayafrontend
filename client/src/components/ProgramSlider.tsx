import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, GraduationCap, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export default function ProgramSlider() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_URL}/api/programs`);
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data.programs || [];
        setPrograms(raw);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading || programs.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div>
            <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Academics</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
              Our Diverse Programs
            </h2>
            <p className="text-lg text-slate-600 mt-2">Choose from a wide array of programs designed to meet global standards.</p>
          </div>
          <Link href="/programs">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-slate-200 hover:border-primary hover:text-primary whitespace-nowrap">
              View All Programs <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {programs.slice(0, 6).map((prog, idx) => {
            const plainText = stripHtml(prog.description || "");
            return (
              <Link key={prog._id || idx} href={`/programs/${prog._id}`} className="block">
                <Card className="group relative overflow-hidden border-slate-200/60 bg-white shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer">
                  <div className={`relative w-full h-52 overflow-hidden ${!prog.image ? "bg-gradient-to-br from-slate-100 to-slate-200" : "bg-slate-100"}`}>
                    {prog.image ? (
                      <img
                        src={`${API_URL}${prog.image}`}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {prog.seats && (
                        <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm border-0 font-medium">
                          <Users className="w-3 h-3 mr-1" />
                          {prog.seats} seats
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {prog.title}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-3 flex-1">
                      {truncate(plainText, 150)}
                    </p>

                    <div className="flex items-center gap-3 pt-3 mt-auto border-t border-slate-100">
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {prog.duration || "N/A"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        {prog.seats ? `${prog.seats} seats` : "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
