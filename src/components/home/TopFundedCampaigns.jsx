"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import CampaignCard from "@/components/CampaignCard";

export default function TopFundedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axiosInstance.get("/campaigns/top-funded").then((res) => setCampaigns(res.data));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Top Funded Campaigns</h2>

      {campaigns.length === 0 ? (
        <p className="text-slate-500">No approved campaigns yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {campaigns.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CampaignCard campaign={c} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}