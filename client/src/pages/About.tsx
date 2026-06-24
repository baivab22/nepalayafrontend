import { PageTransition } from "@/components/PageTransition";
import { Award, BookOpen, Users, GraduationCap } from "lucide-react";

export default function About() {
  return (
    <PageTransition>
      <div className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">About</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">
              Nepalaya Educational Foundation
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Founded in 1984 in Kalanki, Kathmandu, Nepalaya has grown from a small pioneer campus into
              one of the valley's most respected institutions — known for academic rigor, student success,
              and community impact across engineering, management, sciences, and the arts.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Students", value: "500+", icon: Users, color: "text-primary" },
              { label: "Faculty", value: "20+", icon: BookOpen, color: "text-emerald-600" },
              { label: "Programs", value: "5+", icon: GraduationCap, color: "text-sky-600" },
              { label: "Alumni", value: "5k+", icon: Award, color: "text-amber-600" },
            ].map((stat) => (
              <div key={stat.label} className="border border-slate-200 rounded-2xl p-6">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <span className="text-primary text-lg font-bold">M</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Mission</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                To empower Nepal's next generation through transformative education, rigorous research,
                and community leadership built on academic integrity.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900 text-white">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                <span className="text-white text-lg font-bold">V</span>
              </div>
              <h2 className="text-xl font-bold mb-3">Vision</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                To be the premier educational destination in Nepal, known for innovative teaching,
                sustainable development, and global partnerships.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-5">
                <span className="text-amber-600 text-lg font-bold">V</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Values</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  "Excellence in teaching and research",
                  "Integrity and social responsibility",
                  "Inclusive learning community",
                  "Innovation for national progress",
                ].map((v) => (
                  <li key={v} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
