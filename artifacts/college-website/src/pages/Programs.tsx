import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Building2, Globe, HeartPulse, Scale, Palette, Monitor, ChevronRight } from "lucide-react";

export default function Programs() {
  const categories = [
    { title: "Engineering & Technology", icon: <Building2 className="w-8 h-8 text-indigo-500" />, items: ["B.E. Civil Engineering", "B.E. Computer Engineering", "B.E. Architecture", "M.Sc. Structural Engineering"] },
    { title: "Business Management", icon: <Globe className="w-8 h-8 text-emerald-500" />, items: ["Bachelor of Business Administration (BBA)", "Bachelor of Business Studies (BBS)", "Master of Business Administration (MBA)"] },
    { title: "Medical Sciences", icon: <HeartPulse className="w-8 h-8 text-rose-500" />, items: ["Bachelor of Medicine, Bachelor of Surgery (MBBS)", "Bachelor of Dental Surgery (BDS)", "B.Sc. Nursing"] },
    { title: "Law & Governance", icon: <Scale className="w-8 h-8 text-amber-500" />, items: ["BA LLB (5 Years)", "LLB (3 Years)", "LLM"] },
    { title: "Humanities & Arts", icon: <Palette className="w-8 h-8 text-purple-500" />, items: ["BA in Sociology", "BA in English Literature", "MA in Rural Development"] },
    { title: "Computer Science & IT", icon: <Monitor className="w-8 h-8 text-cyan-500" />, items: ["B.Sc. CSIT", "Bachelor of Information Management (BIM)", "Master of Information Technology (MIT)"] },
  ];

  return (
    <PageTransition>
      <div className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="text-amber-400 border-amber-400/50 bg-amber-400/10 mb-6">Academics</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6">Our Programs</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Discover comprehensive degree programs designed to equip you with the knowledge and skills needed in today's dynamic world.
          </p>
        </div>
      </div>

      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {cat.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">{cat.title}</h2>
                <ul className="space-y-4">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start group">
                      <ChevronRight className="w-5 h-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-2 shrink-0" />
                      <Link href="/admissions" className="text-slate-600 hover:text-primary font-medium transition-colors cursor-pointer">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
