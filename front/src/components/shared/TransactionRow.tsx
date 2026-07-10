import { TrendingUp, TrendingDown } from "lucide-react";
import type { Transaction } from "../../types";

interface TransactionRowProps {
  transaction: Transaction;
  isLast?: boolean;
}

export function TransactionRow({ transaction: tx, isLast }: TransactionRowProps) {
  const isIncome = tx.type === "entrée";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(27,63,166,0.07)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: isIncome ? "#DCFCE7" : "#FEE2E2" }}
      >
        {isIncome
          ? <TrendingUp size={16} style={{ color: "#16A34A" }} />
          : <TrendingDown size={16} style={{ color: "#DC2626" }} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="truncate" style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "14px" }}>
          {tx.motif}
        </div>
        <div style={{ fontSize: "11px", color: "#64748B" }}>
          {tx.date} · {tx.par}
        </div>
      </div>

      <div
        style={{
          fontWeight: 800,
          fontSize: "14px",
          color: isIncome ? "#16A34A" : "#DC2626",
          flexShrink: 0,
        }}
      >
        {isIncome ? "+" : "-"}
        {Math.abs(tx.montant).toLocaleString("fr-FR")}
      </div>
    </div>
  );
}
