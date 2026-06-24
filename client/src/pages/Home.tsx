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
                className="shrink-0 w-[300px] cursor-pointer"
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
          <div className="absolute inset-0 flex items-center justify-center">
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
            <motion.div style={{ y: heroContentY }} className="relative z-20 text-center px-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
                Est. 1984 AD
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-6">
                Nepalaya Educational Foundation
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Discover world-class education right here in the Kathmandu Valley.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admissions">
                  <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg shadow-slate-900/25">
                    Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/5 hover:bg-white/10 text-white border-white/20 backdrop-blur-md rounded-full">
                    Explore Programs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {slides.map((slide, idx) =>
                idx === currentSlide && (
                  <motion.div
                    key={slide._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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

            {/* <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="absolute bottom-32 md:bottom-40 left-0 right-0 z-10 text-center px-4"
            >
              <div className="max-w-7xl mx-auto">
                <motion.div
                  key={`est-${currentSlide}`}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-sm font-semibold"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
                  Est. 1984 AD
                </motion.div>
              </div>
            </motion.div> */}

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
              className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-display font-black text-slate-900 mb-1">
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
                <div className="text-4xl font-black text-primary mb-1">50+</div>
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
                A Legacy of Learning in the <span className="text-gradient">Heart of Nepal</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 mb-8 leading-relaxed"
              >
                Founded in 1984 AD, Nepalaya Educational Foundation stands as a beacon of academic excellence. We are committed to nurturing intellectual curiosity and producing graduates who lead with integrity.
              </motion.p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Affiliated with Tribhuvan University",
                  "State-of-the-art research laboratories",
                  "Global exchange programs",
                  "Comprehensive scholarship schemes"
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

          {/* Second Row: Swapped Order, Text Left, Image Right, No Header */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight"
              >
                A Legacy of Learning in the <span className="text-gradient">Heart of Nepal</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 mb-8 leading-relaxed"
              >
                Founded in 1984 AD, Nepalaya Educational Foundation stands as a beacon of academic excellence. We are committed to nurturing intellectual curiosity and producing graduates who lead with integrity.
              </motion.p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Affiliated with Tribhuvan University",
                  "State-of-the-art research laboratories",
                  "Global exchange programs",
                  "Comprehensive scholarship schemes"
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

            <div ref={aboutRef2} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -m-6 -z-10 transform rotate-3" />
              <div className="overflow-hidden rounded-3xl">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ y: smoothAboutImgY2 }}
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
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 hidden md:block"
              >
                <div className="text-4xl font-black text-primary mb-1">50+</div>
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