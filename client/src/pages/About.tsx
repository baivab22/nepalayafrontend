import { PageTransition } from "@/components/PageTransition";
import { Target, Flag, Shield, Award } from "lucide-react";

export default function About() {
  return (
    <PageTransition>
      <div className="bg-slate-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/about-college.png)` }} />
        <div className="absolute inset-0 bg-slate-900/80 z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-4">Nepalaya Educational Foundation</h1>
          <p className="text-sm text-amber-300 font-semibold uppercase tracking-wider mb-2">Established 1984 • Kalanki, Kathmandu</p>
          <p className="text-xl text-slate-300 font-light">One of the best colleges in Kathmandu, Nepalaya nurtures academic excellence, leadership, and community impact across diverse fields of study.</p>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Founded in 1984, Nepalaya Educational Foundation was established to bring high-quality higher education to Nepal. Rooted in Kalanki, Kathmandu, the college has grown from a small pioneer campus to a respected institution known for academic rigor and student success.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Today, Nepalaya offers a wide range of programs across engineering, management, sciences, humanities, law, and the arts. We are committed to inclusive learning, practical research, and strong community partnerships that prepare graduates for leadership and service.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-4xl font-black text-primary mb-2">5,00+</div>
                <div className="text-sm font-medium text-slate-500 uppercase">Students Enrolled</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-4xl font-black text-emerald-500 mb-2">20+</div>
                <div className="text-sm font-medium text-slate-500 uppercase">Expert Faculty</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-4xl font-black text-sky-500 mb-2">5+</div>
                <div className="text-sm font-medium text-slate-500 uppercase">Academic Programs</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-4xl font-black text-amber-500 mb-2">5k+</div>
                <div className="text-sm font-medium text-slate-500 uppercase">Alumni Network</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary p-8 rounded-3xl text-white">
              <Target className="w-12 h-12 mb-6 text-amber-300" />
              <h3 className="text-2xl font-bold mb-4 font-display">Our Mission</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                To empower Nepal's next generation through transformative education, rigorous research, and community leadership built on academic integrity.
              </p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl text-white">
              <Flag className="w-12 h-12 mb-6 text-emerald-400" />
              <h3 className="text-2xl font-bold mb-4 font-display">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed">
                To be the premier educational destination in Nepal, known for innovative teaching, sustainable development, and global partnerships.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl">
              <Shield className="w-12 h-12 mb-6 text-primary" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display">Core Values</h3>
              <ul className="space-y-3 text-slate-600 font-medium">
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Excellence in teaching and research</li>
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Integrity and social responsibility</li>
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Inclusive learning community</li>
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Innovation for national progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
