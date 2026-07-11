"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function AdminHomeContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/users/stats")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (user && user.role !== "Admin") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Admins can view this page.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 mb-16">
      <h1 className="text-2xl font-bold mb-6">Admin Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalSupporters ?? 0}</p>
          <p className="text-slate-500 text-sm">Total Supporters</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalCreators ?? 0}</p>
          <p className="text-slate-500 text-sm">Total Creators</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalAvailableCredits ?? 0}</p>
          <p className="text-slate-500 text-sm">Total Available Credits</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalPaymentsProcessed ?? 0}</p>
          <p className="text-slate-500 text-sm">Payments Processed</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <PrivateRoute>
      <AdminHomeContent />
    </PrivateRoute>
  );
}