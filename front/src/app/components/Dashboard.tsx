import { useState } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  HandCoins,
  Building2,
  Clock,
  ArrowDownRight,
  Plus,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const chartData = [
  { mois: "Jan", entrées: 850000, dépenses: 320000 },
  { mois: "Fév", entrées: 1200000, dépenses: 480000 },
  { mois: "Mar", entrées: 980000, dépenses: 560000 },
  { mois: "Avr", entrées: 1450000, dépenses: 390000 },
  { mois: "Mai", entrées: 1100000, dépenses: 620000 },
  { mois: "Jun", entrées: 1380000, dépenses: 450000 },
];

const lastTransactions = [
  { id: 1, date: "03 Jul 2026", motif: "Offrande du dimanche", montant: 285000, type: "entrée", par: "Frère Moukala" },
  { id: 2, date: "02 Jul 2026", motif: "Achat ciment (construction)", montant: -120000, type: "sortie", par: "Pasteur Nzinzi" },
  { id: 3, date: "01 Jul 2026", motif: "Dîme mensuelle – Section Femmes", montant: 95000, type: "entrée", par: "Sœur Bilomba" },
];

const statCards = [
  {
    label: "Total offrandes",
    value: "2 850 000",
    currency: "FCFA",
    icon: HandCoins,
    trend: "+12%",
    up: true,
    color: "#C67B4B",
    bg: "#F5E0CE",
  },
  {
    label: "Fonds construction",
    value: "14 500 000",
    currency: "FCFA",
    icon: Building2,
    trend: "+8%",
    up: true,
    color: "#2F6B4E",
    bg: "#D4EDE3",
  },
  {
    label: "Promesses en cours",
    value: "6 200 000",
    currency: "FCFA",
    icon: Clock,
    trend: "-3%",
    up: false,
    color: "#D4A843",
    bg: "#F5E8C0",
  },
  {
    label: "Dépenses du mois",
    value: "450 000",
    currency: "FCFA",
    icon: ArrowDownRight,
    trend: "+5%",
    up: false,
    color: "#8B5E3C",
    bg: "#F0E8DC",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid rgba(198,123,75,0.2)",
          borderRadius: "12px",
          padding: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ fontWeight: 700, color: "#3A3226", marginBottom: "6px", fontSize: "13px" }}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color, fontSize: "12px", fontWeight: 600 }}>
            {entry.name}: {entry.value.toLocaleString("fr-FR")} FCFA
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#3A3226",
            fontSize: "26px",
            fontWeight: 900,
            lineHeight: "1.2",
          }}
        >
          Bonjour, Admin 👋
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Calendar size={14} style={{ color: "#C67B4B" }} />
          <span style={{ color: "#6B5744", fontSize: "13px", textTransform: "capitalize" }}>{today}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl p-4 relative overflow-hidden"
              style={{
                background: "white",
                border: "1px solid rgba(198,123,75,0.12)",
                boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: card.bg }}
                >
                  <Icon size={18} style={{ color: card.color }} />
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{
                    background: card.up ? "#D4EDE3" : "#F5E0CE",
                    color: card.up ? "#2F6B4E" : "#C67B4B",
                  }}
                >
                  {card.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  <span style={{ fontSize: "10px", fontWeight: 700 }}>{card.trend}</span>
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: "18px", color: "#3A3226", lineHeight: "1.1" }}>
                {card.value}
              </div>
              <div style={{ fontSize: "10px", color: "#C67B4B", fontWeight: 600, marginTop: "2px" }}>
                {card.currency}
              </div>
              <div style={{ fontSize: "12px", color: "#6B5744", marginTop: "4px" }}>{card.label}</div>

              {/* Decorative corner */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  right: "-10px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: card.bg,
                  opacity: 0.5,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{
          background: "white",
          border: "1px solid rgba(198,123,75,0.12)",
          boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#3A3226",
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Entrées vs Dépenses
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(198,123,75,0.1)" vertical={false} />
            <XAxis
              dataKey="mois"
              tick={{ fill: "#6B5744", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B5744", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#6B5744", paddingTop: "8px" }}
            />
            <Bar dataKey="entrées" fill="#C67B4B" radius={[6, 6, 0, 0]} />
            <Bar dataKey="dépenses" fill="#2F6B4E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Last transactions */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "white",
          border: "1px solid rgba(198,123,75,0.12)",
          boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#3A3226",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Dernières transactions
          </h2>
          <button
            onClick={() => navigate("/app/caisse")}
            style={{ fontSize: "12px", color: "#C67B4B", fontWeight: 700 }}
          >
            Tout voir →
          </button>
        </div>

        <div className="space-y-3">
          {lastTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 py-3 border-b last:border-b-0"
              style={{ borderColor: "rgba(198,123,75,0.1)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: tx.type === "entrée" ? "#D4EDE3" : "#F5E0CE",
                }}
              >
                {tx.type === "entrée" ? (
                  <TrendingUp size={16} style={{ color: "#2F6B4E" }} />
                ) : (
                  <TrendingDown size={16} style={{ color: "#C67B4B" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  style={{ fontWeight: 700, color: "#3A3226", fontSize: "13px" }}
                  className="truncate"
                >
                  {tx.motif}
                </div>
                <div style={{ fontSize: "11px", color: "#6B5744" }}>
                  {tx.date} · {tx.par}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "14px",
                  color: tx.type === "entrée" ? "#2F6B4E" : "#C0392B",
                  flexShrink: 0,
                }}
              >
                {tx.type === "entrée" ? "+" : ""}{Math.abs(tx.montant).toLocaleString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #D4A843, #C67B4B)",
          color: "white",
          fontWeight: 700,
          fontSize: "14px",
          boxShadow: "0 6px 20px rgba(212,168,67,0.5)",
          zIndex: 40,
        }}
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Nouvelle entrée</span>
      </button>

      {/* Quick add modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(58,50,38,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                color: "#3A3226",
                fontSize: "18px",
                marginBottom: "16px",
              }}
            >
              Nouvelle entrée
            </h3>
            <div className="space-y-3">
              {[
                { label: "Motif", placeholder: "Ex: Offrande du dimanche" },
                { label: "Montant (FCFA)", placeholder: "0" },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226" }}>
                    {field.label}
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                    style={{
                      background: "#F5EFE4",
                      border: "1px solid rgba(198,123,75,0.2)",
                      color: "#3A3226",
                      fontSize: "15px",
                    }}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="py-3 rounded-xl"
                  style={{ background: "#F0EBE0", color: "#3A3226", fontWeight: 700 }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="py-3 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #D4A843, #C67B4B)", color: "white", fontWeight: 700 }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
