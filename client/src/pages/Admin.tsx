import { useState, useMemo, useEffect } from "react";
import { Switch, Route, useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAdmissions,
  getGetAdmissionsQueryKey,
  type AdmissionApplicationResponse,
} from "@/lib/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, LogOut, Search, Eye, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Import admin subpages
import AdminDashboard from "./admin/Dashboard";
import AdminPrograms from "./admin/Programs";
import AdminFaculty from "./admin/Faculty";
import AdminNews from "./admin/News";
import AdminAdmissions from "./admin/Admissions";
import AdminModelImage from "./admin/ModelImage";
import AdminGallery from "./admin/Gallery";
import AdminSlider from "./admin/Slider";
import ModelImageUpload from "@/components/ModelImageUpload";

const ADMIN_PASSWORD = "admin@nepalaya2025";
const AUTH_KEY = "nepalaya_admin_auth";

type Status = "pending" | "accepted" | "rejected";

function statusBadge(status: string) {
  if (status === "accepted")
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
  if (status === "rejected")
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
  return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
}

// ─── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-3xl overflow-hidden bg-white shadow-xl">
            <img src="/images/nepalayalogo.png" alt="Nepalaya Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-sm text-slate-500">Nepalaya Educational Foundation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter admin password"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-600">Incorrect password. Try again.</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────
function DetailDialog({
  admission,
  open,
  onClose,
}: {
  admission: AdmissionApplicationResponse | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!admission) return null;

  const fields: [string, string | undefined][] = [
    ["Full Name", `${admission.firstName} ${admission.lastName}`],
    ["Email", admission.email],
    ["Phone", admission.phone],
    ["Date of Birth", admission.dateOfBirth],
    ["Gender", admission.gender],
    ["Address", admission.address],
    ["District", admission.district],
    ["Program", admission.program],
    ["Level", admission.level],
    ["Previous School", admission.previousSchool],
    ["GPA", admission.gpa],
    ["Message", admission.message],
    ["Status", admission.status],
    ["Submitted", new Date(admission.createdAt).toLocaleString()],
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Application — {admission.firstName} {admission.lastName}
          </DialogTitle>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mt-2">
          {fields.map(([label, value]) =>
            value ? (
              <div key={label} className={label === "Message" || label === "Address" ? "col-span-2" : ""}>
                <dt className="font-medium text-slate-500">{label}</dt>
                <dd className="text-slate-900 mt-0.5 capitalize">{value}</dd>
              </div>
            ) : null,
          )}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, refetch } = useGetAdmissions();
  const admissions = Array.isArray(data) ? data : [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [viewAdmission, setViewAdmission] = useState<AdmissionApplicationResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdmissionApplicationResponse | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return admissions.filter((a) => {
      const matchSearch =
        search === "" ||
        `${a.firstName} ${a.lastName} ${a.email} ${a.program}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [admissions, search, statusFilter]);

  const updateStatus = async (id: string, status: Status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      await queryClient.invalidateQueries({ queryKey: getGetAdmissionsQueryKey() });
      toast({ title: "Status updated", description: `Application marked as ${status}.` });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteAdmission = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/api/admissions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      await queryClient.invalidateQueries({ queryKey: getGetAdmissionsQueryKey() });
      toast({ title: "Deleted", description: "Application removed successfully." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete application." });
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const counts = useMemo(() => ({
    total: admissions.length,
    pending: admissions.filter((a) => a.status === "pending").length,
    accepted: admissions.filter((a) => a.status === "accepted").length,
    rejected: admissions.filter((a) => a.status === "rejected").length,
  }), [admissions]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Model Image Upload Section */}
      <div className="max-w-2xl mx-auto mt-6 mb-6">
        <ModelImageUpload />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Admin Panel</h1>
            <p className="text-xs text-slate-500">Admissions Management</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-600">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: counts.total, color: "text-slate-900" },
            { label: "Pending", value: counts.pending, color: "text-amber-600" },
            { label: "Accepted", value: counts.accepted, color: "text-green-600" },
            { label: "Rejected", value: counts.rejected, color: "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, program…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | Status)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="shrink-0">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              Loading applications…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="text-sm">No applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium">
                        {a.firstName} {a.lastName}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">{a.email}</TableCell>
                      <TableCell className="text-sm">{a.program}</TableCell>
                      <TableCell className="text-sm capitalize">{a.level}</TableCell>
                      <TableCell>
                        <Select
                          value={a.status}
                          onValueChange={(v) => updateStatus(a.id, v as Status)}
                          disabled={updatingId === a.id}
                        >
                          <SelectTrigger className="h-7 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-primary"
                            onClick={() => setViewAdmission(a)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-red-600"
                            onClick={() => setDeleteTarget(a)}
                            disabled={deletingId === a.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Dialog */}
      <DetailDialog
        admission={viewAdmission}
        open={!!viewAdmission}
        onClose={() => setViewAdmission(null)}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the application from{" "}
              <strong>
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteTarget && deleteAdmission(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [location, setLocation] = useLocation();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  // Sidebar navigation links
  const nav = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Programs", path: "/admin/programs" },
    { label: "Faculty", path: "/admin/faculty" },
    { label: "News", path: "/admin/news" },
    { label: "Gallery", path: "/admin/gallery" },
    { label: "Admissions", path: "/admin/admissions" },
    { label: "Model Image", path: "/admin/model-image" },
    { label: "Slider", path: "/admin/slider" },
  ];

  // Default to dashboard if at /admin
  if (location === "/admin") setLocation("/admin/dashboard");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col">
        <div className="h-20 flex items-center justify-center font-bold text-xl text-primary border-b border-slate-100">Nepalaya Admin</div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-primary/10 ${location === item.path ? "bg-primary/10 text-primary" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button className="w-full py-2 rounded-lg bg-slate-100 text-slate-600 font-medium hover:bg-slate-200" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <Switch>
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/programs" component={AdminPrograms} />
          <Route path="/admin/faculty" component={AdminFaculty} />
          <Route path="/admin/news" component={AdminNews} />
          <Route path="/admin/gallery" component={AdminGallery} />
          <Route path="/admin/admissions" component={AdminAdmissions} />
          <Route path="/admin/model-image" component={AdminModelImage} />
          <Route path="/admin/slider" component={AdminSlider} />
          <Route> <div className="p-8">Not found</div> </Route>
        </Switch>
      </main>
    </div>
  );
}
