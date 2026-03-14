import { PageTransition } from "@/components/PageTransition";
import { Target, Flag, Shield, Award } from "lucide-react";

export default function About() {
  return (
    <PageTransition>
      <div className="bg-slate-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/about-college.png)` }} />
        <div className="absolute inset-0 bg-slate-900/80 z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6">About TCE</h1>
          <p className="text-xl text-slate-300 font-light">Pioneering academic excellence in Nepal since 2029 BS.</p>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Our History</h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Established over five decades ago, Tribhuvan College of Excellence (TCE) began with a singular vision: to provide world-class education within Nepal. From a small campus in Patan with just 200 students, we have grown into a premier institution.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Today, our sprawling Pulchowk campus houses over 5,000 students across six faculties. We are proudly affiliated with Tribhuvan University and recognized by the University Grants Commission of Nepal for our uncompromising academic standards.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-4xl font-black text-primary mb-2">1972</div>
                <div className="text-sm font-medium text-slate-500 uppercase">Year Founded</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
                <div className="text-4xl font-black text-emerald-500 mb-2">50k+</div>
                <div className="text-sm font-medium text-slate-500 uppercase">Alumni Worldwide</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary p-8 rounded-3xl text-white">
              <Target className="w-12 h-12 mb-6 text-amber-300" />
              <h3 className="text-2xl font-bold mb-4 font-display">Our Mission</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                To foster intellectual growth, innovation, and ethical leadership by providing a transformative educational experience that empowers students to solve complex global challenges.
              </p>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl text-white">
              <Flag className="w-12 h-12 mb-6 text-emerald-400" />
              <h3 className="text-2xl font-bold mb-4 font-display">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed">
                To be the undisputed leader in higher education in South Asia, recognized globally for academic rigor, groundbreaking research, and societal impact.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl">
              <Shield className="w-12 h-12 mb-6 text-primary" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display">Core Values</h3>
              <ul className="space-y-3 text-slate-600 font-medium">
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Excellence</li>
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Integrity</li>
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Diversity</li>
                <li className="flex items-center"><Award className="w-5 h-5 mr-3 text-amber-500" /> Innovation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
