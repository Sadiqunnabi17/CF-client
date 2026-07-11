"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function ContributionModal({ contribution, onClose }) {
  if (!contribution) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-lg mb-3">Contribution Detail</h3>
        <p><strong>Supporter:</strong> {contribution.Supporter_name}</p>
        <p><strong>Campaign:</strong> {contribution.campaign_title}</p>
        <p><strong>Amount:</strong> {contribution.Contribution_amount} credits</p>
        <p className="text-slate-500 text-sm mt-2">
          Submitted {new Date(contribution.createdAt).toLocaleString()}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 border px-4 py-2 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function CreatorHomeContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);

  const fetchAll = () => {
    Promise.all([
      axiosInstance.get("/campaigns/stats/mine"),
      axiosInstance.get("/contributions/pending-for-creator"),
    ])
      .then(([statsRes, contribRes]) => {
        setStats(statsRes.data);
        setContributions(contribRes.data);
      })
      .catch(() => toast.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/contributions/${id}/approve`);
      toast.success("Contribution approved");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.patch(`/contributions/${id}/reject`);
      toast.success("Contribution rejected, Supporter refunded");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reject failed");
    }
  };

  if (user && user.role !== "Creator") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Creators can view this page.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 mb-16">
      <h1 className="text-2xl font-bold mb-6">Creator Home</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalCampaigns ?? 0}</p>
          <p className="text-slate-500 text-sm">Total Campaigns</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.activeCampaigns ?? 0}</p>
          <p className="text-slate-500 text-sm">Active Campaigns</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalRaised ?? 0}</p>
          <p className="text-slate-500 text-sm">Total Raised (credits)</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Contributions To Review</h2>

      {contributions.length === 0 ? (
        <p className="text-slate-500">No pending contributions.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Supporter</th>
                <th className="p-3">Campaign</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Details</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.Supporter_name}</td>
                  <td className="p-3">{c.campaign_title}</td>
                  <td className="p-3">{c.Contribution_amount}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => setViewing(c)}
                      className="underline text-xs text-slate-700"
                    >
                      View Contribution
                    </button>
                  </td>
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

      <ContributionModal contribution={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

export default function CreatorHomePage() {
  return (
    <PrivateRoute>
      <CreatorHomeContent />
    </PrivateRoute>
  );
}