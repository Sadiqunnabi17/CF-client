"use client";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6 border rounded-lg mb-16">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Dashboard (placeholder)</h1>
        <div className="text-sm sm:text-base space-y-1">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Credits:</strong> {user?.credits}</p>
        </div>

        {user?.role === "Creator" && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
            <Link
              href="/dashboard/add-campaign"
              className="bg-slate-900 text-white px-3 py-2 sm:px-4 rounded text-sm"
            >
              Add New Campaign
            </Link>
            <Link
              href="/dashboard/my-campaigns"
              className="border px-3 py-2 sm:px-4 rounded text-sm"
            >
              My Campaigns
            </Link>
            <Link
              href="/dashboard/creator-home"
              className="border px-3 py-2 sm:px-4 rounded text-sm"
            >
              Contributions To Review
            </Link>
            <Link
              href="/dashboard/withdrawals"
              className="border px-3 py-2 sm:px-4 rounded text-sm"
            >
              Withdrawals
            </Link>
            <Link
              href="/dashboard/payment-history"
              className="border px-3 py-2 sm:px-4 rounded text-sm"
            >
              Payment History
            </Link>
          </div>
        )}

        {user?.role === "Admin" && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
            <Link href="/dashboard/admin-home" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Admin Home
            </Link>
            <Link href="/dashboard/campaign-approvals" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Campaign Approvals
            </Link>
            <Link href="/dashboard/withdrawal-requests" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Withdrawal Requests
            </Link>
            <Link href="/dashboard/manage-users" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Manage Users
            </Link>
            <Link href="/dashboard/manage-campaigns" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Manage Campaigns
            </Link>
            <Link href="/dashboard/reports" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Reports
            </Link>
          </div>
        )}

        {user?.role === "Supporter" && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
            <Link href="/dashboard/supporter-home" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Supporter Home
            </Link>
            <Link href="/dashboard/my-contributions" className="border px-3 py-2 sm:px-4 rounded text-sm">
              My Contributions
            </Link>
            <Link href="/dashboard/purchase-credit" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Purchase Credit
            </Link>
            <Link href="/dashboard/payment-history" className="border px-3 py-2 sm:px-4 rounded text-sm">
              Payment History
            </Link>
          </div>
        )}

        <button
          onClick={logoutUser}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </PrivateRoute>
  );
}