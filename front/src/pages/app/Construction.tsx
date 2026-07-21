import { useState, useEffect } from "react";
import { Building2, Plus, Search, X, Download, Trash2, Edit } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { ProgressBar } from "../../components/shared/ProgressBar";
import { exportToExcel, exportToPDF } from "../../lib/export-utils";
import { api } from "../../lib/api-client";

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  "Matériaux":    { bg: "#EEF3FF", text: "#1B3FA6" },
  "Main d'œuvre": { bg: "#DCFCE7", text: "#16A34A" },
  "Honoraires":   { bg: "#FEF3C7", text: "#D97706" },
  "Plomberie":    { bg: "#E0E8F5", text: "#2B5C8A" },
};

export function Construction() {
  const [depenses, setDepenses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ budget: 25000000, totalDepenses: 0 });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Formulaire dépense
  const [article, setArticle] = useState("");
  const [fournisseur, setFournisseur] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categorie, setCategorie] = useState("Matériaux");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire budget
  const [newBudget, setNewBudget] = useState("");
  const [isSubmittingBudget, setIsSubmittingBudget] = useState(false);

  const fetchConstructionData = async () => {
    try {
      const [depensesRes, statsRes] = await Promise.all([
        api.get<any>("/construction/depenses"),
        api.get<any>("/construction/stats"),
      ]);
      
      const formatted = (depensesRes.data || []).map((d: any) => ({
        id: d.id.toString(),
        date: d.date, // already formatted by NestJS backend
        rawDate: d.date,
        article: d.article,
        montant: d.montant,
        fournisseur: d.fournisseur,
        categorie: d.categorie,
        note: d.note,
      }));

      setDepenses(formatted);
      
      // Mapper les champs de statistiques réelles du backend vers l'état local du frontend
      const budgetTotal = statsRes.data?.budgetTotal ?? 25000000;
      const totalDepenses = statsRes.data?.totalDepense ?? 0;
      
      setStats({
        budget: budgetTotal,
        totalDepenses: totalDepenses,
      });
      setNewBudget(budgetTotal.toString());
    } catch (error) {
      console.error("Erreur lors de la récupération des données de construction", error);
    }
  };

  useEffect(() => {
    fetchConstructionData();
  }, []);

  const totalDépensé = stats.totalDepenses ?? 0;
  const budgetTotal = stats.budget ?? 25000000;
  const resteBudget = budgetTotal - totalDépensé;
  const pct = budgetTotal > 0 ? Math.round((totalDépensé / budgetTotal) * 100) : 0;

  const filtered = depenses.filter((d) =>
    d.article.toLowerCase().includes(search.toLowerCase()) ||
    d.fournisseur.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportExcel = () => {
    const dataToExport = filtered.map(d => ({
      "Date": d.date,
      "Article": d.article,
      "Catégorie": d.categorie,
      "Fournisseur": d.fournisseur,
      "Montant (FCFA)": d.montant,
      "Note": d.note || ""
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
      subtitle: `Dépensé : ${totalDépensé.toLocaleString("fr-FR")} FCFA / Budget : ${budgetTotal.toLocaleString("fr-FR")} FCFA (${pct}% consommé)`,
      headers,
      rows,
      filename: "Rapport_AD_Chantier"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article.trim() || !fournisseur.trim() || !montant || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post("/construction/depenses", {
        article: article.trim(),
        fournisseur: fournisseur.trim(),
        montant: parseFloat(montant),
        date: new Date(date).toISOString(),
        categorie,
        note: note.trim() || undefined,
      });

      setArticle("");
      setFournisseur("");
      setMontant("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategorie("Matériaux");
      setNote("");
      setShowModal(false);
      await fetchConstructionData();
    } catch (error) {
      alert("Erreur lors de la création de la dépense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget || isSubmittingBudget) return;

    setIsSubmittingBudget(true);
    try {
      await api.put("/construction/budget", {
        montant: parseFloat(newBudget),
      });
      setShowBudgetModal(false);
      await fetchConstructionData();
    } catch (error) {
      alert("Erreur lors de la modification du budget");
    } finally {
      setIsSubmittingBudget(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette dépense ?")) return;

    try {
      await api.delete(`/construction/depenses/${id}`);
      await fetchConstructionData();
    } catch (error) {
      alert("Erreur lors de la suppression de la dépense");
    }
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
          <div className="flex justify-between items-center">
            <div style={{ fontSize: "11px", opacity: 0.75, fontWeight: 700 }}>BUDGET TOTAL</div>
            <button
              type="button"
              onClick={() => setShowBudgetModal(true)}
              className="p-1 hover:bg-white/20 rounded text-white transition-all cursor-pointer"
              title="Modifier le budget"
            >
              <Edit size={12} />
            </button>
          </div>
          <div style={{ fontWeight: 900, fontSize: "20px", fontFamily: "'Poppins', sans-serif", marginTop: "2px" }}>
            {(budgetTotal / 1000000).toFixed(1)}M
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
          {totalDépensé.toLocaleString("fr-FR")} FCFA dépensés sur {budgetTotal.toLocaleString("fr-FR")} FCFA
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
          className="hidden md:grid grid-cols-6 gap-4 px-4 py-3"
          style={{ background: "#EEF3FF", borderBottom: "1px solid rgba(27,63,166,0.1)" }}
        >
          {["Date", "Article", "Fournisseur", "Catégorie", "Montant", "Actions"].map((h) => (
            <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#0D1F5C" }}>{h}</div>
          ))}
        </div>

        {filtered.map((d: any, i) => {
          const colors = CAT_COLORS[d.categorie] || { bg: "#E8ECF4", text: "#64748B" };
          return (
            <div key={d.id}>
              {/* Mobile card */}
              <div
                className="md:hidden px-4 py-3.5 relative group"
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
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full"
                        style={{ background: colors.bg, color: colors.text, fontSize: "10px", fontWeight: 700 }}
                      >
                        {d.categorie}
                      </span>
                      {d.note && <span className="text-[10px] text-gray-400 truncate italic">({d.note})</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div style={{ fontWeight: 800, color: "#DC2626", fontSize: "15px" }}>
                      -{d.montant.toLocaleString("fr-FR")}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                      title="Supprimer la dépense"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop row */}
              <div
                className="hidden md:grid grid-cols-6 gap-4 px-4 py-3.5 items-center group"
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
                <div>
                  <button
                    type="button"
                    onClick={() => handleDelete(d.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-all cursor-pointer"
                    title="Supprimer la dépense"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune dépense enregistrée
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
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

      {/* Add Dépense Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="const-modal-title"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="const-modal-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#0D1F5C", fontSize: "18px" }}>
                Nouvelle dépense
              </h3>
              <button type="button" onClick={() => setShowModal(false)} aria-label="Fermer la modal" className="cursor-pointer">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Article / Description</label>
                <input
                  type="text"
                  required
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  placeholder="Ex: Sacs de ciment"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Fournisseur</label>
                <input
                  type="text"
                  required
                  value={fournisseur}
                  onChange={(e) => setFournisseur(e.target.value)}
                  placeholder="Nom du fournisseur"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Montant (FCFA)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Catégorie</label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none cursor-pointer"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  aria-label="Sélectionner une catégorie"
                >
                  {Object.keys(CAT_COLORS).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Note (optionnelle)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: Facture #2839"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="py-3 rounded-xl cursor-pointer" style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}>Annuler</button>
                <button type="submit" disabled={isSubmitting} className="py-3 rounded-xl cursor-pointer" style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Edit Budget Modal */}
      {showBudgetModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowBudgetModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="budget-modal-title"
        >
          <form
            onSubmit={handleUpdateBudget}
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="budget-modal-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#0D1F5C", fontSize: "18px" }}>
                Modifier le budget total
              </h3>
              <button type="button" onClick={() => setShowBudgetModal(false)} aria-label="Fermer la modal" className="cursor-pointer">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Montant du budget (FCFA)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  placeholder="Ex: 25000000"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button type="button" onClick={() => setShowBudgetModal(false)} className="py-3 rounded-xl cursor-pointer" style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}>Annuler</button>
                <button type="submit" disabled={isSubmittingBudget} className="py-3 rounded-xl cursor-pointer" style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}>
                  {isSubmittingBudget ? "Modification..." : "Modifier"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
