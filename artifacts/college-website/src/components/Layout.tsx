import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { siteConfig, navLinks } from "@/lib/data";
import { Menu, X, MapPin, Phone, Mail, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:flex bg-primary text-primary-foreground py-2 px-6 justify-between items-center text-xs font-medium tracking-wide">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-accent" />
            {siteConfig.contact.address}, {siteConfig.contact.city}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-accent" />
            {siteConfig.contact.phone}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admissions" className="hover:text-accent transition-colors">Portal Login</Link>
          <span className="w-px h-3 bg-primary-foreground/30"></span>
          <Link href="/contact" className="hover:text-accent transition-colors">Alumni</Link>
          <span className="w-px h-3 bg-primary-foreground/30"></span>
          <span className="flex items-center gap-1 text-accent">
            <GraduationCap className="w-3 h-3" />
            EST. 1972 BS
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <header 
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled || isMobileMenuOpen
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3" 
            : "bg-white py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 overflow-hidden flex-shrink-0">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo.png`} 
                  alt={`${siteConfig.name} Logo`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl sm:text-2xl text-primary leading-none">
                  Tribhuvan
                </span>
                <span className="font-sans font-medium text-xs sm:text-sm text-accent tracking-widest uppercase mt-1">
                  College of Excellence
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors duration-200 relative group py-2",
                    location === link.href ? "text-primary" : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300",
                    location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
              <Link 
                href="/admissions"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Apply Now
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b shadow-lg overflow-hidden fixed top-[72px] left-0 w-full z-40"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-md text-base font-semibold transition-colors",
                    location === link.href 
                      ? "bg-primary/5 text-primary" 
                      : "text-foreground hover:bg-gray-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 px-4">
                <Link 
                  href="/admissions"
                  className="block w-full text-center bg-primary text-white px-6 py-3 rounded-md font-semibold shadow-md"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-8 bg-pattern relative">
        <div className="absolute inset-0 bg-primary/95"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Branding */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-sm w-12 h-12 flex items-center justify-center">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/logo.png`} 
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Tribhuvan</h3>
                  <p className="text-accent text-xs font-bold tracking-wider uppercase">College</p>
                </div>
              </div>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {siteConfig.description} We are committed to nurturing the brightest minds in Nepal and beyond.
              </p>
              <div className="flex gap-4">
                {/* Minimal social icons using lucide for demo */}
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                  <span className="font-bold text-xs">FB</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                  <span className="font-bold text-xs">IN</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                  <span className="font-bold text-xs">TW</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-accent"></span> Quick Links
              </h4>
              <ul className="space-y-3">
                {navLinks.slice(1, 5).map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-primary-foreground/80 hover:text-accent text-sm flex items-center gap-2 group transition-colors">
                      <ChevronRight className="w-3 h-3 text-accent opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-accent"></span> Academics
              </h4>
              <ul className="space-y-3">
                <li><Link href="/programs" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">Science & Technology</Link></li>
                <li><Link href="/programs" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">Business Management</Link></li>
                <li><Link href="/programs" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">Humanities & Arts</Link></li>
                <li><Link href="/programs" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">Medical Sciences</Link></li>
                <li><Link href="/programs" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">Engineering Programs</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-accent"></span> Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span>{siteConfig.contact.address}<br/>{siteConfig.contact.city}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Phone className="w-5 h-5 text-accent shrink-0" />
                  <span>{siteConfig.contact.phone}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Mail className="w-5 h-5 text-accent shrink-0" />
                  <span>{siteConfig.contact.email}</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-accent transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
