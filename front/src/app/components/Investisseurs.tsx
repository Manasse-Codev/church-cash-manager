import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

const investors = [
  {
    id: 1,
    nom: "Frère Emmanuel Moukala",
    categorie: "Ancien",
    promesse: 500000,
    payé: 350000,
    paiements: [
      { date: "05 Mar 2026", montant: 200000, méthode: "Mobile Money" },
      { date: "10 Mai 2026", montant: 150000, méthode: "Espèces" },
    ],
  },
  {
    id: 2,
    nom: "Sœur Marie-Thérèse Bilomba",
    categorie: "Membre",
    promesse: 300000,
    payé: 300000,
    paiements: [
      { date: "01 Fév 2026", montant: 150000, méthode: "Virement" },
      { date: "01 Avr 2026", montant: 150000, méthode: "Mobile Money" },
    ],
  },
  {
    id: 3,
    nom: "Diacre Joseph Nzinzi",
    categorie: "Diacre",
    promesse: 750000,
    payé: 200000,
    paiements: [
      { date: "15 Jan 2026", montant: 200000, méthode: "Espèces" },
    ],
  },
  {
    id: 4,
    nom: "Frère Paul Malanda",
    categorie: "Membre",
    promesse: 150000,
    payé: 50000,
    paiements: [
      { date: "20 Jun 2026", montant: 50000, méthode: "Mobile Money" },
    ],
  },
  {
    id: 5,
    nom: "Famille Nguesso-Mbeki",
    categorie: "Bienfaiteur",
    promesse: 2000000,
    payé: 1500000,
    paiements: [
      { date: "01 Jan 2026", montant: 500000, méthode: "Virement" },
      { date: "01 Mar 2026", montant: 500000, méthode: "Virement" },
      { date: "01 Jun 2026", montant: 500000, méthode: "Virement" },
    ],
  },
];

const categories = ["Tous", "Ancien", "Diacre", "Membre", "Bienfaiteur"];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Ancien: { bg: "#F5E0CE", text: "#C67B4B" },
  Diacre: { bg: "#D4EDE3", text: "#2F6B4E" },
  Membre: { bg: "#F5E8C0", text: "#8B6914" },
  Bienfaiteur: { bg: "#E8D4F0", text: "#6B3D8A" },
};

const FabricProgressBar = ({ value }: { value: number }) => {
  const capped = Math.min(value, 100);
  return (
    <div
      className="w-full h-2 rounded-full overflow-hidden"
      style={{ background: "rgba(198,123,75,0.15)" }}
    >
      <div
        className="h-full rounded-full relative overflow-hidden"
        style={{ width: `${capped}%`, background: "linear-gradient(90deg, #D4A843, #C67B4B)" }}
      >
        {/* Fabric stripe effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 6px)",
          }}
        />
      </div>
    </div>
  );
};

export function Investisseurs() {
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Tous");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showPayModal, setShowPayModal] = useState<number | null>(null);

  const filtered = investors.filter((inv) => {
    const matchSearch = inv.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === "Tous" || inv.categorie === categorie;
    return matchSearch && matchCat;
  });

  const totalPromesses = investors.reduce((s, i) => s + i.promesse, 0);
  const totalPayé = investors.reduce((s, i) => s + i.payé, 0);

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
          Investisseurs
        </h1>
        <p style={{ color: "#6B5744", fontSize: "13px" }}>Engagements pour la construction du temple</p>
      </div>

      {/* Summary bar */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "linear-gradient(135deg, #C67B4B 0%, #D4A843 100%)",
          color: "white",
        }}
      >
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: "13px", opacity: 0.85 }}>Total promis</span>
          <span style={{ fontWeight: 800, fontSize: "16px" }}>
            {totalPromesses.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
        <FabricProgressBar value={(totalPayé / totalPromesses) * 100} />
        <div className="flex justify-between mt-2">
          <span style={{ fontSize: "12px", opacity: 0.75 }}>
            Payé: {totalPayé.toLocaleString("fr-FR")} FCFA
          </span>
          <span style={{ fontSize: "12px", opacity: 0.75 }}>
            {Math.round((totalPayé / totalPromesses) * 100)}%
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl min-w-0"
          style={{ background: "white", border: "1px solid rgba(198,123,75,0.2)" }}
        >
          <Search size={16} style={{ color: "#C67B4B", flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un investisseur..."
            className="flex-1 outline-none min-w-0"
            style={{ background: "transparent", color: "#3A3226", fontSize: "14px" }}
          />
        </div>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="px-3 py-2 rounded-xl outline-none"
          style={{
            background: "white",
            border: "1px solid rgba(198,123,75,0.2)",
            color: "#3A3226",
            fontSize: "14px",
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Export buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "#F5E0CE", color: "#C67B4B", fontWeight: 600, fontSize: "13px" }}
        >
          <Download size={14} />
          PDF
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "#D4EDE3", color: "#2F6B4E", fontWeight: 600, fontSize: "13px" }}
        >
          <Download size={14} />
          Excel
        </button>
      </div>

      {/* Investor cards */}
      <div className="space-y-3">
        {filtered.map((inv) => {
          const restant = inv.promesse - inv.payé;
          const pct = Math.round((inv.payé / inv.promesse) * 100);
          const isExp = expanded === inv.id;
          const colors = categoryColors[inv.categorie] || { bg: "#F0EBE0", text: "#6B5744" };
          const isComplete = restant === 0;

          return (
            <div
              key={inv.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "white",
                border: "1px solid rgba(198,123,75,0.12)",
                boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
              }}
            >
              <button
                className="w-full text-left p-4"
                onClick={() => setExpanded(isExp ? null : inv.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontWeight: 700, color: "#3A3226", fontSize: "15px" }}>
                        {inv.nom}
                      </span>
                      {isComplete && <CheckCircle size={14} style={{ color: "#2F6B4E" }} />}
                    </div>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full mt-1"
                      style={{ background: colors.bg, color: colors.text, fontSize: "11px", fontWeight: 700 }}
                    >
                      {inv.categorie}
                    </span>
                  </div>
                  {isExp ? <ChevronUp size={18} style={{ color: "#6B5744", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "#6B5744", flexShrink: 0 }} />}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <div style={{ fontSize: "10px", color: "#6B5744", fontWeight: 600 }}>PROMESSE</div>
                    <div style={{ fontWeight: 800, color: "#3A3226", fontSize: "13px" }}>
                      {inv.promesse.toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#6B5744", fontWeight: 600 }}>PAYÉ</div>
                    <div style={{ fontWeight: 800, color: "#2F6B4E", fontSize: "13px" }}>
                      {inv.payé.toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#6B5744", fontWeight: 600 }}>RESTANT</div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "13px",
                        color: restant > 0 ? "#D4A843" : "#2F6B4E",
                      }}
                    >
                      {restant.toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FabricProgressBar value={pct} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#6B5744", flexShrink: 0 }}>{pct}%</span>
                </div>
              </button>

              {/* Expanded: payment history */}
              {isExp && (
                <div
                  className="px-4 pb-4 pt-0"
                  style={{ borderTop: "1px dashed rgba(198,123,75,0.2)" }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B5744", marginBottom: "8px", marginTop: "12px" }}>
                    HISTORIQUE DES PAIEMENTS
                  </div>
                  <div className="space-y-2 mb-4">
                    {inv.paiements.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 rounded-xl"
                        style={{ background: "#F5EFE4" }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: "#3A3226", fontSize: "13px" }}>
                            {p.montant.toLocaleString("fr-FR")} FCFA
                          </div>
                          <div style={{ fontSize: "11px", color: "#6B5744" }}>
                            {p.date} · {p.méthode}
                          </div>
                        </div>
                        <CheckCircle size={16} style={{ color: "#2F6B4E" }} />
                      </div>
                    ))}
                  </div>
                  {restant > 0 && (
                    <button
                      onClick={() => setShowPayModal(inv.id)}
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #D4A843, #C67B4B)",
                        color: "white",
                        fontWeight: 700,
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
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #D4A843, #C67B4B)",
          boxShadow: "0 6px 20px rgba(212,168,67,0.5)",
          zIndex: 40,
        }}
      >
        <Plus size={22} color="white" />
      </button>

      {/* Payment modal */}
      {showPayModal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(58,50,38,0.5)" }}
          onClick={() => setShowPayModal(null)}
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
                Ajouter un paiement
              </h3>
              <button onClick={() => setShowPayModal(null)}>
                <X size={20} style={{ color: "#6B5744" }} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Montant (FCFA)", placeholder: "Ex: 100 000", type: "number" },
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
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226" }}>Méthode</label>
                <select
                  className="w-full px-4 py-3 rounded-xl mt-1 outline-none"
                  style={{
                    background: "#F5EFE4",
                    border: "1px solid rgba(198,123,75,0.2)",
                    color: "#3A3226",
                    fontSize: "15px",
                  }}
                >
                  {["Mobile Money", "Espèces", "Virement bancaire", "Chèque"].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => setShowPayModal(null)}
                  className="py-3 rounded-xl"
                  style={{ background: "#F0EBE0", color: "#3A3226", fontWeight: 700 }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowPayModal(null)}
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
