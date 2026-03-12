import { PageTransition, FadeIn } from "@/components/PageTransition";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Link } from "wouter";
import { programs, faculty, news } from "@/lib/data";
import { ArrowRight, Microscope, Briefcase, BookOpen, Cpu, Scale, Stethoscope, Quote, GraduationCap, Users, BookMarked, Award } from "lucide-react";

// Icon mapping helper
const getIcon = (name: string, className: string) => {
  switch(name) {
    case 'microscope': return <Microscope className={className} />;
    case 'briefcase': return <Briefcase className={className} />;
    case 'book-open': return <BookOpen className={className} />;
    case 'cpu': return <Cpu className={className} />;
    case 'scale': return <Scale className={className} />;
    case 'stethoscope': return <Stethoscope className={className} />;
    default: return <BookOpen className={className} />;
  }
};

export default function Home() {
  return (
    <PageTransition>
      {/* HERO SECTION */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-campus.png`}
            alt="Campus aerial view" 
            className="w-full h-full object-cover object-center"
          />
          {/* Elegant dark wash for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white space-y-6">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm text-accent text-sm font-semibold mb-4">
                <GraduationCap className="w-4 h-4" />
                Admission Open for 2081/2082
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-shadow-lg">
                Forge Your <br />
                <span className="text-accent">Legacy</span> Here.
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-sans max-w-xl">
                Nepal's premier educational institution, blending rich cultural heritage with cutting-edge academic excellence since 1972 BS.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4} className="flex flex-wrap gap-4 pt-4">
              <Link href="/programs" className="px-8 py-3.5 bg-accent text-primary font-bold rounded-md shadow-lg shadow-accent/30 hover:bg-yellow-400 hover:-translate-y-1 transition-all duration-300">
                Explore Programs
              </Link>
              <Link href="/about" className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-md hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                Discover TCE
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-primary border-b-4 border-accent relative z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { label: "Active Students", value: 5000, suffix: "+", icon: Users },
              { label: "Expert Faculty", value: 200, suffix: "+", icon: Award },
              { label: "Academic Programs", value: 50, suffix: "+", icon: BookMarked },
              { label: "Placement Rate", value: 95, suffix: "%", icon: Briefcase }
            ].map((stat, i) => (
              <div key={i} className="py-8 px-4 flex flex-col items-center text-center">
                <stat.icon className="w-8 h-8 text-accent mb-3 opacity-80" />
                <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-primary-foreground/70 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <FadeIn direction="right">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  {/* campus life learning photo */}
                  <img src="https://pixabay.com/get/g5a6780011f07c4fe9e45394672e84d0edd4545c9c9995bc76bcf8fcaf76b183575696f82ec507ea75a36d12562cfc170ab9e9a42cdd09b0dba66c95b1e6fecfb_1280.jpg" alt="Students learning" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xl text-primary">Ranked #1</h4>
                      <p className="text-sm text-muted-foreground">In Nepal for Research</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="lg:w-1/2">
              <FadeIn direction="left">
                <h4 className="text-accent font-bold tracking-widest uppercase text-sm mb-3">About The College</h4>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight">
                  Shaping the Future of Nepal's Youth.
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Located in the heart of Lalitpur, Tribhuvan College of Excellence stands as a beacon of knowledge. We integrate modern pedagogical approaches with deep-rooted cultural values to produce holistic graduates ready for global challenges.
                </p>
                <p className="text-muted-foreground mb-8">
                  Our state-of-the-art facilities, renowned faculty, and vibrant campus life create an ecosystem where academic rigor meets personal growth. From engineering to humanities, we nurture critical thinking and innovation.
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                    {/* dean portrait */}
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150" alt="Dean" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-8 opacity-60 mb-1 filter grayscale" />
                    <p className="text-sm font-bold text-primary">Prof. Dr. Ram Bahadur Thapa</p>
                    <p className="text-xs text-muted-foreground">Principal</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS GRID */}
      <section className="py-24 bg-secondary border-t border-border/50 bg-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <h4 className="text-accent font-bold tracking-widest uppercase text-sm mb-3">Academics</h4>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary mb-6">
                Discover Your Path
              </h2>
              <p className="text-muted-foreground text-lg">
                We offer over 50+ undergraduate and graduate programs across diverse disciplines, tailored to meet industry demands.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, idx) => (
              <FadeIn key={program.id} delay={idx * 0.1}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50 flex flex-col h-full hover:-translate-y-1">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-white text-xs font-semibold border border-white/20">
                      {program.level}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {getIcon(program.icon, "w-6 h-6")}
                    </div>
                    <h3 className="font-display font-bold text-xl text-primary mb-2">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-1">
                      {program.description}
                    </p>
                    <Link href="/programs" className="inline-flex items-center text-primary font-bold text-sm group/link mt-auto">
                      Learn more 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/programs" className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to take the next step?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join a community of scholars, innovators, and leaders. Admissions for the upcoming academic session are now open.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admissions" className="px-8 py-4 bg-accent text-primary font-bold rounded-md shadow-lg shadow-accent/20 hover:bg-yellow-400 transition-colors text-lg">
                Apply Online Now
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-md hover:bg-white/20 transition-colors text-lg">
                Request Information
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <FadeIn>
              <h4 className="text-accent font-bold tracking-widest uppercase text-sm mb-2">Happenings</h4>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary">Campus News</h2>
            </FadeIn>
            <Link href="/news" className="hidden sm:inline-flex items-center text-primary font-semibold hover:text-accent transition-colors">
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-md">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md shadow-sm">
                      <span className="text-xs font-bold text-primary">{item.date}</span>
                    </div>
                  </div>
                  <div className="px-2">
                    <span className="text-xs font-bold text-accent tracking-wider uppercase mb-2 block">{item.category}</span>
                    <h3 className="font-display font-bold text-xl text-primary mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {item.summary}
                    </p>
                    <span className="text-primary text-sm font-semibold inline-flex items-center">
                      Read Article <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/news" className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-bold rounded-md hover:bg-primary hover:text-white transition-colors">
              View All News
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
