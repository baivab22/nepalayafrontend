import ModelImageModal from "@/components/ModelImageModal";
import { PageTransition } from "@/components/PageTransition";
import { Gallery } from "@/components/Gallery";
import { LocationMap } from "@/components/LocationMap";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { 
  ArrowRight, BookOpen, Users, Trophy, ChevronDown,
  Microscope, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const ProgramCard = ({ prog, idx }: { prog: any, idx: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const defaultColors = "from-indigo-500 to-blue-600";
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: idx * 0.15 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          x.set(e.clientX - centerX);
          y.set(e.clientY - centerY);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100 overflow-hidden h-full"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${prog.colors || defaultColors} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${prog.colors || defaultColors} opacity-5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110`} />
        <motion.div 
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.colors || defaultColors} flex items-center justify-center text-white mb-6 shadow-md`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Optionally render icon if available as SVG or emoji */}
          {prog.icon && <span dangerouslySetInnerHTML={{ __html: prog.icon }} />}
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{prog.title}</h3>
        <p className="text-slate-600 mb-8 leading-relaxed relative z-10">{prog.description}</p>
        <Link href="/programs" className={`inline-flex items-center font-bold text-transparent bg-clip-text bg-gradient-to-r ${prog.colors || defaultColors} group-hover:opacity-80 transition-opacity`}>
          Explore Program <ArrowRight className="ml-2 w-4 h-4 text-current stroke-[3]" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

import { useEffect, useState, useRef, useCallback } from "react";
import { faculty } from "@/lib/data";

const FacultyCard = ({ f, idx }: { f: any, idx: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useTransform(x, [-100, 100], [10, -10]);
  const rotateX = useTransform(y, [-100, 100], [-6, 6]);

  return (
    <motion.div
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 w-[300px] h-full flex flex-col items-center text-center"
    >
      <div className="w-28 h-28 rounded-full overflow-hidden mb-4 shadow-lg">
        <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
      <p className="text-sm text-slate-500 mt-1">{f.designation}</p>
      <p className="text-xs text-slate-400 mt-2">{f.department}</p>
      <div className="mt-4 text-sm text-slate-600">{f.education}</div>
    </motion.div>
  );
};

const FacultyDetailModal = ({ faculty, open, onClose }: { faculty: any | null; open: boolean; onClose: () => void }) => {
  if (!open || !faculty) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
        >
          <div className="relative">
            <img src={faculty.image} alt={faculty.name} className="h-80 w-full object-cover" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{faculty.name}</h3>
                <p className="text-sm uppercase tracking-[0.24em] text-primary mt-2">{faculty.designation}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                {faculty.department}
              </div>
            </div>
            <p className="mt-6 text-slate-600 text-base leading-8">
              {faculty.name} brings a wealth of experience in {faculty.department.toLowerCase()} education. With a strong academic background and a student-first approach, they help learners gain practical knowledge and confidence.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Education</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{faculty.education}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Role</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{faculty.designation}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Expertise</p>
                <p className="mt-2 text-base text-slate-700">Student mentorship, research guidance, curriculum development.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Student Impact</p>
                <p className="mt-2 text-base text-slate-700">Committed to career-ready instruction and high student engagement.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const FacultySlider = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const totalSlides = faculty.length;
  // Triple the array for infinite scroll
  const extendedFaculty = [...faculty];
  const middleIndex = totalSlides;

  const scrollToIndex = useCallback((index: number, smooth: boolean = true) => {
    const container = sliderRef.current;
    if (!container) return;

    const items = container.querySelectorAll('.slide-item');
    const targetItem = items[index];
    if (!targetItem) return;

    targetItem.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      inline: 'center',
      block: 'nearest'
    });
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const targetIndex = index + middleIndex;
    setActiveIndex(index);
    scrollToIndex(targetIndex);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [scrollToIndex, middleIndex, isTransitioning]);

  const goNext = useCallback(() => {
    if (isTransitioning) return;
    const nextIndex = (activeIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  }, [activeIndex, totalSlides, goToSlide, isTransitioning]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    const prevIndex = (activeIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
  }, [activeIndex, totalSlides, goToSlide, isTransitioning]);

  const applyTransforms = useCallback(() => {
    const container = sliderRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const items = container.querySelectorAll('.slide-item');

    items.forEach((node) => {
      const card = node.firstElementChild as HTMLElement | null;
      if (!card) return;

      const r = node.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const offset = (cardCenter - centerX) / rect.width;
      
      // Fade out items that are too far
      const absOffset = Math.abs(offset);
      if (absOffset > 0.9) {
        card.style.opacity = '0.2';
        card.style.transform = 'perspective(1200px) translateZ(0px) rotateY(0deg) scale(0.8)';
        card.style.filter = 'drop-shadow(0 8px 16px rgba(15, 23, 42, 0.05))';
        card.style.pointerEvents = 'none';
        return;
      }

      card.style.pointerEvents = 'auto';
      card.style.opacity = '1';
      
      const rotateY = offset * -30;
      const translateZ = Math.max(0, 150 - absOffset * 300);
      const scale = 1 - Math.min(0.15, absOffset * 0.15);
      
      card.style.transform = `perspective(1200px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.transition = 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 500ms ease, opacity 500ms ease';
      
      const isCenter = absOffset < 0.05;
      card.style.filter = isCenter 
        ? 'drop-shadow(0 25px 50px rgba(15, 23, 42, 0.2))'
        : 'drop-shadow(0 10px 20px rgba(15, 23, 42, 0.08))';
    });
  }, []);

  // Handle scroll events and infinite loop
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    let scrollTimeout: number;

    const handleScroll = () => {
      applyTransforms();
      
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        
        // Check if we need to loop
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          // Reached end, jump to beginning of middle set
          const targetIndex = middleIndex;
          const items = container.querySelectorAll('.slide-item');
          const targetItem = items[targetIndex];
          if (targetItem) {
            targetItem.scrollIntoView({ inline: 'center', behavior: 'auto' });
          }
        } else if (scrollLeft <= 10) {
          // Reached beginning, jump to end of middle set
          const targetIndex = middleIndex + totalSlides - 1;
          const items = container.querySelectorAll('.slide-item');
          const targetItem = items[targetIndex];
          if (targetItem) {
            targetItem.scrollIntoView({ inline: 'center', behavior: 'auto' });
          }
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', applyTransforms);

    // Initial setup
    setTimeout(() => {
      applyTransforms();
      const items = container.querySelectorAll('.slide-item');
      const targetItem = items[middleIndex];
      if (targetItem) {
        targetItem.scrollIntoView({ inline: 'center', behavior: 'auto' });
      }
    }, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', applyTransforms);
      clearTimeout(scrollTimeout);
    };
  }, [applyTransforms, middleIndex, totalSlides]);

  // Auto-play with hover pause
  useEffect(() => {
    if (isHovered || isTransitioning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(goNext, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, goNext, isTransitioning]);

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <section 
      className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FacultyDetailModal 
        faculty={selectedFaculty} 
        open={!!selectedFaculty} 
        onClose={() => setSelectedFaculty(null)} 
      />
      

    </section>
  );
};

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function Home() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const headlineWords = ["Shape", "Your", "Future", "at", "Nepal's", "Premier", "Institution."];
  const particles = Array.from({ length: 12 });

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/programs`);
        if (!response.ok) {
          throw new Error(`Failed to load programs: ${response.status}`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : (data?.programs || []);
        setPrograms(list);
      } catch (error) {
        console.error("Error fetching home programs:", error);
        setPrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    };

    loadPrograms();
  }, []);

  return (
    <PageTransition>
      <ModelImageModal />
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden bg-slate-900">
        {/* Animated Orbs/Blobs */}
        <motion.div 
          animate={{ y: [-20, 20] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-[10%] -left-20 w-[30rem] h-[30rem] bg-indigo-500/15 blur-[100px] rounded-full z-0 pointer-events-none"
        />
        <motion.div 
          animate={{ y: [20, -20] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute bottom-[10%] -right-20 w-[35rem] h-[35rem] bg-amber-500/10 blur-[120px] rounded-full z-0 pointer-events-none"
        />
        <motion.div 
          animate={{ x: [-15, 15] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-1/2 right-[20%] w-[25rem] h-[25rem] bg-violet-600/12 blur-[90px] rounded-full z-0 pointer-events-none"
        />

        {/* Floating Particles */}
        {particles.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [Math.random() * -10, Math.random() * -30, Math.random() * -10],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-white z-0 pointer-events-none"
            style={{
              width: Math.random() * 4 + 4,
              height: Math.random() * 4 + 4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-campus.png`} 
            alt="Campus" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 w-full md:w-3/4 opacity-90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeIn} className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
                Est. 1984 AD
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] tracking-tight mb-6 flex flex-wrap gap-x-4">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={word === "Nepal's" || word === "Premier" ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500" : ""}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed font-light">
                Discover world-class education right here in the Kathmandu Valley. We blend rich cultural heritage with cutting-edge academic excellence to create the leaders of tomorrow.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link href="/admissions">
                  <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300">
                    <span className="relative flex items-center">
                      Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/5 hover:bg-white/10 text-white border-white/20 backdrop-blur-md rounded-full">
                    Explore Programs
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bouncing Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 z-20"
        >
          <span className="text-sm font-medium tracking-widest uppercase mb-2">Scroll Down</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className="relative z-30 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Students Enrolled", value: 500, suffix: "+", icon: <Users className="text-primary" /> },
            { label: "Expert Faculty", value: 20, suffix: "+", icon: <BookOpen className="text-amber-500" /> },
            { label: "Academic Programs", value: 5, suffix: "+", icon: <Microscope className="text-emerald-500" /> },
            { label: "Placement Rate", value: 98, suffix: "%", icon: <Trophy className="text-rose-500" /> },
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
        className="py-24 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -m-6 -z-10 transform -rotate-3" />
              <motion.img 
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                src={`${import.meta.env.BASE_URL}images/about-college.png`} 
                alt="Students in library" 
                className="rounded-3xl shadow-2xl relative z-10 border border-slate-100"
              />
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
        </div>
      </motion.section>

      {/* PROGRAMS SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="py-24 bg-slate-50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Academics</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Our Diverse Programs</h2>
            <p className="text-lg text-slate-600">Choose from a wide array of undergraduate and postgraduate programs designed to meet global standards and industry needs.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingPrograms ? (
              <div className="col-span-3 text-center py-12">Loading programs...</div>
            ) : programs.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-400">No programs found.</div>
            ) : programs.map((prog, idx) => (
              <ProgramCard key={prog._id || idx} prog={prog} idx={idx} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/programs">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-slate-200 hover:border-primary hover:text-primary">
                View All {programs.length} Programs
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* GALLERY SECTION */}
      <Gallery />

      {/* FACULTY SECTION */}
      <FacultySlider />

      {/* LOCATION MAP SECTION */}
      <LocationMap />

      {/* CTA SECTION */}
      <motion.section 
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
      </motion.section>
    </PageTransition>
  );
}