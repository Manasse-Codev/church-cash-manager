import { useState } from "react";
import { Building2, Plus, Search, X, Package } from "lucide-react";

const depenses = [
  { id: 1, date: "04 Jul 2026", article: "Sacs de ciment (200 sacs)", montant: 480000, fournisseur: "SCIMAF Brazzaville", categorie: "Matériaux" },
  { id: 2, date: "01 Jul 2026", article: "Ferraillage – lot 3", montant: 350000, fournisseur: "Métal Congo", categorie: "Matériaux" },
  { id: 3, date: "28 Jun 2026", article: "Main d'œuvre – semaine 12", montant: 240000, fournisseur: "Équipe Maître Loubaki", categorie: "Main d'œuvre" },
  { id: 4, date: "22 Jun 2026", article: "Sable et gravier (10 m³)", montant: 180000, fournisseur: "Carrière Kintélé", categorie: "Matériaux" },
  { id: 5, date: "20 Jun 2026", article: "Planches coffrage", montant: 95000, fournisseur: "Scierie Moukali", categorie: "Matériaux" },
  { id: 6, date: "15 Jun 2026", article: "Main d'œuvre – semaine 11", montant: 240000, fournisseur: "Équipe Maître Loubaki", categorie: "Main d'œuvre" },
  { id: 7, date: "10 Jun 2026", article: "Frais architecte", montant: 150000, fournisseur: "Cabinet Bâtir Congo", categorie: "Honoraires" },
  { id: 8, date: "05 Jun 2026", article: "Tuyauterie PVC", montant: 72000, fournisseur: "Quincaillerie Centrale", categorie: "Plomberie" },
];

const budget = 25000000;
const totalDépensé = depenses.reduce((s, d) => s + d.montant, 0);
const resteBudget = budget - totalDépensé;

const catColors: Record<string, { bg: string; text: string }> = {
  "Matériaux": { bg: "#F5E0CE", text: "#C67B4B" },
  "Main d'œuvre": { bg: "#D4EDE3", text: "#2F6B4E" },
  "Honoraires": { bg: "#F5E8C0", text: "#8B6914" },
  "Plomberie": { bg: "#E0E8F5", text: "#2B5C8A" },
};

export function Construction() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = depenses.filter((d) =>
    d.article.toLowerCase().includes(search.toLowerCase()) ||
    d.fournisseur.toLowerCase().includes(search.toLowerCase())
  );

  const pct = Math.round((totalDépensé / budget) * 100);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #C67B4B, #D4A843)" }}
        >
          <Building2 size={22} color="white" />
        </div>
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: "#3A3226",
              fontSize: "24px",
            }}
          >
            Construction
          </h1>
          <p style={{ color: "#6B5744", fontSize: "13px" }}>Dépenses du chantier du temple</p>
        </div>
      </div>

      {/* Budget overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div
          className="sm:col-span-1 rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #C67B4B 0%, #8B5E3C 100%)",
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
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ fontSize: "11px", opacity: 0.75 }}>BUDGET TOTAL</div>
          <div style={{ fontWeight: 900, fontSize: "20px", fontFamily: "'Playfair Display', serif" }}>
            {(budget / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: "11px", opacity: 0.65 }}>FCFA</div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "white",
            border: "1px solid rgba(198,123,75,0.12)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#6B5744", fontWeight: 600 }}>TOTAL DÉPENSÉ</div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#C0392B", fontFamily: "'Playfair Display', serif" }}>
            {(totalDépensé / 1000000).toFixed(2)}M
          </div>
          <div style={{ fontSize: "11px", color: "#C67B4B" }}>FCFA</div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "white",
            border: "1px solid rgba(47,107,78,0.2)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#6B5744", fontWeight: 600 }}>BUDGET RESTANT</div>
          <div style={{ fontWeight: 900, fontSize: "20px", color: "#2F6B4E", fontFamily: "'Playfair Display', serif" }}>
            {(resteBudget / 1000000).toFixed(2)}M
          </div>
          <div style={{ fontSize: "11px", color: "#2F6B4E" }}>FCFA</div>
        </div>
      </div>

      {/* Progress */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "white",
          border: "1px solid rgba(198,123,75,0.12)",
          boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
        }}
      >
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#3A3226" }}>Avancement budgétaire</span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#C67B4B" }}>{pct}%</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#F0EBE0" }}>
          <div
            className="h-full rounded-full relative overflow-hidden"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #D4A843, #C67B4B)" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.25) 4px, rgba(255,255,255,0.25) 8px)",
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "#6B5744", marginTop: "6px" }}>
          {totalDépensé.toLocaleString("fr-FR")} FCFA dépensés sur {budget.toLocaleString("fr-FR")} FCFA
        </div>
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
          placeholder="Rechercher article ou fournisseur..."
          className="flex-1 outline-none"
          style={{ background: "transparent", color: "#3A3226", fontSize: "14px" }}
        />
      </div>

      {/* Table / Cards */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(198,123,75,0.12)",
          boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
        }}
      >
        {/* Desktop table header */}
        <div
          className="hidden md:grid grid-cols-5 gap-4 px-4 py-3"
          style={{ background: "#F5EFE4", borderBottom: "1px solid rgba(198,123,75,0.1)" }}
        >
          {["Date", "Article", "Fournisseur", "Catégorie", "Montant"].map((h) => (
            <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#6B5744" }}>{h}</div>
          ))}
        </div>

        {filtered.map((d, i) => {
          const colors = catColors[d.categorie] || { bg: "#F0EBE0", text: "#6B5744" };
          return (
            <div key={d.id}>
              {/* Mobile card */}
              <div
                className="md:hidden px-4 py-3"
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(198,123,75,0.08)" : "none" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 700, color: "#3A3226", fontSize: "14px" }} className="truncate">
                      {d.article}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B5744" }}>
                      {d.date} · {d.fournisseur}
                    </div>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full mt-1"
                      style={{ background: colors.bg, color: colors.text, fontSize: "10px", fontWeight: 700 }}
                    >
                      {d.categorie}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, color: "#C0392B", fontSize: "15px", flexShrink: 0 }}>
                    -{d.montant.toLocaleString("fr-FR")}
                  </div>
                </div>
              </div>

              {/* Desktop row */}
              <div
                className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 items-center"
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(198,123,75,0.08)" : "none" }}
              >
                <div style={{ fontSize: "13px", color: "#6B5744" }}>{d.date}</div>
                <div style={{ fontWeight: 600, color: "#3A3226", fontSize: "13px" }}>{d.article}</div>
                <div style={{ fontSize: "13px", color: "#6B5744" }}>{d.fournisseur}</div>
                <div>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: colors.bg, color: colors.text, fontSize: "11px", fontWeight: 700 }}
                  >
                    {d.categorie}
                  </span>
                </div>
                <div style={{ fontWeight: 800, color: "#C0392B", fontSize: "14px" }}>
                  -{d.montant.toLocaleString("fr-FR")}
                </div>
              </div>
            </div>
          );
        })}
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
        <span className="hidden sm:inline">Nouvelle dépense</span>
      </button>

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
                Nouvelle dépense
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} style={{ color: "#6B5744" }} />
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
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226" }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                    style={{
                      background: "#F5EFE4",
                      border: "1px solid rgba(198,123,75,0.2)",
                      color: "#3A3226",
                      fontSize: "15px",
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226" }}>Catégorie</label>
                <select
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#F5EFE4",
                    border: "1px solid rgba(198,123,75,0.2)",
                    color: "#3A3226",
                    fontSize: "15px",
                  }}
                >
                  {Object.keys(catColors).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
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
