"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => setError("Campaign not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContribute = async () => {
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Supporter") {
      setError("Only Supporters can contribute to campaigns.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid contribution amount.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post("/contributions", {
        campaign_id: id,
        Contribution_amount: Number(amount),
      });
      toast.success("Contribution submitted! Awaiting Creator approval.");
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Contribution failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Supporter") {
      toast.error("Only Supporters can report campaigns.");
      return;
    }
    if (!reportReason.trim()) {
      toast.error("Enter a reason for reporting.");
      return;
    }

    setReportSubmitting(true);
    try {
      await axiosInstance.post("/reports", {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        reason: reportReason,
      });
      toast.success("Report submitted to Admin");
      setShowReportForm(false);
      setReportReason("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!campaign) return <p className="text-center mt-10 text-red-500">Campaign not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 mb-16">
      <img
        src={campaign.campaign_image_url}
        alt={campaign.campaign_title}
        className="w-full h-48 sm:h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{campaign.campaign_title}</h1>
      <p className="text-slate-500 mt-1 text-sm sm:text-base">
        by {campaign.creator_name} · {campaign.category}
      </p>
      <p className="text-slate-700 mt-4 text-sm sm:text-base">{campaign.campaign_story}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 text-sm">
        <div>
          <p className="text-slate-500">Goal</p>
          <p className="font-semibold">{campaign.funding_goal} credits</p>
        </div>
        <div>
          <p className="text-slate-500">Raised</p>
          <p className="font-semibold">{campaign.amount_raised} credits</p>
        </div>
        <div>
          <p className="text-slate-500">Min. Contribution</p>
          <p className="font-semibold">{campaign.minimum_contribution} credits</p>
        </div>
        <div>
          <p className="text-slate-500">Deadline</p>
          <p className="font-semibold">{new Date(campaign.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      {campaign.reward_info && (
        <p className="mt-4 text-sm text-slate-600">
          <strong>Reward:</strong> {campaign.reward_info}
        </p>
      )}

      <div className="mt-8 p-4 sm:p-6 border rounded-lg">
        <h2 className="font-semibold text-slate-800 mb-3">Contribute to this campaign</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            min={campaign.minimum_contribution}
            placeholder={`Amount (min ${campaign.minimum_contribution})`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            type="button"
            onClick={handleContribute}
            disabled={submitting}
            className="bg-slate-900 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Contribute"}
          </button>
        </div>
      </div>

      <div className="mt-4 text-right">
        {!showReportForm ? (
          <button
            type="button"
            onClick={() => setShowReportForm(true)}
            className="text-red-500 text-xs underline"
          >
            Report this campaign
          </button>
        ) : (
          <div className="border rounded-lg p-4 text-left mt-2">
            <textarea
              placeholder="Why are you reporting this campaign?"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={3}
              className="border p-2 rounded w-full text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleReport}
                disabled={reportSubmitting}
                className="bg-red-600 text-white px-4 py-1.5 rounded text-xs disabled:opacity-50"
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
              <button
                type="button"
                onClick={() => setShowReportForm(false)}
                className="border px-4 py-1.5 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}