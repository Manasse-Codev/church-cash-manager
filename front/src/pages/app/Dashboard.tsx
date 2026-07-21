import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { HandCoins, Building2, Clock, ArrowDownRight, Plus, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageTitle } from "../../components/shared/PageTitle";
import { StatCard } from "../../components/shared/StatCard";
import { useAuthStore } from "../../stores/auth.store";
import { api } from "../../lib/api-client";
import type { Transaction } from "../../types";

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
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastTx, setLastTx] = useState<Transaction[]>([]);
  
  // Formulaire rapide
  const [motif, setMotif] = useState("");
  const [montant, setMontant] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartRes, txRes] = await Promise.all([
        api.get<any>("/dashboard/stats"),
        api.get<any>("/dashboard/chart"),
        api.get<any>("/caisse/mouvements"),
      ]);
      setStats(statsRes.data);
      setChartData(chartRes.data || []);
      
      // On prend les 3 dernières transactions et on les formate
      const formattedTx: Transaction[] = (txRes.data || []).slice(0, 3).map((t: any) => ({
        id: t.id.toString(),
        date: t.date, // already formatted by NestJS backend
        motif: t.motif,
        montant: t.montant,
        type: t.type.toLowerCase() as "entrée" | "sortie",
        par: t.par,
      }));
      setLastTx(formattedTx);
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveQuickEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motif.trim() || !montant || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post("/caisse/mouvements", {
        motif: motif.trim(),
        montant: parseFloat(montant),
        type: "ENTREE",
        date: new Date().toISOString(),
        par: user?.nom ?? "Admin",
      });
      setMotif("");
      setMontant("");
      setShowModal(false);
      await fetchDashboardData();
    } catch (error) {
      alert("Erreur lors de l'enregistrement de l'entrée");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statCards = [
    { label: "Total trésorerie", value: stats?.soldeCaisse?.toLocaleString("fr-FR") ?? "0", currency: "FCFA", icon: HandCoins, trend: "", up: true, color: "var(--blue-primary)", bg: "var(--blue-muted)" },
    { label: "Fonds construction", value: stats?.fondsConstruction?.toLocaleString("fr-FR") ?? "0", currency: "FCFA", icon: Building2, trend: "", up: true, color: "var(--success)", bg: "var(--success-bg)" },
    { label: "Promesses en cours", value: stats?.totalPromesses?.toLocaleString("fr-FR") ?? "0", currency: "FCFA", icon: Clock, trend: "", up: true, color: "var(--warning)", bg: "var(--warning-bg)" },
    { label: "Dépenses construction", value: stats?.totalDepensesConstruction?.toLocaleString("fr-FR") ?? "0", currency: "FCFA", icon: ArrowDownRight, trend: "", up: false, color: "var(--danger)", bg: "var(--danger-bg)" },
  ];

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
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Graphique */}
      <div className="card-ad p-5 mb-6">
        <PageTitle title="Entrées vs Dépenses (6 derniers mois)" />
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fill: "var(--gray-600)", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--gray-600)", fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "var(--gray-600)", fontWeight: 600, paddingTop: "10px" }} />
              <Bar dataKey="entrées" fill="var(--blue-primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="dépenses" fill="var(--danger)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
        {lastTx.map((tx, i) => {
          const isIncome = tx.type === "entrée";
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-5 py-3.5"
              style={{
                borderBottom: i < lastTx.length - 1 ? "1px solid rgba(27,63,166,0.07)" : "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isIncome ? "#DCFCE7" : "#FEE2E2" }}
              >
                <ArrowDownRight size={16} style={{ color: isIncome ? "#16A34A" : "#DC2626", transform: isIncome ? "rotate(180deg)" : "none" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "14px" }} className="truncate">
                  {tx.motif}
                </div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>
                  {tx.date} · {tx.par}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "15px",
                  color: isIncome ? "#16A34A" : "#DC2626",
                  flexShrink: 0,
                }}
              >
                {isIncome ? "+" : "-"}{Math.abs(tx.montant).toLocaleString("fr-FR")}
              </div>
            </div>
          );
        })}
        {lastTx.length === 0 && (
          <div className="py-8 text-center text-gray-500 text-sm">
            Aucun mouvement enregistré
          </div>
        )}
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
          <form
            onSubmit={handleSaveQuickEntry}
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6 shadow-2xl"
            style={{ background: "white", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--blue-deep)", fontSize: "18px", marginBottom: "20px" }}>
              Nouvelle entrée rapide
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>Motif</label>
                <input
                  type="text"
                  required
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: "var(--blue-muted)", border: "1.5px solid var(--border)", color: "var(--blue-deep)", fontSize: "15px", fontWeight: 500 }}
                  placeholder="Ex: Offrande du dimanche"
                />
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>Montant (FCFA)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: "var(--blue-muted)", border: "1.5px solid var(--border)", color: "var(--blue-deep)", fontSize: "15px", fontWeight: 500 }}
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button type="button" onClick={() => setShowModal(false)} className="py-3 rounded-xl cursor-pointer" style={{ background: "var(--blue-muted)", border: "none", color: "var(--blue-deep)", fontWeight: 700, fontSize: "14px" }}>Annuler</button>
                <button type="submit" disabled={isSubmitting} className="py-3 rounded-xl btn-primary border-none cursor-pointer" style={{ fontSize: "14px" }}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
