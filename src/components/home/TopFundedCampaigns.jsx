"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";

export default function TopFundedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axiosInstance.get("/campaigns/top-funded").then((res) => setCampaigns(res.data));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Top Funded Campaigns</h2>

      {campaigns.length === 0 ? (
        <p className="text-slate-500">No approved campaigns yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={c.campaign_image_url}
                alt={c.campaign_title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-slate-800">{c.campaign_title}</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {c.amount_raised} credits raised
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}