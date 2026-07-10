import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Download, Plus, CheckCircle, X } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { ProgressBar } from "../../components/shared/ProgressBar";
import { INVESTISSEURS } from "../../constants/mockData";
import type { Investisseur } from "../../types";

const CATEGORIES = ["Tous", "Ancien", "Diacre", "Membre", "Bienfaiteur"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Ancien:      { bg: "#EEF3FF", text: "#1B3FA6" },
  Diacre:      { bg: "#DCFCE7", text: "#16A34A" },
  Membre:      { bg: "#FEF3C7", text: "#D97706" },
  Bienfaiteur: { bg: "#F3E8FF", text: "#7E22CE" },
};

export function Investisseurs() {
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Tous");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showPayModal, setShowPayModal] = useState<number | null>(null);

  const filtered = INVESTISSEURS.filter((inv) => {
    const matchSearch = inv.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === "Tous" || inv.categorie === categorie;
    return matchSearch && matchCat;
  });

  const totalPromesses = INVESTISSEURS.reduce((s, i) => s + i.promesse, 0);
  const totalPayé = INVESTISSEURS.reduce((s, i) => s + i.payé, 0);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageTitle title="Investisseurs" subtitle="Engagements et promesses de dons pour le temple" />

      {/* Summary card */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "linear-gradient(135deg, #0D1F5C 0%, #1B3FA6 100%)",
          color: "white",
        }}
      >
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: "13px", opacity: 0.85, fontWeight: 600 }}>Total promis</span>
          <span style={{ fontWeight: 800, fontSize: "16px" }}>
            {totalPromesses.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
        <ProgressBar value={(totalPayé / totalPromesses) * 100} color="#D4A843" showStripes />
        <div className="flex justify-between mt-2">
          <span style={{ fontSize: "12px", opacity: 0.75 }}>
            Payé: {totalPayé.toLocaleString("fr-FR")} FCFA
          </span>
          <span style={{ fontSize: "12px", opacity: 0.75, fontWeight: 700 }}>
            {Math.round((totalPayé / totalPromesses) * 100)}%
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl min-w-0"
          style={{ background: "white", border: "1.5px solid rgba(27,63,166,0.12)" }}
        >
          <Search size={16} style={{ color: "#1B3FA6", flexShrink: 0 }} aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un investisseur..."
            className="flex-1 outline-none min-w-0"
            style={{ background: "transparent", color: "#0D1F5C", fontSize: "14px" }}
            aria-label="Rechercher un investisseur"
          />
        </div>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="px-3 py-2 rounded-xl outline-none"
          style={{
            background: "white",
            border: "1.5px solid rgba(27,63,166,0.12)",
            color: "#0D1F5C",
            fontSize: "14px",
          }}
          aria-label="Filtrer par catégorie"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Export buttons */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "#EEF3FF", color: "#1B3FA6", fontWeight: 700, fontSize: "13px" }}
        >
          <Download size={14} />
          PDF
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "#DCFCE7", color: "#16A34A", fontWeight: 700, fontSize: "13px" }}
        >
          <Download size={14} />
          Excel
        </button>
      </div>

      {/* Investor cards */}
      <div className="space-y-3">
        {filtered.map((inv: Investisseur) => {
          const restant = inv.promesse - inv.payé;
          const pct = Math.round((inv.payé / inv.promesse) * 100);
          const isExp = expanded === inv.id;
          const colors = CATEGORY_COLORS[inv.categorie] || { bg: "#E8ECF4", text: "#64748B" };
          const isComplete = restant === 0;

          return (
            <div
              key={inv.id}
              className="rounded-2xl overflow-hidden card-ad"
              style={{
                background: "white",
              }}
            >
              <button
                type="button"
                className="w-full text-left p-4"
                onClick={() => setExpanded(isExp ? null : inv.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontWeight: 800, color: "#0D1F5C", fontSize: "15px" }}>
                        {inv.nom}
                      </span>
                      {isComplete && <CheckCircle size={15} style={{ color: "#16A34A" }} />}
                    </div>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full mt-1.5"
                      style={{ background: colors.bg, color: colors.text, fontSize: "11px", fontWeight: 700 }}
                    >
                      {inv.categorie}
                    </span>
                  </div>
                  {isExp
                    ? <ChevronUp size={18} style={{ color: "#64748B", flexShrink: 0 }} />
                    : <ChevronDown size={18} style={{ color: "#64748B", flexShrink: 0 }} />}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>PROMESSE</div>
                    <div style={{ fontWeight: 800, color: "#0D1F5C", fontSize: "13px", marginTop: "2px" }}>
                      {inv.promesse.toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>PAYÉ</div>
                    <div style={{ fontWeight: 800, color: "#16A34A", fontSize: "13px", marginTop: "2px" }}>
                      {inv.payé.toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>RESTANT</div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "13px",
                        marginTop: "2px",
                        color: restant > 0 ? "#D4A843" : "#16A34A",
                      }}
                    >
                      {restant.toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ProgressBar value={pct} color="#1B3FA6" />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", flexShrink: 0 }}>
                    {pct}%
                  </span>
                </div>
              </button>

              {/* Expanded: payment history */}
              {isExp && (
                <div
                  className="px-4 pb-4 pt-0"
                  style={{ borderTop: "1px dashed rgba(27,63,166,0.12)" }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", marginBottom: "8px", marginTop: "12px", letterSpacing: "0.05em" }}>
                    HISTORIQUE DES PAIEMENTS
                  </div>
                  <div className="space-y-2 mb-4">
                    {inv.paiements.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                        style={{ background: "#EEF3FF" }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "13px" }}>
                            {p.montant.toLocaleString("fr-FR")} FCFA
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748B", marginTop: "1px" }}>
                            {p.date} · {p.méthode}
                          </div>
                        </div>
                        <CheckCircle size={15} style={{ color: "#16A34A" }} />
                      </div>
                    ))}
                  </div>
                  {restant > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPayModal(inv.id)}
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 btn-primary"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      <Plus size={16} />
                      Ajouter un paiement
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add investor button */}
      <button
        type="button"
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)",
          boxShadow: "0 6px 20px rgba(27,63,166,0.4)",
          zIndex: 40,
        }}
        aria-label="Nouvel investisseur"
      >
        <Plus size={22} color="white" />
      </button>

      {/* Payment modal */}
      {showPayModal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowPayModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pay-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                id="pay-modal-title"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: "#0D1F5C",
                  fontSize: "18px",
                }}
              >
                Ajouter un paiement
              </h3>
              <button type="button" onClick={() => setShowPayModal(null)} aria-label="Fermer la modal">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Montant (FCFA)", placeholder: "Ex: 100 000", type: "number" },
                { label: "Date", placeholder: "", type: "date" },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                    style={{
                      background: "#EEF3FF",
                      border: "1.5px solid rgba(27,63,166,0.15)",
                      color: "#0D1F5C",
                      fontSize: "15px",
                    }}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Méthode</label>
                <select
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  aria-label="Méthode de paiement"
                >
                  {["Mobile Money", "Espèces", "Virement bancaire", "Chèque"].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPayModal(null)}
                  className="py-3 rounded-xl"
                  style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(null)}
                  className="py-3 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}
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
