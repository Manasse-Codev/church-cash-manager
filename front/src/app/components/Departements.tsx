import { useState } from "react";
import { Music, Users, Heart, Baby, Book, Shield, Plus, X, ChevronRight } from "lucide-react";

const departements = [
  {
    id: 1,
    nom: "Chœur",
    description: "Louange & Adoration",
    icon: Music,
    color: "#C67B4B",
    bg: "#F5E0CE",
    budget: 500000,
    dépensé: 310000,
    membres: 24,
    transactions: [
      { date: "02 Jul 2026", motif: "Achat robes de chœur", montant: -85000 },
      { date: "15 Jun 2026", motif: "Partition musicale", montant: -25000 },
      { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 150000 },
    ],
  },
  {
    id: 2,
    nom: "Jeunesse",
    description: "18 – 35 ans",
    icon: Users,
    color: "#2F6B4E",
    bg: "#D4EDE3",
    budget: 800000,
    dépensé: 420000,
    membres: 48,
    transactions: [
      { date: "01 Jul 2026", motif: "Camp jeunesse – acompte", montant: -200000 },
      { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 200000 },
      { date: "05 Jun 2026", motif: "Activité sportive", montant: -20000 },
    ],
  },
  {
    id: 3,
    nom: "Femmes",
    description: "Section féminine",
    icon: Heart,
    color: "#8B3D8A",
    bg: "#F0D8F0",
    budget: 600000,
    dépensé: 280000,
    membres: 62,
    transactions: [
      { date: "03 Jul 2026", motif: "Réunion mensuelle – repas", montant: -45000 },
      { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 150000 },
    ],
  },
  {
    id: 4,
    nom: "Enfants",
    description: "École du Dimanche",
    icon: Baby,
    color: "#D4A843",
    bg: "#F5E8C0",
    budget: 400000,
    dépensé: 185000,
    membres: 35,
    transactions: [
      { date: "06 Jul 2026", motif: "Matériel pédagogique", montant: -35000 },
      { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 100000 },
    ],
  },
  {
    id: 5,
    nom: "Évangélisation",
    description: "Mission & Évangile",
    icon: Book,
    color: "#2B5C8A",
    bg: "#D4E4F5",
    budget: 700000,
    dépensé: 520000,
    membres: 18,
    transactions: [
      { date: "04 Jul 2026", motif: "Tracts et Bibles", montant: -120000 },
      { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 200000 },
      { date: "25 Jun 2026", motif: "Transport équipe", montant: -80000 },
    ],
  },
  {
    id: 6,
    nom: "Anciens",
    description: "Conseil des anciens",
    icon: Shield,
    color: "#6B5744",
    bg: "#F0E8DC",
    budget: 300000,
    dépensé: 90000,
    membres: 8,
    transactions: [
      { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 100000 },
      { date: "20 Jun 2026", motif: "Repas conseil", montant: -10000 },
    ],
  },
];

export function Departements() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const dept = departements.find((d) => d.id === selected);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: "#3A3226",
              fontSize: "24px",
            }}
          >
            Départements
          </h1>
          <p style={{ color: "#6B5744", fontSize: "13px" }}>Budgets et activités par section</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "linear-gradient(135deg, #D4A843, #C67B4B)", color: "white", fontWeight: 700, fontSize: "13px" }}
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departements.map((dept) => {
          const Icon = dept.icon;
          const pct = Math.round((dept.dépensé / dept.budget) * 100);
          const restant = dept.budget - dept.dépensé;

          return (
            <button
              key={dept.id}
              onClick={() => setSelected(dept.id)}
              className="text-left rounded-2xl p-4 transition-all hover:shadow-md active:scale-[0.98]"
              style={{
                background: "white",
                border: "1px solid rgba(198,123,75,0.12)",
                boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: dept.bg }}
                  >
                    <Icon size={20} style={{ color: dept.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#3A3226", fontSize: "15px" }}>{dept.nom}</div>
                    <div style={{ fontSize: "12px", color: "#6B5744" }}>{dept.description}</div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: dept.bg, color: dept.color, fontSize: "11px", fontWeight: 700 }}
                >
                  <Users size={10} />
                  {dept.membres}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div>
                  <div style={{ fontSize: "10px", color: "#6B5744", fontWeight: 600 }}>BUDGET</div>
                  <div style={{ fontWeight: 700, color: "#3A3226", fontSize: "12px" }}>
                    {(dept.budget / 1000).toFixed(0)}k
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "#6B5744", fontWeight: 600 }}>DÉPENSÉ</div>
                  <div style={{ fontWeight: 700, color: "#C0392B", fontSize: "12px" }}>
                    {(dept.dépensé / 1000).toFixed(0)}k
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "#6B5744", fontWeight: 600 }}>RESTANT</div>
                  <div style={{ fontWeight: 700, color: "#2F6B4E", fontSize: "12px" }}>
                    {(restant / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "10px", color: "#6B5744" }}>Consommation</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: dept.color }}>{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#F0EBE0" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${dept.bg}, ${dept.color})`,
                    }}
                  />
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-1 mt-3"
                style={{ color: dept.color, fontSize: "12px", fontWeight: 700 }}
              >
                Voir le grand livre <ChevronRight size={14} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Department detail sheet */}
      {dept && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          style={{ background: "rgba(58,50,38,0.5)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden"
            style={{ background: "white", maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${dept.bg} 0%, white 100%)` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: dept.bg }}
                >
                  <dept.icon size={22} style={{ color: dept.color }} />
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      color: "#3A3226",
                      fontSize: "20px",
                    }}
                  >
                    {dept.nom}
                  </h2>
                  <span style={{ fontSize: "13px", color: "#6B5744" }}>{dept.membres} membres</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)}>
                <X size={20} style={{ color: "#6B5744" }} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 90px)" }}>
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Budget", value: dept.budget, color: "#3A3226" },
                  { label: "Dépensé", value: dept.dépensé, color: "#C0392B" },
                  { label: "Restant", value: dept.budget - dept.dépensé, color: "#2F6B4E" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-3 text-center"
                    style={{ background: "#F5EFE4" }}
                  >
                    <div style={{ fontSize: "10px", color: "#6B5744", fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontWeight: 800, color: s.color, fontSize: "14px" }}>
                      {(s.value / 1000).toFixed(0)}k
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: "#3A3226",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                Grand livre
              </h3>
              <div className="space-y-2">
                {dept.transactions.map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 px-4 rounded-xl"
                    style={{ background: "#F5EFE4" }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#3A3226", fontSize: "14px" }}>{tx.motif}</div>
                      <div style={{ fontSize: "11px", color: "#6B5744" }}>{tx.date}</div>
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "14px",
                        color: tx.montant > 0 ? "#2F6B4E" : "#C0392B",
                      }}
                    >
                      {tx.montant > 0 ? "+" : ""}{tx.montant.toLocaleString("fr-FR")}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-5 py-4 rounded-2xl flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #D4A843, #C67B4B)", color: "white", fontWeight: 700, fontSize: "14px" }}
              >
                <Plus size={18} />
                Nouvelle écriture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add dept modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(58,50,38,0.5)" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#3A3226", fontSize: "18px" }}>
                Nouveau département
              </h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} style={{ color: "#6B5744" }} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Nom du département", placeholder: "Ex: Prière" },
                { label: "Description", placeholder: "Courte description" },
                { label: "Budget annuel (FCFA)", placeholder: "0" },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226" }}>{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                    style={{ background: "#F5EFE4", border: "1px solid rgba(198,123,75,0.2)", color: "#3A3226", fontSize: "15px" }}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={() => setShowAddModal(false)} className="py-3 rounded-xl" style={{ background: "#F0EBE0", color: "#3A3226", fontWeight: 700 }}>Annuler</button>
                <button onClick={() => setShowAddModal(false)} className="py-3 rounded-xl" style={{ background: "linear-gradient(135deg, #D4A843, #C67B4B)", color: "white", fontWeight: 700 }}>Créer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
