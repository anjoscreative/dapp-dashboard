import React from "react";
import { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
};

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-start bg-gradient-to-br from-[#111f24] to-[#0a1418] border border-gray-800 rounded-xl p-4 flex-1 min-w-[140px] hover:border-orange-400/60 hover:shadow-lg hover:shadow-orange-500/10 transition">
      <div className="text-orange-400 mb-2">{icon}</div>
      <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
      <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
    </div>
  );
}
