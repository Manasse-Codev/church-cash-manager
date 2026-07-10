import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  currency?: string;
  icon: LucideIcon;
  trend?: string;
  up?: boolean;
  color?: string;
  bg?: string;
}

export function StatCard({
  label,
  value,
  currency,
  icon: Icon,
  trend,
  up,
  color = "#1B3FA6",
  bg = "#EEF3FF",
}: StatCardProps) {
  return (
    <div className="card-ad rounded-2xl p-4 relative overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bg }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              background: up ? "#DCFCE7" : "#FEE2E2",
              color:      up ? "#16A34A" : "#DC2626",
            }}
          >
            {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span style={{ fontSize: "10px", fontWeight: 700 }}>{trend}</span>
          </div>
        )}
      </div>

      <div style={{ fontWeight: 800, fontSize: "20px", color: "#0D1F5C", lineHeight: "1.1" }}>
        {value}
      </div>
      {currency && (
        <div style={{ fontSize: "10px", color, fontWeight: 700, marginTop: "2px" }}>
          {currency}
        </div>
      )}
      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>{label}</div>

      {/* Décoration coin */}
      <div
        style={{
          position: "absolute", bottom: "-12px", right: "-12px",
          width: "56px", height: "56px", borderRadius: "50%",
          background: bg, opacity: 0.5,
        }}
      />
    </div>
  );
}
