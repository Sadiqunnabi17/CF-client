"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function WithdrawalRequestsContent() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = () => {
    axiosInstance
      .get("/withdrawals/pending")
      .then((res) => setWithdrawals(res.data))
      .catch(() => toast.error("Failed to load withdrawal requests"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/withdrawals/${id}/approve`);
      toast.success("Payment marked successful");
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approve failed");
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
      <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>

      {withdrawals.length === 0 ? (
        <p className="text-slate-500">No pending withdrawal requests.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Creator</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Amount ($)</th>
                <th className="p-3">Payment System</th>
                <th className="p-3">Account</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} className="border-t">
                  <td className="p-3">{w.creator_name}</td>
                  <td className="p-3">{w.withdrawal_credit}</td>
                  <td className="p-3">${w.withdrawal_amount.toFixed(2)}</td>
                  <td className="p-3">{w.payment_system}</td>
                  <td className="p-3">{w.account_number}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleApprove(w._id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded text-xs"
                    >
                      Payment Success
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

export default function WithdrawalRequestsPage() {
  return (
    <PrivateRoute>
      <WithdrawalRequestsContent />
    </PrivateRoute>
  );
}