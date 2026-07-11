"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function ManageUsersContent() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    axiosInstance
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await axiosInstance.patch(`/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this user? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      toast.success("User removed");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Remove failed");
    }
  };

  if (user && user.role !== "Admin") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Admins can view this page.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 mb-16">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">
                  {u.photoURL ? (
                    <img src={u.photoURL} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                  )}
                </td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border p-1 rounded text-xs"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Creator">Creator</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </td>
                <td className="p-3">{u.credits}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => handleRemove(u._id)}
                    className="text-red-600 underline text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ManageUsersPage() {
  return (
    <PrivateRoute>
      <ManageUsersContent />
    </PrivateRoute>
  );
}