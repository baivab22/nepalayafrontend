import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

export function LocationMap() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-red-500 mr-2" />
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
              Our Location
            </h2>
          </div>
          <p className="text-lg text-slate-600">
            Kalanki 14, Kathmandu
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl h-96 sm:h-[500px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5289145821247!2d85.2849395!3d27.6946925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1865a59f34c7%3A0x626826d896ba7b9e!2sNEPALAYA%20SCHOOL!5e0!3m2!1sen!2snp!4v1717324800000!5m2!1sen!2snp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nepalaya School Location"
            className="w-full h-full"
          />
        </motion.div>

        {/* Location Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <MapPin className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Location</h3>
            <p className="text-slate-700">Kalanki 14, Kathmandu, Nepal</p>
          </div>

          <a
            href="https://www.google.com/maps/place/NEPALAYA+SCHOOL/@27.6946925,85.2849395,192m/data=!3m2!1e3!4b1!4m6!3m5!1s0x39eb1865a59f34c7:0x626826d896ba7b9e!8m2!3d27.6946912!4d85.2856246!16s%2Fg%2F12hksv12t?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Get Directions</h3>
                <p className="text-slate-700 text-sm">Open in Google Maps</p>
              </div>
              <ExternalLink className="w-5 h-5 text-red-600 flex-shrink-0" />
            </div>
          </a>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <h3 className="font-bold text-slate-900 mb-2">Established</h3>
            <p className="text-3xl font-black text-amber-600">1984</p>
            <p className="text-slate-700 text-sm mt-1">Est. Year</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
