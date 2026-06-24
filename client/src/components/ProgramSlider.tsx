import { useLenis } from "lenis/react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Clock, Users } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function ProgramSlider() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollRange, setScrollRange] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLenis(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewH = window.innerHeight;
    const sectionH = rect.height;
    const total = sectionH - viewH;
    if (total <= 0) return;
    setScrollProgress(Math.max(0, Math.min(1, -rect.top / total)));
  });

  useEffect(() => {
    const updateRange = () => {
      if (trackRef.current && containerRef.current) {
        const trackW = trackRef.current.scrollWidth;
        const containerW = containerRef.current.clientWidth;
        setScrollRange(Math.max(0, trackW - containerW));
      }
    };
    updateRange();
    window.addEventListener("resize", updateRange);
    return () => window.removeEventListener("resize", updateRange);
  }, [programs]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_URL}/api/programs`);
        const data = await res.json();
        setPrograms(Array.isArray(data) ? data : data.programs || []);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading || programs.length === 0) return null;

  const x = -(scrollProgress * scrollRange);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-gradient-to-b from-white to-slate-50"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0">
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
        </div>

        <div ref={containerRef} className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex gap-4 px-4 sm:px-6 lg:px-8"
            style={{ x: scrollRange > 0 ? x : 0 }}
          >
            {programs.map((prog, idx) => (
              <Link key={prog._id || idx} href={`/programs/${prog._id}`} className="shrink-0 w-[340px]">
                <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 h-full cursor-pointer hover:-translate-y-1">
                  <div className={`relative h-44 overflow-hidden ${!prog.image ? "bg-gradient-to-br from-slate-100 to-slate-200" : "bg-slate-100"}`}>
                    {prog.image ? (
                      <img
                        src={`${API_URL}${prog.image}`}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm">
                        {prog.level || "Bachelor"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {prog.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {prog.duration || "4 Years"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {prog.seats || 60} seats
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
