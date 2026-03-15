import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAdmissions,
  getGetAdmissionsQueryKey,
  type AdmissionApplicationResponse,
} from "@workspace/api-client-react";
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

const ADMIN_PASSWORD = "admin@tce2025";
const AUTH_KEY = "tce_admin_auth";

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
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-sm text-slate-500">Tribhuvan College of Excellence</p>
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
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-violet-600 text-white">
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
  const { data: admissions = [], isLoading, refetch } = useGetAdmissions();

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
      const res = await fetch(`/api/admissions/${id}`, {
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
      const res = await fetch(`/api/admissions/${id}`, { method: "DELETE" });
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white">
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
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1",
  );

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={handleLogout} />;
}
