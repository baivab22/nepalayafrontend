import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, MapPin, Phone, Mail, ChevronRight, Menu, X, ArrowUp, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Faculty", path: "/faculty" },
    { name: "News", path: "/news" },
    { name: "Contact", path: "/contact" },
  ];

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm hidden md:flex justify-between items-center z-50 relative">
        <div className="flex items-center space-x-6">
          <span className="flex items-center text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>
            Admission Open 2083 BS
          </span>
          <span className="flex items-center text-slate-300">
            <MapPin className="w-3 h-3 mr-1" /> Kalanki 14, Kathmandu
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="tel:+9779761522442" className="flex items-center hover:text-amber-400 transition-colors">
            <Phone className="w-3 h-3 mr-1" /> +977-9761522442
          </a>
          <a href="mailto:info@nepalayaedufoundation.edu.np" className="flex items-center hover:text-amber-400 transition-colors">
            <Mail className="w-3 h-3 mr-1" /> info@nepalayaedufoundation.edu.np
          </a>
          <a 
            href="https://www.facebook.com/profile.php?id=61584645043722" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-blue-400 transition-colors"
            title="Visit our Facebook page"
          >
            <Facebook className="w-3 h-3 mr-1" /> Facebook
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "glass-nav py-3" : "bg-white/95 backdrop-blur-sm border-b border-border/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-14 h-14 overflow-visible transition-transform flex-shrink-0 rounded-md"
              style={{ willChange: "transform" }}
            >
              <img
                src="/images/nepalayalogo.jpeg"
                alt="Nepalaya Logo"
                className="w-full h-full object-contain transform scale-125 shadow-lg"
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className="group relative"
              >
                <span className={`text-sm font-medium transition-colors group-hover:text-blue-600 ${
                  location === link.path ? "text-blue-600" : "text-slate-600"
                }`}>
                  {link.name}
                </span>
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 origin-left transition-transform duration-300 ease-out ${
                  location === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            ))}
            <Link href="/admissions">
              <Button className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-full px-6">
                Apply Now
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-border shadow-xl z-40 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium p-2 rounded-lg ${
                    location === link.path ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/admissions" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-4 bg-primary text-white">
                  Apply Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col w-full relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-300 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-display font-black text-white leading-none">Nepalaya</span>
                  <span className="text-[10px] font-semibold tracking-widest text-primary-foreground/70 uppercase">Educational Foundation</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nepal's premier educational institution, blending rich cultural heritage with cutting-edge academic excellence since 1984 AD.
              </p>
            </div>

            <div>
              <h4 className="text-white font-display font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link href={link.path} className="hover:text-amber-400 transition-colors flex items-center">
                      <ChevronRight className="w-3 h-3 mr-2 text-primary" /> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
                <h4 className="text-white font-display font-bold mb-6 text-lg">Programs</h4>
                <ul className="space-y-3 text-sm">
                  {programsList.length === 0 ? (
                    <li className="text-slate-400">Loading programs…</li>
                  ) : (
                    programsList.map((p: any) => (
                      <li key={p._id}>
                        <Link href="/programs" className="hover:text-amber-400 transition-colors">
                          {p.title}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
            </div>

            <div>
              <h4 className="text-white font-display font-bold mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                  <span>Kalanki 14, Kathmandu 44600<br/>Kathmandu, Nepal</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-primary shrink-0" />
                  <span>+977-9761522442</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-primary shrink-0" />
                  <span>info@nepalayaedufoundation.edu.np</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5">🕒</span>
                  <span>Office Hours: Sun–Fri 6:00 AM – 5:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Nepalaya Educational Foundation. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/90 hover:-translate-y-1 transition-all z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}