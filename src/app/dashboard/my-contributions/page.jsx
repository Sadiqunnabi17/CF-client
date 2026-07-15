"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function MyContributionsContent() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/contributions/mine?page=${page}&limit=5`)
      .then((res) => {
        setContributions(res.data.contributions);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => toast.error("Failed to load contributions"))
      .finally(() => setLoading(false));
  }, [page]);

  if (user && user.role !== "Supporter") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Supporters can view this page.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Contributions</h1>
        <Link
          href="/explore"
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          Browse Campaigns
        </Link>
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : contributions.length === 0 ? (
        <p className="text-slate-500">No contributions yet.</p>
      ) : (
        <>
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
                {contributions.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-3">{c.campaign_title}</td>
                    <td className="p-3">{c.Contribution_amount}</td>
                    <td className="p-3">{c.creator_name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${c.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : c.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border px-3 py-1.5 rounded text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border px-3 py-1.5 rounded text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function MyContributionsPage() {
  return (
    <PrivateRoute>
      <MyContributionsContent />
    </PrivateRoute>
  );
}