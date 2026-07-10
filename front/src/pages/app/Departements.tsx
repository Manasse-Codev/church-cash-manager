import { useState } from "react";
import { Music, Users, Heart, Baby, Book, Shield, Plus, X, ChevronRight } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { ProgressBar } from "../../components/shared/ProgressBar";
import { DEPARTEMENTS } from "../../constants/mockData";
import type { Departement } from "../../types";

const ICON_MAP: Record<string, any> = {
  Music: Music,
  Users: Users,
  Heart: Heart,
  Baby: Baby,
  Book: Book,
  Shield: Shield,
};

const DEPT_THEMES: Record<string, { bg: string; color: string }> = {
  "Chœur":          { bg: "#EEF3FF", color: "#1B3FA6" },
  "Jeunesse":       { bg: "#DCFCE7", color: "#16A34A" },
  "Femmes":         { bg: "#F3E8FF", color: "#7E22CE" },
  "Enfants":         { bg: "#FEF3C7", color: "#D97706" },
  "Évangélisation": { bg: "#E0E8F5", color: "#2B5C8A" },
  "Anciens":        { bg: "#F0E8DC", color: "#6B5744" },
};

export function Departements() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const dept = DEPARTEMENTS.find((d) => d.id === selected);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <PageTitle title="Départements" subtitle="Budgets, effectifs et activités par section de l'église" />
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary"
          style={{ fontSize: "13px" }}
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DEPARTEMENTS.map((d: Departement) => {
          const Icon = ICON_MAP[d.icon] || Book;
          const pct = Math.round((d.depense / d.budget) * 100);
          const restant = d.budget - d.depense;
          const theme = DEPT_THEMES[d.nom] || { bg: "#E8ECF4", color: "#64748B" };

          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              className="text-left rounded-2xl p-4 transition-all hover:shadow-md active:scale-[0.98] card-ad"
              style={{
                background: "white",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: theme.bg }}
                  >
                    <Icon size={20} style={{ color: theme.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#0D1F5C", fontSize: "15px" }}>{d.nom}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>{d.description}</div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{ background: theme.bg, color: theme.color, fontSize: "11px", fontWeight: 700 }}
                >
                  <Users size={10} />
                  {d.membres}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div>
                  <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>BUDGET</div>
                  <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "12px" }}>
                    {(d.budget / 1000).toFixed(0)}k
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>DÉPENSÉ</div>
                  <div style={{ fontWeight: 700, color: "#DC2626", fontSize: "12px" }}>
                    {(d.depense / 1000).toFixed(0)}k
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>RESTANT</div>
                  <div style={{ fontWeight: 700, color: "#16A34A", fontSize: "12px" }}>
                    {(restant / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "10px", color: "#64748B" }}>Consommation</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: theme.color }}>{pct}%</span>
                </div>
                <ProgressBar value={pct} color={theme.color} />
              </div>

              <div
                className="flex items-center justify-end gap-1 mt-3"
                style={{ color: theme.color, fontSize: "12px", fontWeight: 700 }}
              >
                Voir le grand livre <ChevronRight size={14} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Department detail sheet */}
      {dept && (() => {
        const theme = DEPT_THEMES[dept.nom] || { bg: "#E8ECF4", color: "#64748B" };
        const Icon = ICON_MAP[dept.icon] || Book;
        return (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            style={{ background: "rgba(13,31,92,0.6)" }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dept-modal-title"
          >
            <div
              className="w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden"
              style={{ background: "white", maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sheet header */}
              <div
                className="px-6 py-5 flex items-center justify-between"
                style={{ background: `linear-gradient(135deg, ${theme.bg} 0%, white 100%)` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: theme.bg }}
                  >
                    <Icon size={22} style={{ color: theme.color }} />
                  </div>
                  <div>
                    <h2
                      id="dept-modal-title"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        color: "#0D1F5C",
                        fontSize: "20px",
                      }}
                    >
                      {dept.nom}
                    </h2>
                    <span style={{ fontSize: "13px", color: "#64748B" }}>{dept.membres} membres</span>
                  </div>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Fermer la modal">
                  <X size={20} style={{ color: "#64748B" }} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 90px)" }}>
                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Budget", value: dept.budget, color: "#0D1F5C" },
                    { label: "Dépensé", value: dept.depense, color: "#DC2626" },
                    { label: "Restant", value: dept.budget - dept.depense, color: "#16A34A" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-3 text-center"
                      style={{ background: "#EEF3FF" }}
                    >
                      <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>{s.label}</div>
                      <div style={{ fontWeight: 800, color: s.color, fontSize: "14px", marginTop: "2px" }}>
                        {(s.value / 1000).toFixed(0)}k
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transactions */}
                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    color: "#0D1F5C",
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
                      style={{ background: "#EEF3FF" }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "14px" }}>{tx.motif}</div>
                        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "1px" }}>{tx.date}</div>
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: "14px",
                          color: tx.montant > 0 ? "#16A34A" : "#DC2626",
                        }}
                      >
                        {tx.montant > 0 ? "+" : ""}{tx.montant.toLocaleString("fr-FR")}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="w-full mt-5 py-4 rounded-2xl flex items-center justify-center gap-2 btn-primary"
                  style={{ fontSize: "14px" }}
                >
                  <Plus size={18} />
                  Nouvelle écriture
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add dept modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowAddModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-dept-title"
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="add-dept-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#0D1F5C", fontSize: "18px" }}>
                Nouveau département
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} aria-label="Fermer la modal"><X size={20} style={{ color: "#64748B" }} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Nom du département", placeholder: "Ex: Prière" },
                { label: "Description", placeholder: "Courte description" },
                { label: "Budget annuel (FCFA)", placeholder: "0" },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                    style={{ background: "#EEF3FF", border: "1.5px solid rgba(27,63,166,0.15)", color: "#0D1F5C", fontSize: "15px" }}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="py-3 rounded-xl" style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}>Annuler</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="py-3 rounded-xl" style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}>Créer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
