import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

const API_URL = "https://nepalaya-apis.onrender.com";

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "", order: 0 });

  const fetchPrograms = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/programs`);
    setPrograms(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleOpen = (prog?: any) => {
    if (prog) {
      setEditId(prog._id);
      setForm({ title: prog.title, description: prog.description, icon: prog.icon || "", order: prog.order || 0 });
    } else {
      setEditId(null);
      setForm({ title: "", description: "", icon: "", order: 0 });
    }
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); setEditId(null); };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/programs/${editId}` : `${API_URL}/programs`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetchPrograms();
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this program?")) return;
    await fetch(`${API_URL}/programs/${id}`, { method: "DELETE" });
    fetchPrograms();
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Programs</h1>
        <Button onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-2" /> Add Program</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? <div>Loading...</div> : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Title</th>
                <th>Description</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {programs.map((prog: any) => (
                <tr key={prog._id} className="border-t">
                  <td className="py-2 font-semibold">{prog.title}</td>
                  <td>{prog.description}</td>
                  <td>{prog.order}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpen(prog)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(prog._id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{editId ? "Edit Program" : "Add Program"}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
            <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
            <Input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (optional)" />
            <Input name="order" type="number" value={form.order} onChange={handleChange} placeholder="Order" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit">{editId ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
