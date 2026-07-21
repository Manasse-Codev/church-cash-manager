import { useState, useEffect } from "react";
import { Music, Users, Heart, Baby, Book, Shield, Plus, X, ChevronRight } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { ProgressBar } from "../../components/shared/ProgressBar";
import { api } from "../../lib/api-client";

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

const ICONS_POOL = ["Music", "Users", "Heart", "Baby", "Book", "Shield"];

export function Departements() {
  const [departements, setDepartements] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);

  // Formulaire département
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [membres, setMembres] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire mouvement département
  const [moveMotif, setMoveMotif] = useState("");
  const [moveMontant, setMoveMontant] = useState("");
  const [moveType, setMoveType] = useState<"dotation" | "depense">("depense");
  const [isSubmittingMove, setIsSubmittingMove] = useState(false);

  const fetchDepartements = async () => {
    try {
      const response = await api.get<any>("/departements");
      setDepartements(response.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des départements", error);
    }
  };

  useEffect(() => {
    fetchDepartements();
  }, []);

  const dept = departements.find((d) => d.id === selectedId);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !description.trim() || !budget || isSubmitting) return;

    setIsSubmitting(true);
    
    // Déterminer un thème aléatoire ou par défaut
    const randomIcon = ICONS_POOL[Math.floor(Math.random() * ICONS_POOL.length)];
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    
    try {
      await api.post("/departements", {
        nom: nom.trim(),
        description: description.trim(),
        budget: parseFloat(budget),
        membres: membres ? parseInt(membres) : 0,
        icon: randomIcon,
        color: randomColor,
        bg: randomColor + "15", // Opacité à 8%
      });

      setNom("");
      setDescription("");
      setBudget("");
      setMembres("");
      setShowAddModal(false);
      await fetchDepartements();
    } catch (error) {
      alert("Erreur lors de la création du département");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !moveMotif.trim() || !moveMontant || isSubmittingMove) return;

    setIsSubmittingMove(true);
    // Les dépenses du département diminuent le budget (montant négatif), les dotations augmentent (montant positif)
    const finalAmount = moveType === "depense" ? -Math.abs(parseFloat(moveMontant)) : Math.abs(parseFloat(moveMontant));

    try {
      await api.post(`/departements/${selectedId}/mouvements`, {
        motif: moveMotif.trim(),
        montant: finalAmount,
        date: new Date().toISOString(),
      });

      setMoveMotif("");
      setMoveMontant("");
      setMoveType("depense");
      setShowMoveModal(false);
      await fetchDepartements();
    } catch (error) {
      alert("Erreur lors de la création de l'écriture");
    } finally {
      setIsSubmittingMove(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <PageTitle title="Départements" subtitle="Budgets, effectifs et activités par section de l'église" />
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary cursor-pointer"
          style={{ fontSize: "13px" }}
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departements.map((d: any) => {
          const Icon = ICON_MAP[d.icon] || Book;
          const totalSpent = Math.abs(d.solde < 0 ? d.solde : 0);
          const pct = d.budget > 0 ? Math.round((totalSpent / d.budget) * 100) : 0;
          const restant = d.budget - totalSpent;
          const theme = DEPT_THEMES[d.nom] || { bg: d.bg || "#E8ECF4", color: d.color || "#64748B" };

          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedId(d.id)}
              className="text-left rounded-2xl p-4 transition-all hover:shadow-md active:scale-[0.98] card-ad cursor-pointer"
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
                    {(totalSpent / 1000).toFixed(0)}k
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
        {departements.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            Aucun département configuré
          </div>
        )}
      </div>

      {/* Department detail sheet */}
      {dept && (() => {
        const theme = DEPT_THEMES[dept.nom] || { bg: dept.bg || "#E8ECF4", color: dept.color || "#64748B" };
        const Icon = ICON_MAP[dept.icon] || Book;
        const totalSpent = Math.abs(dept.solde < 0 ? dept.solde : 0);
        const remaining = dept.budget - totalSpent;
        
        return (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            style={{ background: "rgba(13,31,92,0.6)" }}
            onClick={() => setSelectedId(null)}
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
                <button type="button" onClick={() => setSelectedId(null)} aria-label="Fermer la modal" className="cursor-pointer">
                  <X size={20} style={{ color: "#64748B" }} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 90px)" }}>
                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Budget", value: dept.budget, color: "#0D1F5C" },
                    { label: "Dépensé", value: totalSpent, color: "#DC2626" },
                    { label: "Restant", value: remaining, color: "#16A34A" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-3 text-center"
                      style={{ background: "#EEF3FF" }}
                    >
                      <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>{s.label}</div>
                      <div style={{ fontWeight: 800, color: s.color, fontSize: "14px", marginTop: "2px" }}>
                        {(s.value).toLocaleString("fr-FR")}
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
                <div className="space-y-2 max-h-[30vh] overflow-y-auto mb-4">
                  {(dept.mouvements || []).map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-3 px-4 rounded-xl"
                      style={{ background: "#EEF3FF" }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#0D1F5C", fontSize: "14px" }}>{tx.motif}</div>
                        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "1px" }}>
                          {new Date(tx.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
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
                  {(dept.mouvements || []).length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-500 italic">
                      Aucune transaction enregistrée
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowMoveModal(true)}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 btn-primary cursor-pointer"
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
          <form
            onSubmit={handleCreateDept}
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="add-dept-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#0D1F5C", fontSize: "18px" }}>
                Nouveau département
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} aria-label="Fermer la modal" className="cursor-pointer">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Nom du département</label>
                <input
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Chœur, Jeunesse, Prière..."
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{ background: "#EEF3FF", border: "1.5px solid rgba(27,63,166,0.15)", color: "#0D1F5C", fontSize: "15px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Description</label>
                <input
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Courte description"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{ background: "#EEF3FF", border: "1.5px solid rgba(27,63,166,0.15)", color: "#0D1F5C", fontSize: "15px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Budget annuel (FCFA)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{ background: "#EEF3FF", border: "1.5px solid rgba(27,63,166,0.15)", color: "#0D1F5C", fontSize: "15px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Effectif membres (optionnel)</label>
                <input
                  type="number"
                  min="0"
                  value={membres}
                  onChange={(e) => setMembres(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{ background: "#EEF3FF", border: "1.5px solid rgba(27,63,166,0.15)", color: "#0D1F5C", fontSize: "15px" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="py-3 rounded-xl cursor-pointer" style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}>Annuler</button>
                <button type="submit" disabled={isSubmitting} className="py-3 rounded-xl cursor-pointer" style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}>
                  {isSubmitting ? "Création..." : "Créer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Add Move (Ecriture) Modal */}
      {showMoveModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowMoveModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="move-modal-title"
        >
          <form
            onSubmit={handleCreateMove}
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6 shadow-2xl"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="move-modal-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#0D1F5C", fontSize: "18px" }}>
                Nouvelle écriture ({dept?.nom})
              </h3>
              <button type="button" onClick={() => setShowMoveModal(false)} aria-label="Fermer la modal" className="cursor-pointer">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="space-y-3">
              {/* Type toggle */}
              <div className="flex rounded-xl p-1 mb-4" style={{ background: "#E8ECF4" }}>
                {(["depense", "dotation"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMoveType(t)}
                    className="flex-1 py-2 rounded-lg transition-all capitalize cursor-pointer"
                    style={{
                      background: moveType === t ? (t === "dotation" ? "#DCFCE7" : "#FEE2E2") : "transparent",
                      color: moveType === t ? (t === "dotation" ? "#16A34A" : "#DC2626") : "#64748B",
                      fontWeight: moveType === t ? 700 : 500,
                      fontSize: "14px",
                    }}
                  >
                    {t === "dotation" ? "Dotation +" : "Dépense −"}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Motif</label>
                <input
                  required
                  value={moveMotif}
                  onChange={(e) => setMoveMotif(e.target.value)}
                  placeholder="Ex: Achat fournitures, Subvention..."
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{ background: "#EEF3FF", border: "1.5px solid rgba(27,63,166,0.15)", color: "#0D1F5C", fontSize: "15px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C" }}>Montant (FCFA)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={moveMontant}
                  onChange={(e) => setMoveMontant(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{ background: "#EEF3FF", border: "1.5px solid rgba(27,63,166,0.15)", color: "#0D1F5C", fontSize: "15px" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button type="button" onClick={() => setShowMoveModal(false)} className="py-3 rounded-xl cursor-pointer" style={{ background: "#E8ECF4", color: "#0D1F5C", fontWeight: 700 }}>Annuler</button>
                <button type="submit" disabled={isSubmittingMove} className="py-3 rounded-xl cursor-pointer" style={{ background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)", color: "white", fontWeight: 700 }}>
                  {isSubmittingMove ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
