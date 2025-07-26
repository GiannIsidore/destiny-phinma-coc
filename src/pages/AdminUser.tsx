import React, { useEffect, useState } from "react";
import { userAPI, authAPI, UserData } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export interface UserRow extends UserData {
  id: number;
  status: number;
}

const initialForm: UserRow & { password?: string } = {
  id: 0,
  school_id: "",
  fname: "",
  lname: "",
  mname: "",
  suffix: "",
  extension: "",
  status: 1,
  password: ""
};

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userAPI.getUsers();
      if (res.data.status === "success") {
        setUsers(res.data.data as UserRow[]);
      } else {
        setError(res.data.message || "Failed to fetch users");
      }
    } catch (e) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setFormError("");
    setSuccess("");
     if (!form.school_id || !form.fname || !form.lname || !form.password) {
      setFormError("User ID, First Name, Last Name, and Password are required.");
      return;
    }
    setLoading(true);
    try {
      // Check for duplicate school_id
      if (users.some((u) => u.school_id === form.school_id)) {
        setFormError("User ID already exists.");
        setLoading(false);
        return;
      }      const result = await authAPI.signup(form);
      if (result.data.status === "success") {
        setSuccess("User added successfully");
        setShowAdd(false);
        fetchUsers();
        setForm(initialForm);
      } else {
        setFormError(result.data.message || "Failed to add user");
      }
    } catch (e) {
      setFormError("Failed to add user");
    }
    setLoading(false);
  };

  const handleEdit = (user: UserRow) => {
    setForm({ ...user, password: "" });
    setShowEdit(true);
    setFormError("");
    setSuccess("");
  };

  const handleUpdate = async () => {
    setFormError("");
    setSuccess("");
    if (!form.fname || !form.lname) {
      setFormError("First Name and Last Name are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await userAPI.updateUser(form);
      if (res.data.status === "success") {
        setSuccess("User updated successfully");
        setShowEdit(false);
        fetchUsers();
        setForm(initialForm);
      } else {
        setFormError(res.data.message || "Failed to update user");
      }
    } catch (e) {
      setFormError("Failed to update user");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(id);
    setError("");
    setSuccess("");
    try {
      const res = await userAPI.deleteUser(id);
      if (res.data.status === "success") {
        setSuccess("User deleted successfully");
        fetchUsers();
      } else {
        setError(res.data.message || "Failed to delete user");
      }
    } catch (e) {
      setError("Failed to delete user");
    }
    setDeletingId(null);
  };

  const filteredUsers = users.filter((u) =>
    u.school_id.toLowerCase().includes(search.toLowerCase()) ||
    u.fname.toLowerCase().includes(search.toLowerCase()) ||
    u.lname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
<Input
             placeholder="Search by User ID or Name"
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="max-w-xs"
           />          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button onClick={() => { setForm(initialForm); setFormError(""); }}>Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
              </DialogHeader>
              <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
                <div className="grid gap-3 mb-4">
                  <Label>School ID*</Label>
                  <Input name="school_id" value={form.school_id} onChange={handleInput} required />
                  <Label>First Name*</Label>
                  <Input name="fname" value={form.fname} onChange={handleInput} required />
                  <Label>Last Name*</Label>
                  <Input name="lname" value={form.lname} onChange={handleInput} required />
                  <Label>Middle Name</Label>
                  <Input name="mname" value={form.mname} onChange={handleInput} />
                  <Label>Suffix</Label>
                  <Input name="suffix" value={form.suffix} onChange={handleInput} />
                  <Label>Extension</Label>
                  <Input name="extension" value={form.extension} onChange={handleInput} />
                  <Label>Password*</Label>
                  <Input name="password" type="password" value={form.password} onChange={handleInput} required />
                </div>
                {formError && <div className="text-red-500 mb-2">{formError}</div>}
                <DialogFooter>
                  <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add User"}</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">School ID</th>
                <th className="p-2 text-left">First Name</th>
                <th className="p-2 text-left">Last Name</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center">No users found.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="p-2">{user.school_id}</td>
                  <td className="p-2">{user.fname}</td>
                  <td className="p-2">{user.lname}</td>
                  <td className="p-2">{user.status === 1 ? "Active" : "Inactive"}</td>
                  <td className="p-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)} disabled={deletingId === user.id}>{deletingId === user.id ? "Deleting..." : "Delete"}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
              <div className="grid gap-3 mb-4">
                <Label>School ID</Label>
                <Input name="school_id" value={form.school_id} disabled />
                <Label>First Name*</Label>
                <Input name="fname" value={form.fname} onChange={handleInput} required />
                <Label>Last Name*</Label>
                <Input name="lname" value={form.lname} onChange={handleInput} required />
                <Label>Middle Name</Label>
                <Input name="mname" value={form.mname} onChange={handleInput} />
                <Label>Suffix</Label>
                <Input name="suffix" value={form.suffix} onChange={handleInput} />
                <Label>Extension</Label>
                <Input name="extension" value={form.extension} onChange={handleInput} />
                <Label>Status</Label>
                <select name="status" value={form.status} onChange={handleInput} className="border rounded-md p-2">
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              {formError && <div className="text-red-500 mb-2">{formError}</div>}
              <DialogFooter>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;
