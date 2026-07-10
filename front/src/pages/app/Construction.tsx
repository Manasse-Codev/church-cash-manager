import { useState } from "react";
import { Building2, Plus, Search, X, Download } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { ProgressBar } from "../../components/shared/ProgressBar";
import { DEPENSES_CONSTRUCTION } from "../../constants/mockData";
import type { DepenseConstruction } from "../../types";
import { exportToExcel, exportToPDF } from "../../lib/export-utils";

const BUDGET_TOTAL = 25000000;

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  "Matériaux":    { bg: "#EEF3FF", text: "#1B3FA6" },
  "Main d'œuvre": { bg: "#DCFCE7", text: "#16A34A" },
  "Honoraires":   { bg: "#FEF3C7", text: "#D97706" },
  "Plomberie":    { bg: "#E0E8F5", text: "#2B5C8A" },
};

export function Construction() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const totalDépensé = DEPENSES_CONSTRUCTION.reduce((s, d) => s + d.montant, 0);
  const resteBudget = BUDGET_TOTAL - totalDépensé;

  const filtered = DEPENSES_CONSTRUCTION.filter((d) =>
    d.article.toLowerCase().includes(search.toLowerCase()) ||
    d.fournisseur.toLowerCase().includes(search.toLowerCase())
  );

  const pct = Math.round((totalDépensé / BUDGET_TOTAL) * 100);

  const handleExportExcel = () => {
    const dataToExport = filtered.map(d => ({
      "Date": d.date,
      "Article": d.article,
      "Catégorie": d.categorie,
      "Fournisseur": d.fournisseur,
      "Montant (FCFA)": d.montant
    }));
    exportToExcel({
      data: dataToExport,
      filename: "AD_Construction_Depenses",
      sheetName: "Dépenses Chantier"
    });
  };

  const handleExportPDF = () => {
    const headers = ["Date", "Article", "Catégorie", "Fournisseur", "Montant"];
    const rows = filtered.map(d => [
      d.date,
      d.article,
      d.categorie,
      d.fournisseur,
      `${d.montant.toLocaleString("fr-FR")} FCFA`
    ]);
    exportToPDF({
      title: "Rapport de Suivi du Chantier (Temple)",
      subtitle: `Dépensé : ${totalDépensé.toLocaleString("fr-FR")} FCFA / Budget : ${BUDGET_TOTAL.toLocaleString("fr-FR")} FCFA (${pct}% consommé)`,
      headers,
      rows,
      filename: "Rapport_AD_Chantier"
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)" }}
        >
          <Building2 size={22} color="white" />
        </div>
        <div>
          <PageTitle title="Construction" subtitle="Suivi des dépenses et avancement du chantier du temple" />
        </div>
      </div>

      {/* Budget cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div
          className="sm:col-span-1 rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0D1F5C 0%, #1B3FA6 100%)",
            color: "white",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-15px",
              right: "-15px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
            aria-hidden="true"
          />
          <div style={{ fontSize: "11px", opacity: 0.75, fontWeight: 700 }}>BUDGET TOTAL</div>
          <div style={{ fontWeight: 900, fontSize: "20px", fontFamily: "'Poppins', sans-serif", marginTop: "2px" }}>
            {(BUDGET_TOTAL / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: "11px", opacity: 0.65 }}>FCFA</div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "white",
            border: "1.5px solid rgba(27,63,166,0.1)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 700 }}>TOTAL DÉPENSÉ</div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#DC2626", fontFamily: "'Poppins', sans-serif", marginTop: "2px" }}>
            {(totalDépensé / 1000000).toFixed(2)}M
          </div>
          <div style={{ fontSize: "11px", color: "#64748B" }}>FCFA</div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "white",
            border: "1.5px solid rgba(22,163,74,0.2)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 700 }}>BUDGET RESTANT</div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#16A34A", fontFamily: "'Poppins', sans-serif", marginTop: "2px" }}>
            {(resteBudget / 1000000).toFixed(2)}M
          </div>
          <div style={{ fontSize: "11px", color: "#16A34A" }}>FCFA</div>
        </div>
      </div>

      {/* Progress */}
      <div
        className="rounded-2xl p-4 mb-5 card-ad"
        style={{
          background: "white",
        }}
      >
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Avancement budgétaire</span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#1B3FA6" }}>{pct}%</span>
        </div>
        <ProgressBar value={pct} color="#1B3FA6" showStripes />
        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>
          {totalDépensé.toLocaleString("fr-FR")} FCFA dépensés sur {BUDGET_TOTAL.toLocaleString("fr-FR")} FCFA
        </div>
      </div>

      {/* Search & Export */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl min-w-[200px]"
          style={{ background: "white", border: "1.5px solid rgba(27,63,166,0.12)" }}
        >
          <Search size={16} style={{ color: "#1B3FA6", flexShrink: 0 }} aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article ou fournisseur..."
            className="flex-1 outline-none"
            style={{ background: "transparent", color: "#0D1F5C", fontSize: "14px" }}
            aria-label="Rechercher un article ou fournisseur"
          />
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs"
            style={{ background: "#DCFCE7", color: "#16A34A", border: "1px solid rgba(22,163,74,0.2)" }}
            aria-label="Exporter vers Excel"
          >
            <Download size={13} />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer font-bold text-xs"
            style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)" }}
            aria-label="Exporter au format PDF"
          >
            <Download size={13} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Table / Cards */}
      <div
        className="rounded-2xl overflow-hidden card-ad"
        style={{
          background: "white",
        }}
      >
        {/* Desktop table header */}
        <div
          className="hidden md:grid grid-cols-5 gap-4 px-4 py-3"
          style={{ background: "#EEF3FF", borderBottom: "1px solid rgba(27,63,166,0.1)" }}
        >
          {["Date", "Article", "Fournisseur", "Catégorie", "Montant"].map((h) => (
            <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#0D1F5C" }}>{h}</div>
          ))}
        </div>

        {filtered.map((d: DepenseConstruction, i) => {
          const colors = CAT_COLORS[d.categorie] || { bg: "#E8ECF4", text: "#64748B" };
          return (
            <div key={d.id}>
              {/* Mobile card */}
              <div
                className="md:hidden px-4 py-3.5"
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(27,63,166,0.07)" : "none" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "14px" }} className="truncate">
                      {d.article}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "1px" }}>
                      {d.date} · {d.fournisseur}
                    </div>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full mt-1.5"
                      style={{ background: colors.bg, color: colors.text, fontSize: "10px", fontWeight: 700 }}
                    >
                      {d.categorie}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, color: "#DC2626", fontSize: "15px", flexShrink: 0 }}>
                    -{d.montant.toLocaleString("fr-FR")}
                  </div>
                </div>
              </div>

              {/* Desktop row */}
              <div
                className="hidden md:grid grid-cols-5 gap-4 px-4 py-3.5 items-center"
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(27,63,166,0.07)" : "none" }}
              >
                <div style={{ fontSize: "13px", color: "#64748B" }}>{d.date}</div>
                <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "13px" }}>{d.article}</div>
                <div style={{ fontSize: "13px", color: "#64748B" }}>{d.fournisseur}</div>
                <div>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: colors.bg, color: colors.text, fontSize: "11px", fontWeight: 700 }}
                  >
                    {d.categorie}
                  </span>
                </div>
                <div style={{ fontWeight: 800, color: "#DC2626", fontSize: "14px" }}>
                  -{d.montant.toLocaleString("fr-FR")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)",
          color: "white",
          fontWeight: 700,
          fontSize: "14px",
          boxShadow: "0 6px 20px rgba(27,63,166,0.4)",
          zIndex: 40,
        }}
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Nouvelle dépense</span>
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="const-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="const-modal-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#0D1F5C", fontSize: "18px" }}>
                Nouvelle dépense
              </h3>
              <button type="button" onClick={() => setShowModal(false)} aria-label="Fermer la modal">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Article / Description", placeholder: "Ex: Sacs de ciment", type: "text" },
                { label: "Fournisseur", placeholder: "Nom du fournisseur", type: "text" },
                { label: "Montant (FCFA)", placeholder: "0", type: "number" },
                { label: "Date", placeholder: "", type: "date" },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                    style={{
                      background: "#EEF3FF",
                      border: "1.5px solid rgba(27,63,166,0.15)",
                      color: "#0D1F5C",
                      fontSize: "15px",
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Catégorie</label>
                <select
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  aria-label="Sélectionner une catégorie"
                >
                  {Object.keys(CAT_COLORS).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="py-3 rounded-xl" style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}>Annuler</button>
                <button type="button" onClick={() => setShowModal(false)} className="py-3 rounded-xl" style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
