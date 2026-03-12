import { PageTransition, FadeIn } from "@/components/PageTransition";
import { siteConfig } from "@/lib/data";

export default function About() {
  return (
    <PageTransition>
      {/* Header */}
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              About TCE
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              A legacy of academic excellence and cultural preservation since 1972 BS.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">Our History</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Founded in 1972 BS (Bikram Sambat), Tribhuvan College of Excellence began as a small institution dedicated to providing quality higher education in the Kathmandu Valley. Over the decades, we have grown into a multidisciplinary university college, affiliated with the nation's oldest university.
              </p>
              <p>
                Our journey has been marked by a continuous commitment to expanding academic horizons while remaining deeply rooted in Nepali culture and ethics. We have produced thousands of alumni who now serve in leadership positions globally.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-video">
              {/* vintage building photo */}
              <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000" alt="Historical building" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-secondary py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FadeIn className="bg-white p-10 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the premier academic institution in South Asia, recognized globally for excellence in teaching, research, and service to society, while preserving the rich heritage of Nepal.
              </p>
            </FadeIn>
            <FadeIn delay={0.2} className="bg-primary p-10 rounded-2xl shadow-lg text-white">
               <div className="w-14 h-14 bg-white/10 text-accent rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">
                To cultivate a transformative learning environment that empowers students with critical thinking, ethical grounding, and professional skills to become leaders who contribute positively to nation-building and global progress.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
