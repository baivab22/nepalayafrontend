import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, MapPin, Phone, Mail, ChevronRight, Menu, X, ArrowUp } from "lucide-react";
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
            Admission Open 2081 BS
          </span>
          <span className="flex items-center text-slate-300">
            <MapPin className="w-3 h-3 mr-1" /> Pulchowk Campus, Lalitpur
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="tel:+977015524890" className="flex items-center hover:text-amber-400 transition-colors">
            <Phone className="w-3 h-3 mr-1" /> +977-01-5524890
          </a>
          <a href="mailto:info@tce.edu.np" className="flex items-center hover:text-amber-400 transition-colors">
            <Mail className="w-3 h-3 mr-1" /> info@tce.edu.np
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
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform"
            >
              <GraduationCap className="w-6 h-6" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-black text-slate-900 leading-none tracking-tight">Tribhuvan</span>
              <span className="text-[10px] font-semibold tracking-widest text-primary uppercase">College of Excellence</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className="group relative"
              >
                <span className={`text-sm font-medium transition-colors group-hover:text-primary ${
                  location === link.path ? "text-primary" : "text-slate-600"
                }`}>
                  {link.name}
                </span>
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left transition-transform duration-300 ease-out ${
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
                  <span className="text-xl font-display font-black text-white leading-none">Tribhuvan</span>
                  <span className="text-[10px] font-semibold tracking-widest text-primary-foreground/70 uppercase">College of Excellence</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nepal's premier educational institution, blending rich cultural heritage with cutting-edge academic excellence since 2029 BS.
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
                <li><Link href="/programs" className="hover:text-amber-400 transition-colors">Engineering & Tech</Link></li>
                <li><Link href="/programs" className="hover:text-amber-400 transition-colors">Business Management</Link></li>
                <li><Link href="/programs" className="hover:text-amber-400 transition-colors">Medical Sciences</Link></li>
                <li><Link href="/programs" className="hover:text-amber-400 transition-colors">Law & Governance</Link></li>
                <li><Link href="/programs" className="hover:text-amber-400 transition-colors">Humanities & Arts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-display font-bold mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                  <span>Pulchowk Campus Road,<br/>Lalitpur 44700, Kathmandu Valley,<br/>Nepal</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-primary shrink-0" />
                  <span>+977-01-5524890</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-primary shrink-0" />
                  <span>info@tce.edu.np</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Tribhuvan College of Excellence. All rights reserved.</p>
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