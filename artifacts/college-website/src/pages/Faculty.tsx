import { PageTransition } from "@/components/PageTransition";
import { Mail } from "lucide-react";

export default function Faculty() {
  const faculties = [
    { name: "Dr. Ram Shrestha", role: "Dean, Engineering", desc: "Ph.D. in Civil Engineering (MIT). Over 20 years of experience in structural design.", dept: "Engineering" },
    { name: "Prof. Sita Koirala", role: "Head of Business Studies", desc: "MBA (Harvard). Specialist in strategic management and entrepreneurship.", dept: "Management" },
    { name: "Dr. Hari Thapa", role: "Professor, Medical Sciences", desc: "MD, MS. Leading researcher in community medicine in Nepal.", dept: "Medical" },
    { name: "Dr. Gita Poudel", role: "Associate Prof, Law", desc: "LLD. Expert in Constitutional Law and Human Rights.", dept: "Law" },
    { name: "Prof. Binod Gurung", role: "Head of IT", desc: "Ph.D. in Computer Science. Focus on AI and Machine Learning.", dept: "Computer Science" },
    { name: "Dr. Anu Magar", role: "Lecturer, Humanities", desc: "Ph.D. in Sociology. Research focus on Himalayan cultures.", dept: "Humanities" },
  ];

  return (
    <PageTransition>
      <div className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6">Our Distinguished Faculty</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Learn from the brightest minds. Our professors are renowned experts, researchers, and thought leaders.
          </p>
        </div>
      </div>

      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculties.map((fac, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-1 mb-6">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-display font-bold text-slate-800">
                    {fac.name.charAt(4)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{fac.name}</h3>
                <div className="text-primary font-medium text-sm mb-4">{fac.role}</div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {fac.desc}
                </p>
                <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-500 hover:bg-primary hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
