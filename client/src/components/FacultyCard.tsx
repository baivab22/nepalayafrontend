import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface Faculty {
  _id?: string;
  name: string;
  role: string;
  department: string;
  description?: string;
  photo?: string;
}

interface FacultyCardProps {
  faculty: Faculty;
  getPhotoUrl: (photo: string) => string;
  showViewAll?: boolean;
}

const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function FacultyCard({
  faculty: f,
  getPhotoUrl,
  showViewAll = false,
}: FacultyCardProps) {
  const card = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative w-full h-full bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary/20 shadow-sm transition-all duration-300 cursor-pointer"
    >
      <div className="px-6 pt-10 pb-6 flex flex-col items-center text-center h-full">
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-44 sm:h-44 overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center relative">
            {f.photo ? (
              <img
                src={getPhotoUrl(f.photo)}
                alt={f.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <span className="text-3xl font-bold text-slate-400">
                {getInitials(f.name)}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {f.name}
        </h3>

        <p className="text-base font-semibold text-slate-600 mb-3">
          {f.role}
        </p>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 text-[11px] font-semibold text-slate-400 border border-slate-100">
          {f.department}
        </span>

        {f.description && (
          <div className="mt-4 pt-4 border-t border-slate-100 w-full flex-1">
            <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
              {f.description}
            </p>
          </div>
        )}

        <div className={f.description ? "" : "flex-1"} />

        {showViewAll && (
          <div className="mt-auto pt-4 w-full">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-primary transition-colors duration-300">
              View Full Profile <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (f._id) {
    return (
      <Link href={`/faculty/${f._id}`} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
