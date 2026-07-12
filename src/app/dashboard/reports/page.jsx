"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function ReportsContent() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    axiosInstance
      .get("/reports")
      .then((res) => setReports(res.data))
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSuspend = async (id) => {
    try {
      await axiosInstance.patch(`/reports/${id}/suspend`);
      toast.success("Campaign suspended");
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || "Suspend failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this report and the reported campaign permanently?")) return;
    try {
      await axiosInstance.delete(`/reports/${id}`);
      toast.success("Campaign and report deleted");
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
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
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {reports.length === 0 ? (
        <p className="text-slate-500">No reports filed.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Reporter</th>
                <th className="p-3">Campaign</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-t align-top">
                  <td className="p-3">{r.reporter_name}</td>
                  <td className="p-3">{r.campaign_title}</td>
                  <td className="p-3 max-w-xs">{r.reason}</td>
                  <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSuspend(r._id)}
                      className="bg-yellow-600 text-white px-3 py-1.5 rounded text-xs"
                    >
                      Suspend
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r._id)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <PrivateRoute>
      <ReportsContent />
    </PrivateRoute>
  );
}