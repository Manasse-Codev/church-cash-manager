import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Download, Plus, CheckCircle, X, Trash2 } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { ProgressBar } from "../../components/shared/ProgressBar";
import { exportToExcel, exportToPDF } from "../../lib/export-utils";
import { api } from "../../lib/api-client";

const CATEGORIES = ["Tous", "Ancien", "Diacre", "Membre", "Bienfaiteur"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Ancien:      { bg: "#EEF3FF", text: "#1B3FA6" },
  Diacre:      { bg: "#DCFCE7", text: "#16A34A" },
  Membre:      { bg: "#FEF3C7", text: "#D97706" },
  Bienfaiteur: { bg: "#F3E8FF", text: "#7E22CE" },
};

export function Investisseurs() {
  const [investisseurs, setInvestisseurs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Tous");
  const [expanded, setExpanded] = useState<number | null>(null);
  
  // Modals
  const [showPayModal, setShowPayModal] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulaire payement
  const [payMontant, setPayMontant] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [payMethode, setPayMethode] = useState("Mobile Money");
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  // Formulaire nouvel investisseur
  const [addNom, setAddNom] = useState("");
  const [addCategorie, setAddCategorie] = useState("Membre");
  const [addPromesse, setAddPromesse] = useState("");
  const [addNote, setAddNote] = useState("");
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  const fetchInvestisseurs = async () => {
    try {
      const response = await api.get<any>("/investisseurs");
      const formatted = (response.data || []).map((i: any) => ({
        ...i,
        totalVerse: i.payé ?? 0,
        resteAPayer: Math.max(0, i.promesse - (i.payé ?? 0)),
        versements: (i.paiements || []).map((p: any) => ({
          ...p,
          date: p.date, // la date est déjà formatée par le backend ou brute
        }))
      }));
      setInvestisseurs(formatted);
    } catch (error) {
      console.error("Erreur lors de la récupération des investisseurs", error);
    }
  };

  useEffect(() => {
    fetchInvestisseurs();
  }, []);

  const filtered = investisseurs.filter((inv) => {
    const matchSearch = inv.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === "Tous" || inv.categorie === categorie;
    return matchSearch && matchCat;
  });

  const totalPromesses = investisseurs.reduce((s, i) => s + i.promesse, 0);
  const totalPayé = investisseurs.reduce((s, i) => s + (i.totalVerse ?? 0), 0);

  const handleExportExcel = () => {
    const dataToExport = filtered.map(i => ({
      "Nom complet": i.nom,
      "Catégorie": i.categorie,
      "Promesse (FCFA)": i.promesse,
      "Montant Payé (FCFA)": i.totalVerse ?? 0,
      "Reste à payer (FCFA)": i.resteAPayer ?? 0
    }));
    exportToExcel({
      data: dataToExport,
      filename: "AD_Investisseurs_Promesses",
      sheetName: "Investisseurs"
    });
  };

  const handleExportPDF = () => {
    const headers = ["Nom complet", "Catégorie", "Promesse", "Montant Payé", "Reste à payer"];
    const rows = filtered.map(i => [
      i.nom,
      i.categorie,
      `${i.promesse.toLocaleString("fr-FR")} FCFA`,
      `${(i.totalVerse ?? 0).toLocaleString("fr-FR")} FCFA`,
      `${(i.resteAPayer ?? 0).toLocaleString("fr-FR")} FCFA`
    ]);
    exportToPDF({
      title: "Rapport des Investisseurs & Bâtisseurs",
      subtitle: `Filtre : ${categorie} | Total Promesses : ${totalPromesses.toLocaleString("fr-FR")} FCFA | Total Payé : ${totalPayé.toLocaleString("fr-FR")} FCFA`,
      headers,
      rows,
      filename: "Rapport_AD_Investisseurs"
    });
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showPayModal === null || !payMontant || isSubmittingPay) return;

    setIsSubmittingPay(true);
    try {
      await api.post(`/investisseurs/${showPayModal}/versements`, {
        montant: parseFloat(payMontant),
        date: new Date(payDate).toISOString(),
        methode: payMethode,
      });

      setPayMontant("");
      setPayDate(new Date().toISOString().split("T")[0]);
      setPayMethode("Mobile Money");
      setShowPayModal(null);
      await fetchInvestisseurs();
    } catch (error) {
      alert("Erreur lors de l'enregistrement du versement");
    } finally {
      setIsSubmittingPay(false);
    }
  };

  const handleAddInvestisseur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addNom.trim() || !addPromesse || isSubmittingAdd) return;

    setIsSubmittingAdd(true);
    try {
      await api.post("/investisseurs", {
        nom: addNom.trim(),
        categorie: addCategorie,
        promesse: parseFloat(addPromesse),
        note: addNote.trim() || undefined,
      });

      setAddNom("");
      setAddCategorie("Membre");
      setAddPromesse("");
      setAddNote("");
      setShowAddModal(false);
      await fetchInvestisseurs();
    } catch (error) {
      alert("Erreur lors de la création de l'investisseur");
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet investisseur ?")) return;

    try {
      await api.delete(`/investisseurs/${id}`);
      setExpanded(null);
      await fetchInvestisseurs();
    } catch (error) {
      alert("Erreur lors de la suppression de l'investisseur");
    }
  };

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
        <ProgressBar value={totalPromesses > 0 ? (totalPayé / totalPromesses) * 100 : 0} color="#D4A843" showStripes />
        <div className="flex justify-between mt-2">
          <span style={{ fontSize: "12px", opacity: 0.75 }}>
            Payé: {totalPayé.toLocaleString("fr-FR")} FCFA
          </span>
          <span style={{ fontSize: "12px", opacity: 0.75, fontWeight: 700 }}>
            {totalPromesses > 0 ? Math.round((totalPayé / totalPromesses) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Filters & Export */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl min-w-[200px]"
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
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
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

        <div className="flex gap-2">
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

      {/* Investor cards */}
      <div className="space-y-3">
        {filtered.map((inv: any) => {
          const restant = inv.resteAPayer ?? 0;
          const payed = inv.totalVerse ?? 0;
          const pct = inv.promesse > 0 ? Math.round((payed / inv.promesse) * 100) : 0;
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
              <div className="w-full text-left p-4 relative group">
                <button
                  type="button"
                  className="w-full text-left cursor-pointer"
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
                        {payed.toLocaleString("fr-FR")}
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

                {/* Supprimer investisseur */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(inv.id);
                  }}
                  className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-all cursor-pointer"
                  title="Supprimer l'investisseur"
                >
                  <Trash2 size={15} />
                </button>
              </div>

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
                    {(inv.versements || []).map((p: any) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                        style={{ background: "#EEF3FF" }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "13px" }}>
                            {p.montant.toLocaleString("fr-FR")} FCFA
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748B", marginTop: "1px" }}>
                            {new Date(p.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })} · {p.methode}
                          </div>
                        </div>
                        <CheckCircle size={15} style={{ color: "#16A34A" }} />
                      </div>
                    ))}
                    {(inv.versements || []).length === 0 && (
                      <div className="text-center py-4 text-xs text-gray-500 italic">
                        Aucun paiement enregistré
                      </div>
                    )}
                  </div>
                  {restant > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPayModal(inv.id)}
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 btn-primary cursor-pointer"
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
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun investisseur enregistré
          </div>
        )}
      </div>

      {/* Add investor button */}
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
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
          <form
            onSubmit={handleAddPayment}
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
              <button type="button" onClick={() => setShowPayModal(null)} aria-label="Fermer la modal" className="cursor-pointer">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={payMontant}
                  onChange={(e) => setPayMontant(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  placeholder="Ex: 100 000"
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
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
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Méthode</label>
                <select
                  value={payMethode}
                  onChange={(e) => setPayMethode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none cursor-pointer"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  aria-label="Méthode de paiement"
                >
                  {["Mobile Money", "Espèces", "Virement bancaire", "Chèque"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPayModal(null)}
                  className="py-3 rounded-xl cursor-pointer"
                  style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className="py-3 rounded-xl cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}
                >
                  {isSubmittingPay ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Add Investor Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowAddModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
        >
          <form
            onSubmit={handleAddInvestisseur}
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                id="add-modal-title"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: "#0D1F5C",
                  fontSize: "18px",
                }}
              >
                Nouvel investisseur
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} aria-label="Fermer la modal" className="cursor-pointer">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Nom complet</label>
                <input
                  type="text"
                  required
                  value={addNom}
                  onChange={(e) => setAddNom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  placeholder="Ex: Frère Emmanuel Kouadio"
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Catégorie</label>
                <select
                  value={addCategorie}
                  onChange={(e) => setAddCategorie(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none cursor-pointer"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  aria-label="Catégorie de l'investisseur"
                >
                  {CATEGORIES.filter(c => c !== "Tous").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Promesse de don (FCFA)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={addPromesse}
                  onChange={(e) => setAddPromesse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  placeholder="Ex: 500000"
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Note (optionnelle)</label>
                <input
                  type="text"
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#EEF3FF",
                    border: "1.5px solid rgba(27,63,166,0.15)",
                    color: "#0D1F5C",
                    fontSize: "15px",
                  }}
                  placeholder="Ex: Engagement annuel"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 rounded-xl cursor-pointer"
                  style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="py-3 rounded-xl cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}
                >
                  {isSubmittingAdd ? "Création..." : "Créer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
