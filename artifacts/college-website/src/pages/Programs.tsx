import { PageTransition, FadeIn } from "@/components/PageTransition";
import { programs } from "@/lib/data";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

export default function Programs() {
  const [filter, setFilter] = useState("All");

  const filteredPrograms = filter === "All" 
    ? programs 
    : programs.filter(p => p.level.includes(filter));

  return (
    <PageTransition>
      {/* Header */}
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Academic Programs
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Explore our diverse range of undergraduate and graduate degree programs.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Filters & Search */}
        <FadeIn className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex gap-2 p-1 bg-secondary rounded-lg border border-border">
            {["All", "Bachelor's", "Master's"].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  filter === level 
                    ? "bg-white shadow-sm text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search programs..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program, idx) => (
            <FadeIn key={program.id} delay={idx * 0.1}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col group">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-secondary text-primary text-xs font-bold rounded-full mb-4">
                    {program.level}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                    {program.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm flex-1 mb-6">
                  {program.description}
                </p>
                <div className="pt-6 border-t border-border mt-auto flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium">4 Years Duration</span>
                  <button className="text-primary font-bold text-sm hover:underline">
                    View Details
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
