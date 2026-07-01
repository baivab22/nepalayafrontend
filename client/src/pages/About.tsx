import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Award, Users, GraduationCap, Target, Eye,
  HeartHandshake, ShieldCheck, Library, Globe,
  Lightbulb, Sparkles, Landmark
} from "lucide-react";

const API_URL = "https://nepalaya-apis.onrender.com";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function About() {
  return (
    <PageTransition>
      {/* HISTORY */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Landmark className="w-3.5 h-3.5" />
                Our History
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">
                A Legacy of Educational Excellence
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Founded in <strong>1984 A.D.</strong>, Nepalaya Educational Foundation began its journey
                  in Kalanki, Kathmandu with a bold vision: to make quality, globally-relevant education
                  accessible to students in Nepal.
                </p>
                <p>
                  Over four decades, Nepalaya has grown into one of the valley's most trusted
                  educational institutions, known for academic rigor, dedicated faculty, and a
                  student-centered approach that emphasizes both intellectual growth and character
                  development.
                </p>
                <p>
                  Today, we offer programs from school level through post-graduate degrees,
                  serving hundreds of students across multiple disciplines — from science and
                  technology to humanities and management.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -m-4 -z-10 transform rotate-2" />
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={`${import.meta.env.BASE_URL}images/about-college2.png`}
                  alt="Campus"
                  className="w-full rounded-3xl border border-slate-100"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden md:block"
              >
                <div className="text-3xl font-black text-primary mb-1">42+</div>
                <div className="text-xs font-semibold text-slate-600 uppercase">Years of<br />Excellence</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Target className="w-3.5 h-3.5" />
              Our Foundation
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our mission, vision, and values form the bedrock of everything we do at Nepalaya.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="group relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To empower Nepal's next generation through transformative education, rigorous research,
                and community leadership built on academic integrity and social responsibility.
              </p>
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/40 to-transparent rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="group relative p-8 rounded-2xl bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed">
                To be the premier educational destination in Nepal, known for innovative teaching,
                sustainable development, global partnerships, and graduates who lead with purpose.
              </p>
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Values</h3>
              <ul className="space-y-3">
                {[
                  { text: "Excellence in teaching and research", icon: ShieldCheck },
                  { text: "Integrity and social responsibility", icon: HeartHandshake },
                  { text: "Inclusive and diverse learning community", icon: Users },
                  { text: "Innovation for national progress", icon: Lightbulb },
                  { text: "Global perspective, local impact", icon: Globe },
                ].map((v) => (
                  <li key={v.text} className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <v.icon className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    {v.text}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-amber-400/40 to-transparent rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Why Nepalaya
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-4">
              The Nepalaya Advantage
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              What sets us apart is our unwavering dedication to holistic education and student success.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Library,
                title: "Modern Infrastructure",
                description: "Four academic buildings with nearly 80 well-organized classrooms, equipped with modern teaching aids and resources.",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Users,
                title: "Expert Faculty",
                description: "A dedicated team of experienced educators committed to mentoring, guiding, and inspiring students to reach their full potential.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: GraduationCap,
                title: "Comprehensive Programs",
                description: "From school level to master's degrees — a wide range of programs designed to meet diverse academic interests and career goals.",
                color: "text-sky-600",
                bg: "bg-sky-50",
              },
              {
                icon: Globe,
                title: "Global Standards",
                description: "Affiliated with Rajarshi Janak University, our curriculum meets international benchmarks while remaining relevant to local needs.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Award,
                title: "Proven Track Record",
                description: "Nearly 98% passout rate with alumni making significant contributions across Nepal and around the world.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                icon: Lightbulb,
                title: "Holistic Development",
                description: "Beyond academics, we focus on character building, leadership, extracurricular engagement, and community service.",
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:border-transparent transition-all duration-400"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PageTransition>
  );
}
