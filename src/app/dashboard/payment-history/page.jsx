"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function PaymentHistoryContent() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/withdrawals/mine")
      .then((res) => setWithdrawals(res.data))
      .catch(() => toast.error("Failed to load payment history"))
      .finally(() => setLoading(false));
  }, []);

  if (user && user.role !== "Creator") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Creators can view this page.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 mb-16">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      {withdrawals.length === 0 ? (
        <p className="text-slate-500">No withdrawal history yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Amount ($)</th>
                <th className="p-3">Payment System</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} className="border-t">
                  <td className="p-3">{new Date(w.withdraw_date).toLocaleDateString()}</td>
                  <td className="p-3">{w.withdrawal_credit}</td>
                  <td className="p-3">${w.withdrawal_amount.toFixed(2)}</td>
                  <td className="p-3">{w.payment_system}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        w.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {w.status}
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

export default function PaymentHistoryPage() {
  return (
    <PrivateRoute>
      <PaymentHistoryContent />
    </PrivateRoute>
  );
}