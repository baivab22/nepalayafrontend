import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Mail, Phone, GraduationCap, BookOpen, Award, Users, Building2, Calendar, ArrowLeft, MapPin, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface Faculty {
  _id: string;
  name: string;
  role: string;
  description: string;
  department: string;
  photo: string;
  email?: string;
  phone?: string;
  qualifications?: string[];
  expertise?: string[];
  joinedDate?: string;
}

const getInitials = (name: string) => {
  if (!name) return "?";
  return name.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2);
};

const getRoleIcon = (role: string) => {
  const r = role?.toLowerCase() || "";
  if (r.includes("professor")) return <GraduationCap className="w-5 h-5" />;
  if (r.includes("lecturer")) return <BookOpen className="w-5 h-5" />;
  if (r.includes("dean") || r.includes("head")) return <Award className="w-5 h-5" />;
  return <Users className="w-5 h-5" />;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function FacultyDetail() {
  const { id } = useParams<{ id: string }>();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  const getPhotoUrl = (photo: string) => {
    if (!photo) return null;
    if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
    if (photo.startsWith("/api/")) return `${API_URL}${photo}`;
    return `${API_URL}/api/faculty/photo/${photo}`;
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/faculty/${id}`)
      .then(res => res.json())
      .then(data => {
        setFaculty(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-slate-200 rounded" />
              <div className="flex gap-8 flex-col md:flex-row">
                <div className="w-64 h-64 bg-slate-100 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-4">
                  <div className="h-10 w-64 bg-slate-200 rounded" />
                  <div className="h-6 w-40 bg-slate-100 rounded" />
                  <div className="h-4 w-full bg-slate-100 rounded" />
                  <div className="h-4 w-3/4 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!faculty) {
    return (
      <PageTransition>
        <div className="pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-500">Faculty member not found.</p>
            <Link href="/faculty" className="text-primary hover:underline mt-4 inline-block">Back to Faculty</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-28 pb-20 bg-slate-50/50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/faculty" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
            Back to Faculty
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-28">
                <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center overflow-hidden">
                  {faculty.photo ? (
                    <img
                      src={getPhotoUrl(faculty.photo) || ""}
                      alt={faculty.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                      <span className="text-7xl font-bold text-slate-400">{getInitials(faculty.name)}</span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{faculty.name}</h1>
                    <div className="flex items-center gap-1.5 text-primary font-medium text-sm">
                      {getRoleIcon(faculty.role)}
                      <span>{faculty.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2} />
                    <span>{faculty.department}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    {faculty.email && (
                      <a href={`mailto:${faculty.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Mail className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <span className="truncate">{faculty.email}</span>
                      </a>
                    )}
                    {faculty.phone && (
                      <a href={`tel:${faculty.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <Phone className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <span>{faculty.phone}</span>
                      </a>
                    )}
                    {faculty.joinedDate && formatDate(faculty.joinedDate) && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                          <Calendar className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <span>Joined {formatDate(faculty.joinedDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <a href={`mailto:${faculty.email || "info@nepalayaedufoundation.edu.np"}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl h-11">
                        <Mail className="w-4 h-4 mr-2" strokeWidth={2.5} />
                        Send Message
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {faculty.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Quote className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">About</h2>
                      <p className="text-sm text-slate-500">Biography & background</p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[15px]">{faculty.description}</p>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {faculty.qualifications && faculty.qualifications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <GraduationCap className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">Qualifications</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {faculty.qualifications.map((qual, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 text-sm px-3 py-1.5 font-medium">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                {faculty.expertise && faculty.expertise.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                        <Award className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">Expertise</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {faculty.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="outline" className="border-primary/20 text-primary bg-primary/5 text-sm px-3 py-1.5 font-medium">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-3"
              >
                <Link href="/faculty">
                  <Button variant="outline" className="rounded-xl h-11 border-slate-200">
                    <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
                    All Faculty
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
