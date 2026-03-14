import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowRight, BookOpen, Users, Trophy, Globe, 
  Microscope, Building2, HeartPulse, Scale, Palette, Monitor
} from "lucide-react";

export default function Home() {
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

  const programs = [
    { icon: <Building2 />, title: "Engineering & Technology", desc: "Building the future with cutting-edge engineering programs.", colors: "from-indigo-500 to-blue-600" },
    { icon: <Globe />, title: "Business Management", desc: "Creating global leaders and innovative entrepreneurs.", colors: "from-emerald-500 to-teal-600" },
    { icon: <HeartPulse />, title: "Medical Sciences", desc: "Advancing healthcare through rigorous medical training.", colors: "from-rose-500 to-pink-600" },
    { icon: <Scale />, title: "Law & Governance", desc: "Shaping justice and policy for a better society.", colors: "from-amber-500 to-orange-600" },
    { icon: <Palette />, title: "Humanities & Arts", desc: "Exploring human culture, expression, and critical thought.", colors: "from-purple-500 to-violet-600" },
    { icon: <Monitor />, title: "Computer Science", desc: "Mastering software, AI, and digital innovation.", colors: "from-cyan-500 to-blue-600" },
  ];

  return (
    <PageTransition>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-campus.png`} 
            alt="Campus" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 w-full md:w-3/4 opacity-90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90 z-10" />
          
          {/* Animated Blob */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/30 blur-3xl blob-shape z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeIn} className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
                Est. 2029 BS (1972 AD)
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] tracking-tight mb-6">
                Shape Your Future at <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Nepal's Premier</span> <br/>
                Institution.
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed font-light">
                Discover world-class education right here in the Kathmandu Valley. We blend rich cultural heritage with cutting-edge academic excellence to create the leaders of tomorrow.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link href="/admissions">
                  <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white rounded-full shadow-lg shadow-primary/25 border-0">
                    Apply Now <ArrowRight className="ml-2 w-5 h-5" />
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
      </section>

      {/* STATS SECTION */}
      <section className="relative z-30 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Students Enrolled", value: "5,000+", icon: <Users className="text-primary" /> },
            { label: "Expert Faculty", value: "200+", icon: <BookOpen className="text-amber-500" /> },
            { label: "Academic Programs", value: "50+", icon: <Microscope className="text-emerald-500" /> },
            { label: "Placement Rate", value: "98%", icon: <Trophy className="text-rose-500" /> },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-display font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -m-6 -z-10 transform -rotate-3"></div>
              <img 
                src={`${import.meta.env.BASE_URL}images/about-college.png`} 
                alt="Students in library" 
                className="rounded-3xl shadow-2xl relative z-10 border border-slate-100"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 hidden md:block">
                <div className="text-4xl font-black text-primary mb-1">50+</div>
                <div className="text-sm font-semibold text-slate-600 uppercase">Years of<br/>Excellence</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">About TCE</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                A Legacy of Learning in the <span className="text-gradient">Heart of Nepal</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Founded in 2029 BS, Tribhuvan College of Excellence stands as a beacon of academic brilliance. We are committed to nurturing intellectual curiosity and producing graduates who lead with integrity.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Affiliated with Tribhuvan University",
                  "State-of-the-art research laboratories",
                  "Global exchange programs",
                  "Comprehensive scholarship schemes"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="/about">
                <Button size="lg" className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white">
                  Discover Our History
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Academics</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Our Diverse Programs</h2>
            <p className="text-lg text-slate-600">Choose from a wide array of undergraduate and postgraduate programs designed to meet global standards and industry needs.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden hover:-translate-y-2"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${prog.colors} opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110`} />
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.colors} flex items-center justify-center text-white mb-6 shadow-md`}>
                  {prog.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{prog.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{prog.desc}</p>
                
                <Link href="/programs" className={`inline-flex items-center font-bold text-transparent bg-clip-text bg-gradient-to-r ${prog.colors} group-hover:opacity-80 transition-opacity`}>
                  Explore Program <ArrowRight className="ml-2 w-4 h-4 text-current stroke-[3]" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/programs">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-slate-200 hover:border-primary hover:text-primary">
                View All 50+ Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh z-0" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-slate-300 mb-10 font-light">
              Join thousands of successful alumni. Admissions for the 2081/2082 academic session are now open.
            </p>
            <Link href="/admissions">
              <Button size="lg" className="h-16 px-10 text-xl bg-white text-slate-900 hover:bg-slate-100 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                Start Application Online
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
