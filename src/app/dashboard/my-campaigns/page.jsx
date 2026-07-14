"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

function MyCampaignsTable() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ campaign_title: "", campaign_story: "", reward_info: "" });

  const fetchCampaigns = () => {
    axiosInstance
      .get("/campaigns/mine")
      .then((res) => setCampaigns(res.data))
      .catch(() => toast.error("Failed to load campaigns"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({
      campaign_title: c.campaign_title,
      campaign_story: c.campaign_story,
      reward_info: c.reward_info || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      await axiosInstance.patch(`/campaigns/${id}`, editForm);
      toast.success("Campaign updated");
      setEditingId(null);
      fetchCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this campaign? Approved supporters will be refunded.")) return;
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
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
      <h1 className="text-2xl font-bold mb-6">My Campaigns</h1>

      {campaigns.length === 0 ? (
        <p className="text-slate-500">You haven't added any campaigns yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Goal</th>
                <th className="p-3">Raised</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-t align-top">
                  {editingId === c._id ? (
                    <td colSpan={7} className="p-3">
                      <div className="flex flex-col gap-2">
                        <input
                          value={editForm.campaign_title}
                          onChange={(e) => setEditForm({ ...editForm, campaign_title: e.target.value })}
                          className="border p-2 rounded"
                          placeholder="Title"
                        />
                        <textarea
                          value={editForm.campaign_story}
                          onChange={(e) => setEditForm({ ...editForm, campaign_story: e.target.value })}
                          className="border p-2 rounded"
                          rows={3}
                          placeholder="Story"
                        />
                        <input
                          value={editForm.reward_info}
                          onChange={(e) => setEditForm({ ...editForm, reward_info: e.target.value })}
                          className="border p-2 rounded"
                          placeholder="Reward info"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(c._id)}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="border px-3 py-1.5 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="p-3">{c.campaign_title}</td>
                      <td className="p-3">{c.category}</td>
                      <td className="p-3">{c.funding_goal}</td>
                      <td className="p-3">{c.amount_raised}</td>
                      <td className="p-3">{new Date(c.deadline).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            c.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : c.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="text-slate-700 underline text-xs"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id)}
                          className="text-red-600 underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MyCampaignsPage() {
  return (
    <PrivateRoute>
      <MyCampaignsTable />
    </PrivateRoute>
  );
}