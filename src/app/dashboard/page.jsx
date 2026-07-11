"use client";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Dashboard (placeholder)</h1>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Credits:</strong> {user?.credits}</p>

        {user?.role === "Creator" && (
          <>
            <Link
              href="/dashboard/add-campaign"
              className="inline-block mt-4 mr-3 bg-slate-900 text-white px-4 py-2 rounded"
            >
              Add New Campaign
            </Link>

            <Link
              href="/dashboard/my-campaigns"
              className="inline-block mt-4 mr-3 border px-4 py-2 rounded"
            >
              My Campaigns
            </Link>
            <Link
              href="/dashboard/creator-home"
              className="inline-block mt-4 mr-3 border px-4 py-2 rounded"
            >
              Contributions To Review
            </Link>
            <Link
              href="/dashboard/withdrawals"
              className="inline-block mt-4 mr-3 border px-4 py-2 rounded"
            >
              Withdrawals
            </Link>
            <Link
              href="/dashboard/payment-history"
              className="inline-block mt-4 mr-3 border px-4 py-2 rounded"
            >
              Payment History
            </Link>
          </>
        )}

        {user?.role === "Admin" && (
          <>
            <Link href="/dashboard/admin-home" className="inline-block mt-4 mr-3 border px-4 py-2 rounded">
              Admin Home
            </Link>
            <Link href="/dashboard/campaign-approvals" className="inline-block mt-4 mr-3 border px-4 py-2 rounded">
              Campaign Approvals
            </Link>
            <Link href="/dashboard/withdrawal-requests" className="inline-block mt-4 mr-3 border px-4 py-2 rounded">
              Withdrawal Requests
            </Link>
            <Link href="/dashboard/manage-users" className="inline-block mt-4 mr-3 border px-4 py-2 rounded">
              Manage Users
            </Link>
            <Link href="/dashboard/manage-campaigns" className="inline-block mt-4 mr-3 border px-4 py-2 rounded">
              Manage Campaigns
            </Link>
           </> 
        )}

            <button onClick={logoutUser} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
              Logout
            </button>
          </div>
    </PrivateRoute>
  );
}