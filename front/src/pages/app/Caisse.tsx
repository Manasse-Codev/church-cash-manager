import { useState } from "react";
import { TrendingUp, TrendingDown, Plus, Search, X, Download } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { TRANSACTIONS } from "../../constants/mockData";
import type { Transaction } from "../../types";
import { exportToExcel, exportToPDF } from "../../lib/export-utils";

type Tab = "Tout" | "Entrées" | "Sorties";

export function Caisse() {
  const [tab, setTab] = useState<Tab>("Tout");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState<"entrée" | "sortie">("entrée");

  const solde = TRANSACTIONS.reduce((s, t) => s + (t.type === "entrée" ? t.montant : -t.montant), 0);
  const totalEntrées = TRANSACTIONS.filter(t => t.type === "entrée").reduce((s, t) => s + t.montant, 0);
  const totalSorties = TRANSACTIONS.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0);

  const filtered = TRANSACTIONS.filter((t) => {
    const matchTab =
      tab === "Tout" ||
      (tab === "Entrées" && t.type === "entrée") ||
      (tab === "Sorties" && t.type === "sortie");
    const matchSearch = t.motif.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleExportExcel = () => {
    const dataToExport = filtered.map(t => ({
      "Date": t.date,
      "Motif": t.motif,
      "Montant (FCFA)": t.type === "entrée" ? t.montant : -t.montant,
      "Type": t.type === "entrée" ? "ENTRÉE" : "SORTIE",
      "Auteur": t.par
    }));
    exportToExcel({
      data: dataToExport,
      filename: "AD_Caisse_Transactions",
      sheetName: "Mouvements"
    });
  };

  const handleExportPDF = () => {
    const headers = ["Date", "Motif", "Montant (FCFA)", "Type", "Auteur"];
    const rows = filtered.map(t => [
      t.date,
      t.motif,
      `${t.type === "entrée" ? "+" : "-"}${t.montant.toLocaleString("fr-FR")} FCFA`,
      t.type.toUpperCase(),
      t.par
    ]);
    exportToPDF({
      title: "Rapport de Caisse AD-CI",
      subtitle: `Filtre : ${tab} | Nombre de mouvements : ${filtered.length} | Solde : ${solde.toLocaleString("fr-FR")} FCFA`,
      headers,
      rows,
      filename: "Rapport_AD_Caisse"
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageTitle title="Caisse de l'Église" subtitle="Trésorerie générale et suivi des mouvements de fonds" />

      {/* Balance card */}
      <div
        className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D1F5C 0%, #1B3FA6 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,168,67,0.35) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div style={{ fontSize: "11px", opacity: 0.75, fontWeight: 700, letterSpacing: "0.08em" }}>SOLDE ACTUEL</div>
        <div style={{ fontWeight: 900, fontSize: "28px", fontFamily: "'Poppins', sans-serif", marginTop: "4px" }}>
          {solde.toLocaleString("fr-FR")} <span style={{ fontSize: "14px", opacity: 0.8 }}>FCFA</span>
        </div>
        <div className="flex gap-6 mt-4">
          <div>
            <div style={{ fontSize: "11px", opacity: 0.65 }}>Entrées</div>
            <div style={{ fontWeight: 800, color: "#4ADE80", fontSize: "14px" }}>
              +{totalEntrées.toLocaleString("fr-FR")} FCFA
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", opacity: 0.65 }}>Sorties</div>
            <div style={{ fontWeight: 800, color: "#FCA5A5", fontSize: "14px" }}>
              -{totalSorties.toLocaleString("fr-FR")} FCFA
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl p-1 mb-4" style={{ background: "#E8ECF4" }}>
        {(["Tout", "Entrées", "Sorties"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg transition-all"
            style={{
              background: tab === t ? "white" : "transparent",
              color: tab === t ? "#1B3FA6" : "#64748B",
              fontWeight: tab === t ? 700 : 500,
              fontSize: "14px",
              boxShadow: tab === t ? "0 2px 8px rgba(13,31,92,0.08)" : "none",
            }}
          >
            {t}
          </button>
        ))}
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
            placeholder="Rechercher une transaction..."
            className="flex-1 outline-none"
            style={{ background: "transparent", color: "#0D1F5C", fontSize: "14px" }}
            aria-label="Rechercher une transaction"
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

      {/* Transaction list */}
      <div
        className="rounded-2xl overflow-hidden card-ad"
        style={{
          background: "white",
        }}
      >
        {filtered.map((tx: Transaction, i) => {
          const isIncome = tx.type === "entrée";
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(27,63,166,0.07)" : "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isIncome ? "#DCFCE7" : "#FEE2E2" }}
              >
                {isIncome ? (
                  <TrendingUp size={16} style={{ color: "#16A34A" }} />
                ) : (
                  <TrendingDown size={16} style={{ color: "#DC2626" }} />
                )}
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

        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#64748B" }}>
            Aucune transaction trouvée
          </div>
        )}
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
        <span className="hidden sm:inline">Nouvelle transaction</span>
      </button>

      {/* New transaction modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tx-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                id="tx-modal-title"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: "#0D1F5C",
                  fontSize: "18px",
                }}
              >
                Nouvelle transaction
              </h3>
              <button type="button" onClick={() => setShowModal(false)} aria-label="Fermer la modal">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex rounded-xl p-1 mb-4" style={{ background: "#E8ECF4" }}>
              {(["entrée", "sortie"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(t)}
                  className="flex-1 py-2 rounded-lg transition-all capitalize"
                  style={{
                    background: newType === t ? (t === "entrée" ? "#DCFCE7" : "#FEE2E2") : "transparent",
                    color: newType === t ? (t === "entrée" ? "#16A34A" : "#DC2626") : "#64748B",
                    fontWeight: newType === t ? 700 : 500,
                    fontSize: "14px",
                  }}
                >
                  {t === "entrée" ? "Entrée +" : "Sortie −"}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {[
                { label: "Motif", placeholder: "Ex: Offrande du dimanche", type: "text" },
                { label: "Montant (FCFA)", placeholder: "0", type: "number" },
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
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 rounded-xl"
                  style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
