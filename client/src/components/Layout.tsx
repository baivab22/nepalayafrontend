import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, MapPin, Phone, Mail, ChevronRight, ArrowUp, Facebook, Instagram, Youtube, Home, Info, BookOpen, Newspaper, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Programs", path: "/programs", icon: BookOpen },
    { name: "Faculty", path: "/faculty", icon: Users },
    { name: "News", path: "/news", icon: Newspaper },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  const bottomNavItems = navLinks;

  const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
  const [programsList, setProgramsList] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}/api/programs`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const raw = Array.isArray(data) ? data : data?.programs || [];
        setProgramsList(raw.slice(0, 6));
      })
      .catch(() => {
        // leave programsList empty on failure
      });
    return () => {
      mounted = false;
    };
  }, []);

  const scrollToTop = () => {
    lenis?.scrollTo(0, { duration: 0.8 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Header — Logo + Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
className={`sticky top-0 z-50 w-full transition-all duration-500 ${
  isScrolled ? "bg-white/90 backdrop-blur-md" : "bg-white"
}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group border-0 outline-none">
            <img
              src="/images/nepalayalogo.png"
              alt="Nepalaya Logo"
              className="w-20 h-20 object-contain transition-transform duration-500 group-hover:scale-110 border-0 outline-none"
            />
          </Link>

          {/* Right Section — Nav + Phone/Social + Apply (single row) */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = location === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={link.path}>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none ${
                          isActive
                            ? "text-white"
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 bg-primary rounded-xl"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          <Icon className="w-4 h-4" strokeWidth={2.5} />
                          {link.name}
                        </span>
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.45 }}
            >
              <Link href="/admissions">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all rounded-full px-5 text-sm">
                  Apply Now
                </Button>
              </Link>
            </motion.div>

            <span className="w-px h-5 bg-slate-200" />

            <a href="tel:+9779761522442" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors whitespace-nowrap">
              <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
              +977-9761522442
            </a>

            <div className="flex items-center gap-0.5">
              <a href="https://www.facebook.com/profile.php?id=61584645043722" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Facebook">
                <Facebook className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
              <a href="https://www.instagram.com/nepalayaedu/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all" title="Instagram">
                <Instagram className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
              <a href="https://www.youtube.com/@nepalayaedu" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" title="YouTube">
                <Youtube className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </motion.header>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-5">
              <img
                src="/images/nepalayalogo.png"
                alt="Nepalaya Logo"
                className="w-24 h-24 object-contain"
              />
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
                {programsList.length === 0 ? (
                  <li className="text-sm text-slate-500">Loading programs…</li>
                ) : (
                  programsList.map((p: any) => (
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
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
                      <motion.span
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2} />
                        {link.name}
                      </motion.span>
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
    </div>
  );
}