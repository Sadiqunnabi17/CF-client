"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function CampaignApprovalsTable() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = () => {
    axiosInstance
      .get("/campaigns/pending")
      .then((res) => setCampaigns(res.data))
      .catch(() => toast.error("Failed to load pending campaigns"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/campaigns/${id}/approve`);
      toast.success("Campaign approved");
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.patch(`/campaigns/${id}/reject`);
      toast.success("Campaign rejected");
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reject failed");
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
      <h1 className="text-2xl font-bold mb-6">Campaign Approvals</h1>

      {campaigns.length === 0 ? (
        <p className="text-slate-500">No pending campaigns.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Creator</th>
                <th className="p-3">Category</th>
                <th className="p-3">Goal</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.campaign_title}</td>
                  <td className="p-3">{c.creator_name}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3">{c.funding_goal}</td>
                  <td className="p-3">{new Date(c.deadline).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(c._id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded text-xs"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(c._id)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-xs"
                    >
                      Reject
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

export default function CampaignApprovalsPage() {
  return (
    <PrivateRoute>
      <CampaignApprovalsTable />
    </PrivateRoute>
  );
}