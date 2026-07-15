"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import CampaignCard from "@/components/CampaignCard";

function ExploreContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/campaigns/explore")
      .then((res) => setCampaigns(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? campaigns.filter((c) => c.category === activeCategory)
    : campaigns;

  if (loading) return <p className="text-center mt-10">Loading campaigns...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 mb-16">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {activeCategory ? `${activeCategory} Campaigns` : "Explore Campaigns"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover and support meaningful causes creating real impact
          </p>
        </div>
        {activeCategory && (
          <Link href="/explore" className="text-sm text-indigo-600 underline">
            Clear filter
          </Link>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500">
          {activeCategory
            ? `No active campaigns in ${activeCategory} right now.`
            : "No active campaigns right now — check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((c) => (
            <CampaignCard key={c._id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <ExploreContent />
    </Suspense>
  );
}