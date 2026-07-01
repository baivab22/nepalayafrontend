import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, Users, ArrowRight, Loader2 } from "lucide-react";

const API_URL = "https://nepalaya-apis.onrender.com";

interface SearchResult {
  id: string;
  type: "program" | "faculty";
  title: string;
  subtitle?: string;
  url: string;
  icon: typeof BookOpen | typeof Users;
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const programsCache = useRef<SearchResult[]>([]);
  const facultyCache = useRef<SearchResult[]>([]);
  const cached = useRef(false);

  useEffect(() => {
    if (!open) { setQuery(""); setResults([]); return; }
    setSelectedIdx(0);
    setTimeout(() => inputRef.current?.focus(), 100);
    if (!cached.current) {
      setLoading(true);
      Promise.all([
        fetch(`${API_URL}/api/programs`).then((r) => r.json()),
        fetch(`${API_URL}/api/faculty`).then((r) => r.json()),
      ])
        .then(([progData, facData]) => {
          const rawProgs = Array.isArray(progData) ? progData : progData?.programs || [];
          const rawFacs = Array.isArray(facData) ? facData : [];
          programsCache.current = rawProgs.map((p: any) => ({
            id: p._id,
            type: "program" as const,
            title: p.title || "Untitled Program",
            subtitle: p.level || "Program",
            url: `/programs/${p._id}`,
            icon: BookOpen,
          }));
          facultyCache.current = rawFacs.map((f: any) => ({
            id: f._id,
            type: "faculty" as const,
            title: f.name || f.title || "Untitled",
            subtitle: f.role || f.department || "Faculty",
            url: `/faculty/${f._id}`,
            icon: Users,
          }));
          cached.current = true;
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [open]);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); setSelectedIdx(0); return; }
    const lower = q.toLowerCase();
    const all = [...programsCache.current, ...facultyCache.current];
    const filtered = all.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(lower))
    );
    setResults(filtered);
    setSelectedIdx(0);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      window.location.href = results[selectedIdx].url;
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0" strokeWidth={2.5} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => search(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search programs, faculty, and more..."
                className="flex-1 text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-0 outline-none focus:ring-0"
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }} className="text-slate-300 hover:text-slate-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-100 rounded-md border border-slate-200">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="py-10 text-center">
                  <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-slate-400">No results for "{query}"</p>
                  <p className="text-xs text-slate-300 mt-1">Try searching for programs or faculty members</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {results.length} result{results.length !== 1 ? "s" : ""}
                  </div>
                  {results.map((r, i) => {
                    const Icon = r.icon;
                    const isSelected = i === selectedIdx;
                    return (
                      <Link key={`${r.type}-${r.id}`} href={r.url}>
                        <div
                          onClick={onClose}
                          onMouseEnter={() => setSelectedIdx(i)}
                          className={`flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer ${
                            isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            r.type === "program"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}>
                            <Icon className="w-5 h-5" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${
                              isSelected ? "text-indigo-600" : "text-slate-900"
                            }`}>
                              {r.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{r.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-medium uppercase tracking-wider ${
                              r.type === "program" ? "text-blue-500" : "text-emerald-500"
                            }`}>
                              {r.type}
                            </span>
                            <ArrowRight className={`w-4 h-4 ${
                              isSelected ? "text-indigo-400" : "text-slate-300"
                            }`} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {!loading && !query && (
                <div className="py-8 px-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Quick Links
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/programs">
                      <span onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer text-sm font-medium text-slate-700 hover:text-blue-600">
                        <BookOpen className="w-4 h-4" strokeWidth={2} />
                        Browse Programs
                      </span>
                    </Link>
                    <Link href="/faculty">
                      <span onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer text-sm font-medium text-slate-700 hover:text-emerald-600">
                        <Users className="w-4 h-4" strokeWidth={2} />
                        View Faculty
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono">⏎</kbd>
                Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono">Esc</kbd>
                Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
