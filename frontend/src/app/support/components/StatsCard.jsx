"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  change,
  changeText,
  icon: Icon,
  trend = "up",
  className = "",
}) {
  const isUp = trend === "up";
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp ? "text-green-600" : "text-red-600";

  return (
    <div className={`group bg-white rounded-xl border border-gray-200  shadow-sm p-5 hover:border-gray-300 transition-colors ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className={`inline-flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span>{changeText || change}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">{title}</p>
        <p className="text-3xl font-semibold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}
