import { useState } from "react";
import { TrendingUp, TrendingDown, Plus, Search, X } from "lucide-react";

type Tab = "Tout" | "Entrées" | "Sorties";

const transactions = [
  { id: 1, date: "06 Jul 2026", motif: "Offrande du dimanche", montant: 385000, type: "entrée", par: "Frère Moukala" },
  { id: 2, date: "05 Jul 2026", motif: "Achat mobilier pasteur", montant: -85000, type: "sortie", par: "Admin" },
  { id: 3, date: "03 Jul 2026", motif: "Dîme mensuelle – Section Femmes", montant: 95000, type: "entrée", par: "Sœur Bilomba" },
  { id: 4, date: "02 Jul 2026", motif: "Électricité – Mois de juin", montant: -42000, type: "sortie", par: "Admin" },
  { id: 5, date: "01 Jul 2026", motif: "Offrande spéciale construction", montant: 250000, type: "entrée", par: "Diacre Nzinzi" },
  { id: 6, date: "28 Jun 2026", motif: "Eau – Mois de juin", montant: -18000, type: "sortie", par: "Admin" },
  { id: 7, date: "25 Jun 2026", motif: "Don famille Nguesso", montant: 500000, type: "entrée", par: "Frère Nguesso" },
  { id: 8, date: "22 Jun 2026", motif: "Achat papeterie", montant: -15000, type: "sortie", par: "Admin" },
  { id: 9, date: "20 Jun 2026", motif: "Quête du mercredi", montant: 78000, type: "entrée", par: "Frère Malanda" },
  { id: 10, date: "15 Jun 2026", motif: "Location sono – Conférence", montant: -35000, type: "sortie", par: "Admin" },
];

const solde = transactions.reduce((s, t) => s + t.montant, 0);
const totalEntrées = transactions.filter(t => t.type === "entrée").reduce((s, t) => s + t.montant, 0);
const totalSorties = Math.abs(transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0));

export function Caisse() {
  const [tab, setTab] = useState<Tab>("Tout");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState<"entrée" | "sortie">("entrée");

  const filtered = transactions.filter((t) => {
    const matchTab =
      tab === "Tout" ||
      (tab === "Entrées" && t.type === "entrée") ||
      (tab === "Sorties" && t.type === "sortie");
    const matchSearch = t.motif.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            color: "#3A3226",
            fontSize: "24px",
          }}
        >
          Caisse de l'Église
        </h1>
        <p style={{ color: "#6B5744", fontSize: "13px" }}>Trésorerie générale</p>
      </div>

      {/* Balance card */}
      <div
        className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #3A3226 0%, #6B5744 100%)",
          color: "white",
        }}
      >
        {/* Gold glow */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,168,67,0.4) 0%, transparent 70%)",
          }}
        />
        <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>SOLDE ACTUEL</div>
        <div style={{ fontWeight: 900, fontSize: "28px", fontFamily: "'Playfair Display', serif" }}>
          {solde.toLocaleString("fr-FR")} <span style={{ fontSize: "14px", opacity: 0.8 }}>FCFA</span>
        </div>
        <div className="flex gap-6 mt-4">
          <div>
            <div style={{ fontSize: "11px", opacity: 0.65 }}>Entrées</div>
            <div style={{ fontWeight: 700, color: "#4ADE80", fontSize: "14px" }}>
              +{totalEntrées.toLocaleString("fr-FR")}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", opacity: 0.65 }}>Sorties</div>
            <div style={{ fontWeight: 700, color: "#FCA5A5", fontSize: "14px" }}>
              -{totalSorties.toLocaleString("fr-FR")}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex rounded-xl p-1 mb-4"
        style={{ background: "#F0EBE0" }}
      >
        {(["Tout", "Entrées", "Sorties"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg transition-all"
            style={{
              background: tab === t ? "white" : "transparent",
              color: tab === t ? "#C67B4B" : "#6B5744",
              fontWeight: tab === t ? 700 : 500,
              fontSize: "14px",
              boxShadow: tab === t ? "0 1px 4px rgba(198,123,75,0.15)" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
        style={{ background: "white", border: "1px solid rgba(198,123,75,0.2)" }}
      >
        <Search size={16} style={{ color: "#C67B4B", flexShrink: 0 }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une transaction..."
          className="flex-1 outline-none"
          style={{ background: "transparent", color: "#3A3226", fontSize: "14px" }}
        />
      </div>

      {/* Transaction list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(198,123,75,0.12)",
          boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
        }}
      >
        {filtered.map((tx, i) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 px-4 py-3.5"
            style={{
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(198,123,75,0.08)" : "none",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: tx.type === "entrée" ? "#D4EDE3" : "#F5E0CE" }}
            >
              {tx.type === "entrée" ? (
                <TrendingUp size={16} style={{ color: "#2F6B4E" }} />
              ) : (
                <TrendingDown size={16} style={{ color: "#C67B4B" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                style={{ fontWeight: 700, color: "#3A3226", fontSize: "14px" }}
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
                fontSize: "15px",
                color: tx.type === "entrée" ? "#2F6B4E" : "#C0392B",
                flexShrink: 0,
              }}
            >
              {tx.type === "entrée" ? "+" : "-"}{Math.abs(tx.montant).toLocaleString("fr-FR")}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#6B5744" }}>
            Aucune transaction trouvée
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-lg"
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
        <span className="hidden sm:inline">Nouvelle transaction</span>
      </button>

      {/* New transaction modal */}
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
            <div className="flex items-center justify-between mb-5">
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: "#3A3226",
                  fontSize: "18px",
                }}
              >
                Nouvelle transaction
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} style={{ color: "#6B5744" }} />
              </button>
            </div>

            {/* Type toggle */}
            <div
              className="flex rounded-xl p-1 mb-4"
              style={{ background: "#F0EBE0" }}
            >
              {(["entrée", "sortie"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className="flex-1 py-2 rounded-lg transition-all capitalize"
                  style={{
                    background: newType === t ? (t === "entrée" ? "#D4EDE3" : "#F5E0CE") : "transparent",
                    color: newType === t ? (t === "entrée" ? "#2F6B4E" : "#C67B4B") : "#6B5744",
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
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
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
