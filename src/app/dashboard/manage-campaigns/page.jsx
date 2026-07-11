"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function ManageCampaignsContent() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = () => {
    axiosInstance
      .get("/campaigns")
      .then((res) => setCampaigns(res.data))
      .catch(() => toast.error("Failed to load campaigns"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this campaign? Approved supporters will be refunded.")) return;
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      toast.success("Campaign deleted");
      fetchCampaigns();
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
      <h1 className="text-2xl font-bold mb-6">Manage Campaigns</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Creator</th>
              <th className="p-3">Status</th>
              <th className="p-3">Raised</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.campaign_title}</td>
                <td className="p-3">{c.creator_name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      c.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : c.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">{c.amount_raised}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 underline text-xs"
                  >
                    Delete
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

export default function ManageCampaignsPage() {
  return (
    <PrivateRoute>
      <ManageCampaignsContent />
    </PrivateRoute>
  );
}