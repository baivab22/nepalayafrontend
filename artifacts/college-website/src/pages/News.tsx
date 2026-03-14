import { PageTransition } from "@/components/PageTransition";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function News() {
  const newsItems = [
    {
      title: "TCE Engineering Team Wins National Robotics Competition",
      date: "Baisakh 15, 2081",
      category: "Achievement",
      desc: "Our undergraduate computer engineering students secured the first position at the National Robotics Championship held in Kathmandu.",
    },
    {
      title: "New AI Research Lab Inaugurated",
      date: "Chaitra 20, 2080",
      category: "Campus Update",
      desc: "The honorable Minister of Education inaugurated our state-of-the-art AI and Data Science research facility at the Pulchowk campus.",
    },
    {
      title: "International Medical Conference 2024",
      date: "Chaitra 05, 2080",
      category: "Event",
      desc: "TCE hosted over 500 delegates from 12 countries for the annual medical symposium focusing on South Asian health challenges.",
    },
  ];

  return (
    <PageTransition>
      <div className="bg-slate-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-display font-black text-white mb-6"
          >
            News & Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-slate-300 max-w-2xl mx-auto font-light"
          >
            Stay updated with the latest happenings, achievements, and events from our vibrant campus.
          </motion.p>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((news, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer relative"
              >
                {/* Animated Gradient Border on Hover */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-primary to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                
                <div className="bg-white rounded-[22px] p-6 relative h-full flex flex-col z-10 border border-slate-100">
                  <div className="h-48 rounded-2xl bg-slate-100 mb-6 overflow-hidden relative">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-emerald-500/80 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {news.category}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {news.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors font-display leading-tight">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                    {news.desc}
                  </p>
                  <span className="text-primary font-medium inline-flex items-center group-hover:underline">
                    Read Full Story <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}