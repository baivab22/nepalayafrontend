import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, MapPin, Phone, Mail, ChevronRight, ChevronDown, ArrowUp, Facebook, Instagram, Youtube, Home, Info, BookOpen, Newspaper, Users, Menu, X, Search, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { SearchModal } from "@/components/SearchModal";

interface Program {
  _id: string;
  title: string;
  items: string[];
  level?: string;
  duration?: string;
  image?: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [programsDropdown, setProgramsDropdown] = useState<Program[]>([]);
  const [progDropdownOpen, setProgDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);
  const progRef = useRef<HTMLDivElement>(null);
  const progTimeout = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [location, lenis]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowTopBtn(window.scrollY > 400);
      setTopBarVisible(window.scrollY < 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/programs`)
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data?.programs || [];
        setProgramsDropdown(raw);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToTop = () => lenis?.scrollTo(0, { duration: 0.8 });

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Programs", path: "/programs", icon: BookOpen, hasDropdown: true },
    { name: "Faculty", path: "/faculty", icon: Users },
    { name: "News", path: "/news", icon: Newspaper },
    { name: "Notices", path: "/notices", icon: Megaphone },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  const bottomNavItems = navLinks.map(({ name, path, icon }) => ({ name, path, icon }));

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Top Header Bar */}
      <div
        className={`hidden md:flex items-center justify-between bg-slate-900 text-white text-sm font-semibold transition-all duration-500 ${
          topBarVisible ? "h-12 opacity-100" : "h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-[auto_1fr_auto] items-center whitespace-nowrap">
          <div className="flex items-center gap-5">
            <a href="tel:+9779761522442" className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +977-9761522442
            </a>
            <span className="w-px h-4 bg-slate-700" />
            <a href="mailto:info@nepalayaedufoundation.edu.np" className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
              info@nepalayaedufoundation.edu.np
            </a>
          </div>

          <div className="flex justify-center px-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all w-full max-w-xl"
              aria-label="Search"
            >
              <Search className="w-4 h-4" strokeWidth={2.5} />
              <span>Search programs, news, faculty...</span>
              <kbd className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/10 rounded border border-white/10">
                <span>⌘</span>K
              </kbd>
            </button>
          </div>

          <div className="flex justify-end items-center gap-1">
            <a href="https://www.facebook.com/profile.php?id=61584645043722" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Facebook">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.instagram.com/nepalayaedu/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Instagram">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.youtube.com/@nepalayaedu" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="YouTube">
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Top Header Bar - Mobile */}
      <div className="md:hidden bg-slate-900 text-white">
        <div className="flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-2">
            <a href="tel:+9779761522442" className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white transition-colors">
              <Phone className="w-2.5 h-2.5" />
              +977-9761522442
            </a>
            <span className="w-px h-2 bg-slate-700" />
            <a href="mailto:info@nepalayaedufoundation.edu.np" className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white transition-colors">
              <Mail className="w-2.5 h-2.5" />
              Email
            </a>
          </div>
          <div className="flex items-center gap-1">
            <a href="https://www.facebook.com/profile.php?id=61584645043722" target="_blank" rel="noopener noreferrer" className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <Facebook className="w-2.5 h-2.5" />
            </a>
            <a href="https://www.instagram.com/nepalayaedu/" target="_blank" rel="noopener noreferrer" className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <Instagram className="w-2.5 h-2.5" />
            </a>
            <a href="https://www.youtube.com/@nepalayaedu" target="_blank" rel="noopener noreferrer" className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <Youtube className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled ? "bg-white/90 backdrop-blur-lg shadow-sm" : "bg-white/60 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0 group border-0 outline-none">
            <img
              src="/images/nepalayalogo.png"
              alt="Nepalaya Logo"
              className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform duration-500 group-hover:scale-110 border-0 outline-none"
            />
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.path;
                return (
                  <div key={link.path} className="relative">
                    <Link href={link.path}>
                      <span
                        onMouseEnter={() => {
                          if (link.hasDropdown) {
                            window.clearTimeout(progTimeout.current);
                            setProgDropdownOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (link.hasDropdown) {
                            window.clearTimeout(progTimeout.current);
                            progTimeout.current = window.setTimeout(() => setProgDropdownOpen(false), 200);
                          }
                        }}
                        className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none ${
                          isActive
                            ? "text-white"
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute inset-0 bg-primary rounded-xl" />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          <Icon className="w-4 h-4" strokeWidth={2.5} />
                          {link.name}
                          {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />}
                        </span>
                      </span>
                    </Link>

                    {link.hasDropdown && progDropdownOpen && programsDropdown.length > 0 && (
                      <div
                        ref={progRef}
                        onMouseEnter={() => { window.clearTimeout(progTimeout.current); setProgDropdownOpen(true); }}
                        onMouseLeave={() => { progTimeout.current = window.setTimeout(() => setProgDropdownOpen(false), 200); }}
                        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-2"
                      >
                        <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          All Programs
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {programsDropdown.map((p) => (
                            <Link key={p._id} href={`/programs/${p._id}`}>
                              <span className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-primary transition-colors cursor-pointer">
                                <BookOpen className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={2} />
                                <span className="truncate">{p.title}</span>
                                {p.level && (
                                  <span className="ml-auto text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                                    {p.level}
                                  </span>
                                )}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>


          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full relative pb-28 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-[2%] left-4 right-4 z-50 bg-white/90 backdrop-blur-lg border border-slate-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl min-w-0 flex-1 transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  isActive ? "bg-primary/10" : ""
                }`}>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavPill"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary" : ""}`} strokeWidth={2.5} />
                </div>
                <span className={`text-[10px] font-medium leading-none ${isActive ? "text-primary font-semibold" : "text-slate-400"}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
          <Link
            href="/admissions"
            className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl min-w-0 flex-1"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/25">
              <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-semibold text-slate-900 leading-none">Apply</span>
          </Link>
        </div>
      </nav>

      <footer className="bg-[#0F172A] text-slate-300 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
            <div className="space-y-5">
              <img src="/images/nepalayalogo.png" alt="Nepalaya Logo" className="w-24 h-24 object-contain" />
              <p className="text-sm text-slate-400 leading-relaxed">
                Nepal's premier educational institution, blending rich cultural heritage with cutting-edge academic excellence since 1984 AD.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://www.facebook.com/profile.php?id=61584645043722" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Facebook className="w-4 h-4" strokeWidth={2.5} />
                </a>
                <a href="https://www.instagram.com/nepalayaedu/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all">
                  <Instagram className="w-4 h-4" strokeWidth={2.5} />
                </a>
                <a href="https://www.youtube.com/@nepalayaedu" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all">
                  <Youtube className="w-4 h-4" strokeWidth={2.5} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">Quick Links</h4>
              <ul className="space-y-3.5">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link href={link.path} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-primary" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">Programs</h4>
              <ul className="space-y-3.5">
                {programsDropdown.length === 0 ? (
                  <li className="text-sm text-slate-500">Loading programs...</li>
                ) : (
                  programsDropdown.slice(0, 6).map((p) => (
                    <li key={p._id}>
                      <Link href="/programs" className="text-sm text-slate-400 hover:text-white transition-colors">
                        {p.title}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Kalanki 14, Kathmandu 44600, Nepal</span>
                </li>
                <li>
                  <a href="tel:+9779761522442" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
                    <span>+977-9761522442</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@nepalayaedufoundation.edu.np" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
                    <span>info@nepalayaedufoundation.edu.np</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="w-4 h-4 shrink-0 mt-0.5">🕒</span>
                  <span>Sun–Fri 6:00 AM – 5:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Nepalaya Educational Foundation. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-[300px] bg-white shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
                <img src="/images/nepalayalogo.png" alt="Nepalaya" className="w-14 h-14 object-contain" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location === link.path;
                  return (
                    <Link key={link.path} href={link.path}>
                      <span
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2} />
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <Link href="/admissions" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full h-12 text-sm font-semibold shadow-lg shadow-slate-900/20">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </nav>
              <div className="px-5 py-5 border-t border-slate-100 space-y-4">
                <a href="tel:+9779761522442" className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  +977-9761522442
                </a>
                <div className="flex items-center gap-2">
                  <a href="https://www.facebook.com/profile.php?id=61584645043722" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-all">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/nepalayaedu/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-pink-100 hover:text-pink-600 transition-all">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://www.youtube.com/@nepalayaedu" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-100 hover:text-red-600 transition-all">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Floating Apply Now Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-8 left-8 z-50 hidden md:block"
          >
            <Link href="/admissions">
              <Button className="h-12 px-5 text-sm font-bold bg-black hover:bg-slate-800 text-white rounded-full border-0 shadow-xl shadow-black/20 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Apply Now
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to top button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-xl hidden md:flex items-center justify-center hover:bg-primary/90 hover:-translate-y-1 transition-all z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
