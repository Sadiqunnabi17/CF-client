"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const categories = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

function AddCampaignForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "Technology",
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
    campaign_image_url: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user && user.role !== "Creator") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Creators can add campaigns.
      </p>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axiosInstance.post("/campaigns", form);
      toast.success("Campaign submitted for approval!");
      router.push("/dashboard/my-campaigns");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg mb-16">
      <h1 className="text-2xl font-bold mb-4">Add New Campaign</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="flex flex-col gap-4">
        <input
          name="campaign_title"
          placeholder="Campaign Title (e.g. Help us build a solar-powered water pump)"
          required
          value={form.campaign_title}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="campaign_story"
          placeholder="Campaign Story"
          required
          rows={5}
          value={form.campaign_story}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          name="funding_goal"
          type="number"
          min="1"
          placeholder="Funding Goal (credits)"
          required
          value={form.funding_goal}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="minimum_contribution"
          type="number"
          min="1"
          placeholder="Minimum Contribution (credits)"
          required
          value={form.minimum_contribution}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="deadline"
          type="date"
          required
          value={form.deadline}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="reward_info"
          placeholder="What Supporters receive for pledging"
          value={form.reward_info}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="campaign_image_url"
          placeholder="Campaign Cover Image URL"
          required
          value={form.campaign_image_url}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-slate-900 text-white p-2 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Add Campaign"}
        </button>
      </div>
    </div>
  );
}

export default function AddCampaignPage() {
  return (
    <PrivateRoute>
      <AddCampaignForm />
    </PrivateRoute>
  );
}