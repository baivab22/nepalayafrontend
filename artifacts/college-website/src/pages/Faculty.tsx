import { PageTransition, FadeIn } from "@/components/PageTransition";
import { faculty } from "@/lib/data";
import { Search, Mail, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Faculty() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      {/* Header */}
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Our Faculty
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Learn from distinguished academics and industry professionals.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Search */}
        <FadeIn className="max-w-xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg shadow-sm"
            />
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredFaculty.map((person, idx) => (
            <FadeIn key={person.id} delay={idx * 0.1}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border group hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent transition-colors">
                        <Mail className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-5 text-center border-t border-border">
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">{person.name}</h3>
                  <p className="text-accent font-semibold text-sm mb-1">{person.designation}</p>
                  <p className="text-muted-foreground text-xs">{person.department}</p>
                  <p className="text-muted-foreground text-xs mt-2 italic">{person.education}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        
        {filteredFaculty.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No faculty members found matching "{searchTerm}"
          </div>
        )}

      </div>
    </PageTransition>
  );
}
