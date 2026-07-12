"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function SupporterHomeContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/contributions/stats/mine"),
      axiosInstance.get("/contributions/approved/mine"),
    ])
      .then(([statsRes, approvedRes]) => {
        setStats(statsRes.data);
        setApproved(approvedRes.data);
      })
      .catch(() => toast.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (user && user.role !== "Supporter") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Supporters can view this page.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 mb-16">
      <h1 className="text-2xl font-bold mb-6">Supporter Home</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalContributions ?? 0}</p>
          <p className="text-slate-500 text-sm">Total Contributions</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalPending ?? 0}</p>
          <p className="text-slate-500 text-sm">Pending Contributions</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalAmountContributed ?? 0}</p>
          <p className="text-slate-500 text-sm">Total Amount Contributed</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Approved Contributions</h2>
      {approved.length === 0 ? (
        <p className="text-slate-500">No approved contributions yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Campaign</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Creator</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.campaign_title}</td>
                  <td className="p-3">{c.Contribution_amount}</td>
                  <td className="p-3">{c.creator_name}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      {c.status}
                    </span>
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

export default function SupporterHomePage() {
  return (
    <PrivateRoute>
      <SupporterHomeContent />
    </PrivateRoute>
  );
}