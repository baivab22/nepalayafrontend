import { useLenis } from "lenis/react";
import ModelImageModal from "@/components/ModelImageModal";
import { PageTransition } from "@/components/PageTransition";
import { Gallery } from "@/components/Gallery";
import { LocationMap } from "@/components/LocationMap";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import FacultyCard from "@/components/FacultyCard";
import ProgramSlider from "@/components/ProgramSlider";
import NewsSlider from "@/components/NewsSlider";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  ArrowRight, BookOpen, Users, Trophy, ChevronRight,
  Microscope, X,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

import { useEffect, useState, useRef } from "react";

const FacultyDetailModal = ({ faculty, open, onClose, getPhotoUrl }: { faculty: any | null; open: boolean; onClose: () => void; getPhotoUrl: (photo: string) => string }) => {
  if (!open || !faculty) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
        >
          <div className="relative h-80 overflow-hidden bg-slate-900 flex items-center justify-center">
            <img
              src={getPhotoUrl(faculty.photo)}
              alt={faculty.name}
              className="w-full h-full object-contain p-4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white shadow-lg hover:bg-black/50 transition-all z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute bottom-6 left-8 right-8 z-10">
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{faculty.name}</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm font-medium text-white/90">{faculty.role}</p>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-white border border-white/20">
                  {faculty.department}
                </span>
              </div>
            </div>
          </div>
          <div className="pb-8 px-8 pt-6">
            <p className="text-slate-600 text-base leading-8 border-l-2 border-primary/20 pl-4">
              {faculty.description}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Department</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{faculty.department}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Role</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{faculty.role}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Expertise</p>
                <p className="mt-2 text-base text-slate-600">Student mentorship, research guidance, curriculum development.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Impact</p>
                <p className="mt-2 text-base text-slate-600">Committed to career-ready instruction and high student engagement.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const getPhotoUrl = (photo: string) => {
  if (!photo) return "";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/api/")) return `${API_URL}${photo}`;
  return `${API_URL}/api/faculty/photo/${photo}`;
};

const FacultySlider = () => {
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);
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
  }, [facultyList]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch(`${API_URL}/api/faculty`);
        const data = await res.json();
        setFacultyList(Array.isArray(data) ? data : data.faculty || []);
      } catch (err) {
        console.error("Error fetching faculty:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  if (loading || facultyList.length === 0) return null;

  const x = -(scrollProgress * scrollRange);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-gradient-to-b from-slate-50 to-white"
    >
      <FacultyDetailModal
        faculty={selectedFaculty}
        open={!!selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
        getPhotoUrl={getPhotoUrl}
      />

      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div>
              <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Faculty</h4>
              <motion.h2
                initial={{ x: -80, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                whileHover={{ x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight"
              >
                Meet Our Faculties
              </motion.h2>
              <p className="text-lg text-slate-600 mt-2">Passionate educators dedicated to shaping the next generation of leaders.</p>
            </div>
            <Link href="/faculty">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-slate-200 hover:border-primary hover:text-primary whitespace-nowrap">
                View All Faculty <ArrowRight className="ml-2 w-4 h-4" />
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
            {facultyList.map((f, idx) => (
              <div
                key={`fac-${idx}`}
                className="                shrink-0 w-[260px] sm:w-[300px] cursor-pointer"
                onClick={() => setSelectedFaculty(f)}
              >
                <FacultyCard faculty={f} getPhotoUrl={getPhotoUrl} tilt />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};



function TypedText({ title, subtitle, slideKey }: { title: string; subtitle: string; slideKey: string | number }) {
  const [titleChars, setTitleChars] = useState("");
  const [subtitleChars, setSubtitleChars] = useState("");
  const [phase, setPhase] = useState<"title" | "subtitle" | "done">("title");

  useEffect(() => {
    setTitleChars("");
    setSubtitleChars("");
    setPhase("title");
  }, [slideKey]);

  useEffect(() => {
    if (phase === "title" && titleChars.length < title.length) {
      const t = setTimeout(() => setTitleChars(title.slice(0, titleChars.length + 1)), 45);
      return () => clearTimeout(t);
    }
    if (phase === "title" && titleChars.length >= title.length) {
      const t = setTimeout(() => setPhase("subtitle"), 500);
      return () => clearTimeout(t);
    }
    return;
  }, [phase, titleChars, title]);

  useEffect(() => {
    if (phase === "subtitle" && subtitleChars.length < subtitle.length) {
      const t = setTimeout(() => setSubtitleChars(subtitle.slice(0, subtitleChars.length + 1)), 35);
      return () => clearTimeout(t);
    }
    if (phase === "subtitle") setPhase("done");
    return;
  }, [phase, subtitleChars, subtitle]);

  return (
    <div>
      <div className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight uppercase">
        {titleChars}
        {phase === "title" && <span className="inline-block w-[3px] h-[0.8em] bg-primary ml-1 align-middle animate-pulse" />}
      </div>
      {phase !== "title" && (
        <div className="text-base md:text-lg text-slate-300 mt-3 font-medium max-w-xl">
          {subtitleChars}
          {phase !== "done" && <span className="inline-block w-[2px] h-[1em] bg-primary/60 ml-0.5 align-middle animate-pulse" />}
        </div>
      )}
    </div>
  );
}


export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 160]);
  const heroContentY = useTransform(scrollY, [0, 700], [0, -40]);
  const smoothHeroY = useSpring(heroY, { stiffness: 80, damping: 25, mass: 0.5 });

  const aboutRef1 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutProgress1 } = useScroll({
    target: aboutRef1,
    offset: ["start end", "end start"],
  });
  const aboutImgY1 = useTransform(aboutProgress1, [0, 1], [100, -100]);
  const smoothAboutImgY1 = useSpring(aboutImgY1, { stiffness: 80, damping: 25, mass: 0.5 });

  const aboutRef2 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutProgress2 } = useScroll({
    target: aboutRef2,
    offset: ["start end", "end start"],
  });
  const aboutImgY2 = useTransform(aboutProgress2, [0, 1], [-100, 100]);
  const smoothAboutImgY2 = useSpring(aboutImgY2, { stiffness: 80, damping: 25, mass: 0.5 });

  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesLoaded, setSlidesLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getSlideMediaUrl = (media: string) => {
    if (!media) return "";
    if (media.startsWith("http://") || media.startsWith("https://")) return media;
    if (media.startsWith("/api/")) return `${API_URL}${media}`;
    return `${API_URL}/api/slider/media/${media}`;
  };

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const res = await fetch(`${API_URL}/api/slider/active`);
        const data = await res.json();
        const list = data?.slides || [];
        setSlides(list);
      } catch {
        setSlides([]);
      } finally {
        setSlidesLoaded(true);
      }
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 6000);
    }
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  return (
    <PageTransition>
      <ModelImageModal />
      {/* HERO CAROUSEL */}
      <section className="relative h-screen overflow-hidden bg-slate-900">
        {slidesLoaded && slides.length === 0 ? (
          <div className="absolute inset-0">
            <div className="absolute inset-0 overflow-hidden">
              <motion.div style={{ y: smoothHeroY }} className="absolute inset-0 will-change-transform">
                <img
                  src={`${import.meta.env.BASE_URL}images/hero-campus.png`}
                  alt=""
                  className="w-full h-full object-cover opacity-40"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent" />
            </div>
            <div className="absolute inset-0 pt-28 sm:pt-32 md:pt-44 px-4 sm:px-8 md:px-16 lg:px-24">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight uppercase">
                  Shaping the Future of Education
                </h1>
                <p className="text-base md:text-lg text-slate-300 mt-3 font-medium">
                  Nepalaya Educational Foundation
                </p>
                <div className="mt-10">
                  <Link href="/admissions">
                    <Button className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 border-0">
                      Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {slides.map((slide, idx) =>
                idx === currentSlide && (
                  <motion.div
                    key={slide._id}
                    initial={{ x: "100%" }}
                    animate={{ x: "0%" }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <motion.div style={{ y: smoothHeroY }} className="absolute inset-0 overflow-hidden will-change-transform">
                      {slide.type === "video" ? (
                        <video
                          src={getSlideMediaUrl(slide.media)}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <motion.img
                          src={getSlideMediaUrl(slide.media)}
                          alt=""
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1.05 }}
                          transition={{ duration: 8, ease: "easeOut" }}
                        />
                      )}
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-slate-900/10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/60" />
                  </motion.div>
                )
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-10"
              >
                <div className="absolute inset-0 pt-28 sm:pt-32 md:pt-44 px-4 sm:px-8 md:px-16 lg:px-24">
                  <div className="max-w-2xl">
                    <TypedText
                      title={slides[currentSlide]?.title || "Shaping the Future of Education"}
                      subtitle={slides[currentSlide]?.subtitle || "Nepalaya Educational Foundation"}
                      slideKey={currentSlide}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-10"
                    >
                      <Link href={slides[currentSlide]?.ctaLink || "/admissions"}>
                        <Button className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 border-0">
                          {slides[currentSlide]?.ctaText || "Apply Now"} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevSlide}
              className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300 opacity-0 md:opacity-100 group"
            >
              <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300 opacity-0 md:opacity-100 group"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() => goToSlide(idx)} className="group relative">
                  <div
                    className={`rounded-full transition-all duration-700 ease-out ${
                      idx === currentSlide
                        ? "w-12 h-2.5 bg-primary shadow-lg shadow-primary/40"
                        : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/5">
              <motion.div
                key={currentSlide}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full bg-primary"
              />
            </div>
          </>
        )}
      </section>

      {/* STATS SECTION */}
      <section className="relative z-30 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Students Enrolled", value: 500, suffix: "+", icon: <Users className="text-primary" /> },
            { label: "Expert Faculty", value: 20, suffix: "+", icon: <BookOpen className="text-amber-500" /> },
            { label: "Academic Programs", value: 5, suffix: "+", icon: <Microscope className="text-emerald-500" /> },
            { label: "Passout rate", value: 98, suffix: "%", icon: <Trophy className="text-rose-500" /> },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 sm:mb-4">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-display font-black text-slate-900 mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
          {/* First Row: Image Left, Text Right */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div ref={aboutRef1} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -m-6 -z-10 transform -rotate-3" />
              <div className="overflow-hidden rounded-3xl">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ y: smoothAboutImgY1 }}
                  src={`${import.meta.env.BASE_URL}images/about-college.png`} 
                  alt="Students in library" 
                  className="w-full rounded-3xl shadow-2xl relative z-10 border border-slate-100 will-change-transform"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 hidden md:block"
              >
                <div className="text-4xl font-black text-primary mb-1">42+</div>
                <div className="text-sm font-semibold text-slate-600 uppercase">Years of<br/>Excellence</div>
              </motion.div>
            </div>

            <div>
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary font-bold uppercase tracking-widest text-sm mb-3"
              >
                About Nepalaya Educational Foundation
              </motion.h4>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight"
              >
         
                Building Futures Since 1984
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 mb-8 leading-relaxed"
              >
                Founded in <strong>1984 A.D.</strong>, Nepalaya Educational Foundation has been a pioneer in delivering quality education in Nepal. Established with the vision of providing globally accepted education within the local community, Nepalaya has grown into one of the country's prominent educational institutions. Through continuous dedication to academic excellence, we are shaping future leaders and creating global opportunities for learners at every stage of their educational journey.
              </motion.p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Established in 1984 A.D.",
                  "Affiliated with Rajarshi Janak University (RJU)",
                  "Four academic buildings with nearly 80 well-organized classrooms",
                  "Committed to equality, diversity, and academic excellence"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center text-slate-700 font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <Link href="/about">
                  <Button size="lg" className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white">
                    Discover Our History
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Second Row: Academic Programs & Learning Opportunities */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary font-bold uppercase tracking-widest text-sm mb-3"
              >
                Academic Programs & Learning Opportunities
              </motion.h4>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight"
              >
                Education for Every Stage of Growth
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 mb-8 leading-relaxed"
              >
                Nepalaya Educational Foundation offers comprehensive educational pathways from <strong>School Level and +2 Programs</strong> to <strong>Bachelor's and Master's Degrees</strong>. Our diverse range of specialized and elective courses is designed to meet the evolving needs of students and prepare them for success in a global environment.
              </motion.p>
              
              <ul className="space-y-4 mb-6">
                {[
                  "School and +2 Level Programs",
                  "Undergraduate Programs: B.Sc. CSIT, BCA, BA, and BALLB* (Proposed)",
                  "Graduate Programs: MBA* (Proposed Expansion Program)",
                  "Student-centered learning with specialized and elective courses"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center text-slate-700 font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>

              {/* <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-sm text-slate-400 italic mb-8"
              >
                Programs marked with an asterisk (*) are proposed programs.
              </motion.p> */}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <Link href="/programs">
                  <Button size="lg" className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white">
                    Explore All Programs
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div ref={aboutRef2} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -m-6 -z-10 transform rotate-3" />
              <div className="overflow-hidden rounded-3xl">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ y: smoothAboutImgY2 }}
                  src={`${import.meta.env.BASE_URL}images/about-college2.png`} 
                  alt="Students in library" 
                  className="w-full rounded-3xl shadow-2xl relative z-10 border border-slate-100 will-change-transform"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 hidden md:block"
              >
                <div className="text-4xl font-black text-primary mb-1">42+</div>
                <div className="text-sm font-semibold text-slate-600 uppercase">Years of<br/>Excellence</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <ProgramSlider />

      {/* GALLERY SECTION */}
      <Gallery />

      {/* FACULTY SECTION */}
      <FacultySlider />

      <NewsSlider />

      {/* LOCATION MAP SECTION */}
      <LocationMap />

      {/* CTA SECTION */}
      {/* <motion.section 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-mesh z-0" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-slate-300 mb-10 font-light">
              Join thousands of successful alumni. Admissions for the 2081/2082 academic session are now open.
            </p>
            <Link href="/admissions">
              <Button size="lg" className="h-16 px-10 text-xl bg-white text-blue-600 hover:bg-slate-100 rounded-full shadow-lg transition-all duration-300">
                Start Application Online
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section> */}
    </PageTransition>
  );
}