import Link from "next/link";
import { Cpu, BookOpen, HeartPulse, Users, Leaf, Palette, Clock } from "lucide-react";

const CATEGORY_STYLES = {
  Technology: { icon: Cpu, bg: "bg-indigo-600" },
  Education: { icon: BookOpen, bg: "bg-violet-600" },
  Health: { icon: HeartPulse, bg: "bg-emerald-600" },
  Community: { icon: Users, bg: "bg-amber-600" },
  Environment: { icon: Leaf, bg: "bg-green-600" },
  Art: { icon: Palette, bg: "bg-pink-600" },
};

export default function CampaignCard({ campaign }) {
  const style = CATEGORY_STYLES[campaign.category] || { icon: Cpu, bg: "bg-slate-600" };
  const Icon = style.icon;

  const percent = Math.min(
    100,
    Math.round((campaign.amount_raised / campaign.funding_goal) * 100) || 0
  );

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
      <div className="relative">
        <img
          src={campaign.campaign_image_url}
          alt={campaign.campaign_title}
          className="w-full h-40 object-cover"
        />
        <span
          className={`absolute top-3 left-3 ${style.bg} text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1`}
        >
          <Icon className="w-3.5 h-3.5" />
          {campaign.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{campaign.campaign_title}</h3>
        <p className="text-slate-500 text-sm mt-1">by {campaign.creator_name}</p>

        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-semibold text-slate-800">{campaign.amount_raised} raised</span>
            <span className="text-emerald-600 font-semibold">{percent}%</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
            <span>{campaign.funding_goal} goal</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {daysLeft} days left
            </span>
          </div>
        </div>

        <Link
          href={`/campaign-details/${campaign._id}`}
          className="inline-block mt-4 w-full text-center bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}