import { useState } from "react";
import { useNavigate } from "react-router";
import { HandCoins, Building2, Clock, ArrowDownRight, Plus, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageTitle } from "../../components/shared/PageTitle";
import { StatCard } from "../../components/shared/StatCard";
import { TransactionRow } from "../../components/shared/TransactionRow";
import { CHART_DATA, TRANSACTIONS } from "../../constants/mockData";
import { useAuthStore } from "../../stores/auth.store";

const STAT_CARDS = [
  { label: "Total offrandes",   value: "2 850 000", currency: "FCFA", icon: HandCoins,       trend: "+12%", up: true,  color: "var(--blue-primary)", bg: "var(--blue-muted)" },
  { label: "Fonds construction", value: "14 500 000",currency: "FCFA", icon: Building2,       trend: "+8%",  up: true,  color: "var(--success)", bg: "var(--success-bg)" },
  { label: "Promesses en cours", value: "6 200 000", currency: "FCFA", icon: Clock,           trend: "-3%",  up: false, color: "var(--warning)", bg: "var(--warning-bg)" },
  { label: "Dépenses du mois",  value: "450 000",   currency: "FCFA", icon: ArrowDownRight,  trend: "+5%",  up: false, color: "var(--danger)", bg: "var(--danger-bg)" },
];

interface TooltipProps { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; }

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px", boxShadow: "0 10px 25px rgba(0,32,194,0.06)" }}>
      <p style={{ fontWeight: 700, color: "var(--blue-deep)", marginBottom: "6px", fontSize: "13px" }}>{label}</p>
      {payload.map((e) => (
        <p key={e.name} style={{ color: e.color, fontSize: "12px", fontWeight: 700 }}>
          {e.name}: {e.value.toLocaleString("fr-FR")} FCFA
        </p>
      ))}
    </div>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const lastTx = TRANSACTIONS.slice(0, 3);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Salutation */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-display)", color: "var(--blue-deep)", fontSize: "clamp(1.4rem,3vw,1.85rem)", fontWeight: 800, lineHeight: "1.2", letterSpacing: "-0.01em" }}>
          Bonjour, {user?.nom ?? "Admin"} 👋
        </h1>
        <div className="flex items-center gap-2 mt-1.5">
          <Calendar size={14} style={{ color: "var(--blue-accent)" }} aria-hidden="true" />
          <span style={{ color: "var(--gray-600)", fontSize: "13px", fontWeight: 600, textTransform: "capitalize" }}>{today}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Graphique */}
      <div className="card-ad p-5 mb-6">
        <PageTitle title="Entrées vs Dépenses" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CHART_DATA} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="mois" tick={{ fill: "var(--gray-600)", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--gray-600)", fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "var(--gray-600)", fontWeight: 600, paddingTop: "10px" }} />
            <Bar dataKey="entrées"  fill="var(--blue-primary)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="dépenses" fill="var(--success)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dernières transactions */}
      <div className="card-ad overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--blue-deep)", fontSize: "16px", fontWeight: 800 }}>
            Dernières transactions
          </h2>
          <button type="button" onClick={() => navigate("/app/caisse")} className="cursor-pointer" style={{ fontSize: "13px", color: "var(--blue-primary)", fontWeight: 700, background: "none", border: "none" }}>
            Tout voir →
          </button>
        </div>
        {lastTx.map((tx, i) => (
          <TransactionRow key={tx.id} transaction={tx} isLast={i === lastTx.length - 1} />
        ))}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
        style={{ background: "linear-gradient(135deg, var(--blue-primary), var(--blue-accent))", color: "white", border: "none", fontWeight: 700, fontSize: "14px", boxShadow: "0 8px 24px rgba(0, 32, 194, 0.25)", zIndex: 40 }}
        aria-label="Nouvelle entrée"
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Nouvelle entrée</span>
      </button>

      {/* Modal rapide */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: "rgba(0,32,194,0.15)" }}
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6 shadow-2xl"
            style={{ background: "white", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--blue-deep)", fontSize: "18px", marginBottom: "20px" }}>
              Nouvelle entrée
            </h3>
            <div className="space-y-4">
              {[{ label: "Motif", placeholder: "Ex: Offrande du dimanche", type: "text" }, { label: "Montant (FCFA)", placeholder: "0", type: "number" }].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>{f.label}</label>
                  <input type={f.type} className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: "var(--blue-muted)", border: "1.5px solid var(--border)", color: "var(--blue-deep)", fontSize: "15px", fontWeight: 500 }} placeholder={f.placeholder} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button type="button" onClick={() => setShowModal(false)} className="py-3 rounded-xl cursor-pointer" style={{ background: "var(--blue-muted)", border: "none", color: "var(--blue-deep)", fontWeight: 700, fontSize: "14px" }}>Annuler</button>
                <button type="button" onClick={() => setShowModal(false)} className="py-3 rounded-xl btn-primary border-none cursor-pointer" style={{ fontSize: "14px" }}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
