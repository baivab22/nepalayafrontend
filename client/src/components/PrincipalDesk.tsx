import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, X } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function PrincipalDesk() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const openLightbox = useCallback((src: string, alt: string) => setLightbox({ src, alt }), []);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="will-change-transform"
        >
          <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
            Principal's Desk
          </h4>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-8 sm:mb-12">
            From the Desk of the Principal
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="shrink-0 mx-auto sm:mx-0">
                <button
                  onClick={() => openLightbox(`${BASE}images/principle.jpg`, "Jit Bahadur Lamichhane")}
                  className="block w-40 h-48 sm:w-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <img
                    src={`${BASE}images/principle.jpg`}
                    alt="Jit Bahadur Lamichhane"
                    width={176}
                    height={208}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-lg font-display font-semibold text-slate-900 italic">
                    Dear Students,
                  </p>
                </div>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Welcome at <span className="text-primary font-semibold">Nepalaya</span>: Your Local{" "}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-primary/5 text-primary font-semibold italic text-sm sm:text-base">
                    "GLOBAL SCHOOL"
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                I am personally committed to establish unique learning culture at Nepalaya. By choosing Nepalaya, you have already discovered an academic success and secured your career path for the dream profession that you have always thought of in your life.
              </p>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                We have a tradition of welcoming those with varied backgrounds and skills and treating them fairly and equally. We believe every student can achieve academic success and we have an extensive pastoral care network to help them to achieve their potential. We place great importance on students being engaged in their learning and developing a pathway through their college career that sets them up for success in their future. We are undertaking several initiatives to create supportive and nurturing learning environment. You will grow in an institutional culture and prepare yourself as a successful person in future.
              </p>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                I am truly excited to accompany each one of you on this journey of transformation—helping ordinary individuals like yourselves become successful, extraordinary individuals. I believe in your potential and look forward to seeing you all achieve great things. Wishing you all a bright and prosperous future ahead. Thank You!
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100">
              <p className="text-xl font-display font-bold text-slate-900">
                Jit Bahadur Lamichhane
              </p>
              <p className="text-base text-slate-500 font-medium">
                Principal
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100">
              <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">
                Board Members
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">GP</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Govinda Pd. Paudyal</p>
                    <p className="text-sm text-slate-500 font-medium">Chairman</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-emerald-50 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">PR</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Pushkal Raj Pant</p>
                    <p className="text-sm text-slate-500 font-medium">CEO / Founder Principal</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => openLightbox(`${BASE}images/bijaya.jpeg`, "Bijay Moktan")}
                    className="flex items-center gap-4 w-full text-left group"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <img
                        src={`${BASE}images/bijaya.jpeg`}
                        alt="Bijay Moktan"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Bijay Moktan</p>
                      <p className="text-sm text-slate-500 font-medium">Director</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <a
                  href="https://www.nepalaya.edu.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:text-primary/80 transition-colors text-sm"
                >
                  www.nepalaya.edu.np
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
