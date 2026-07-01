import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

const API_URL = "https://nepalaya-apis.onrender.com";

export default function FacultyAdmin() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", description: "", department: "", photo: "", order: 0 });

  const fetchFaculty = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/faculty`);
    setFaculty(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleOpen = (fac?: any) => {
    if (fac) {
      setEditId(fac._id);
      setForm({ name: fac.name, role: fac.role, description: fac.description, department: fac.department, photo: fac.photo || "", order: fac.order || 0 });
    } else {
      setEditId(null);
      setForm({ name: "", role: "", description: "", department: "", photo: "", order: 0 });
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
    const url = editId ? `${API_URL}/faculty/${editId}` : `${API_URL}/faculty`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetchFaculty();
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this faculty member?")) return;
    await fetch(`${API_URL}/faculty/${id}`, { method: "DELETE" });
    fetchFaculty();
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Faculty</h1>
        <Button onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-2" /> Add Faculty</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? <div>Loading...</div> : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((fac: any) => (
                <tr key={fac._id} className="border-t">
                  <td className="py-2 font-semibold">{fac.name}</td>
                  <td>{fac.role}</td>
                  <td>{fac.department}</td>
                  <td>{fac.order}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpen(fac)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(fac._id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{editId ? "Edit Faculty" : "Add Faculty"}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <Input name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
            <Input name="department" value={form.department} onChange={handleChange} placeholder="Department" required />
            <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
            <Input name="photo" value={form.photo} onChange={handleChange} placeholder="Photo URL (optional)" />
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
