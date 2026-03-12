import { PageTransition, FadeIn } from "@/components/PageTransition";
import { news } from "@/lib/data";
import { Calendar, ArrowRight } from "lucide-react";

export default function News() {
  return (
    <PageTransition>
      {/* Header */}
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              News & Events
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Stay updated with the latest happenings at TCE.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main News List */}
          <div className="lg:col-span-8 space-y-10">
            {news.map((item, idx) => (
              <FadeIn key={item.id} delay={idx * 0.1}>
                <article className="flex flex-col sm:flex-row gap-6 group bg-white rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="sm:w-1/3 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="sm:w-2/3 py-2 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.summary}
                    </p>
                    <button className="inline-flex items-center text-primary font-semibold text-sm mt-auto w-fit group/btn">
                      Read full article
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <FadeIn delay={0.3} className="bg-secondary rounded-2xl p-6 border border-border">
              <h3 className="font-display text-xl font-bold text-primary mb-6 border-b border-border pb-4">Categories</h3>
              <ul className="space-y-3">
                {['All News', 'Academic', 'Events', 'Alumni', 'Research', 'Sports'].map((cat) => (
                  <li key={cat}>
                    <button className="w-full flex justify-between items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                      {cat}
                      <span className="bg-white px-2 py-0.5 rounded text-xs">{(Math.random() * 20).toFixed(0)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.4} className="bg-primary rounded-2xl p-8 text-white text-center shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
              <h3 className="font-display text-2xl font-bold mb-4">Newsletter</h3>
              <p className="text-white/80 text-sm mb-6">Subscribe to our monthly newsletter to get the latest updates directly in your inbox.</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-accent"
                />
                <button className="w-full py-3 bg-accent text-primary font-bold rounded-lg hover:bg-yellow-400 transition-colors">
                  Subscribe
                </button>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
