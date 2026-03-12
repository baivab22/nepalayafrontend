import { PageTransition, FadeIn } from "@/components/PageTransition";
import { CheckCircle2, Download, FileText, Calendar, CreditCard } from "lucide-react";

export default function Admissions() {
  return (
    <PageTransition>
      {/* Header */}
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Admissions
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join our vibrant community. Information on applying, fees, and requirements.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content - Process */}
          <div className="lg:col-span-2 space-y-12">
            <FadeIn>
              <h2 className="font-display text-3xl font-bold text-primary mb-6">Application Process</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  { title: "Submit Online Application", desc: "Fill out the admission form on our portal with personal details and academic history." },
                  { title: "Entrance Examination", desc: "Appear for the TCE standard entrance exam held at various centers across Nepal." },
                  { title: "Interview Round", desc: "Shortlisted candidates will be called for a personal interview with faculty members." },
                  { title: "Enrollment & Fee Payment", desc: "Upon selection, complete the admission by submitting original documents and the first installment fee." }
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-border shadow-sm">
                      <h3 className="font-bold text-lg text-primary mb-1">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="font-display text-3xl font-bold text-primary mb-6">Eligibility Criteria</h2>
              <div className="bg-secondary p-8 rounded-2xl border border-border/50">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <span className="font-bold text-foreground">Bachelor's Programs:</span>
                      <p className="text-sm text-muted-foreground mt-1">Minimum 2nd Division or C+ Grade in 10+2 (NEB) or equivalent in relevant stream.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <span className="font-bold text-foreground">Master's Programs:</span>
                      <p className="text-sm text-muted-foreground mt-1">Minimum CGPA 2.5 or 50% in Bachelor's degree from a recognized university.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Sidebar - Quick Info */}
          <div className="space-y-8">
            <FadeIn delay={0.3}>
              <div className="bg-primary text-white p-8 rounded-2xl shadow-xl">
                <h3 className="font-display text-2xl font-bold mb-6 text-accent">Apply Now</h3>
                <p className="text-sm text-white/80 mb-6">
                  The admission portal for Fall 2081 is currently active.
                </p>
                <button className="w-full py-4 bg-accent text-primary font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Start Application
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Important Dates
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Form Availability</span>
                    <span className="font-semibold">Mangsir 1</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Last Date (Regular)</span>
                    <span className="font-semibold">Poush 15</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="text-muted-foreground">Entrance Exam</span>
                    <span className="font-semibold">Magh 5</span>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-accent" />
                  Downloads
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center gap-2 text-sm text-primary hover:text-accent p-2 rounded-md hover:bg-secondary transition-colors">
                      <FileText className="w-4 h-4" /> Prospectus 2081/82
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 text-sm text-primary hover:text-accent p-2 rounded-md hover:bg-secondary transition-colors">
                      <CreditCard className="w-4 h-4" /> Fee Structure
                    </a>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
