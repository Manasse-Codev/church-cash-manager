import { useState } from "react";
import { Search, Plus, X, Share2, Copy, CheckCircle, Phone, Calendar } from "lucide-react";
import { PageTitle } from "../../components/shared/PageTitle";
import { MEMBRES } from "../../constants/mockData";
import type { Membre } from "../../types";

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  Ancien:      { bg: "#EEF3FF", text: "#1B3FA6" },
  Diacre:      { bg: "#DCFCE7", text: "#16A34A" },
  Membre:      { bg: "#FEF3C7", text: "#D97706" },
  Bienfaiteur: { bg: "#F3E8FF", text: "#7E22CE" },
};

const CATEGORIES = ["Tous", "Ancien", "Diacre", "Membre", "Bienfaiteur"];

const FORM_FIELDS = [
  { label: "Nom", type: "text", required: true },
  { label: "Prénom", type: "text", required: true },
  { label: "Téléphone", type: "tel", required: true },
  { label: "Catégorie", type: "select", required: true },
  { label: "Date de naissance", type: "date", required: false },
  { label: "Quartier", type: "text", required: false },
];

export function Membres() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(["Nom", "Prénom", "Téléphone", "Catégorie"]);

  const shareLink = `${window.location.origin}/inscription`;

  const filtered = MEMBRES.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      m.nom.toLowerCase().includes(q) ||
      m.prénom.toLowerCase().includes(q) ||
      m.téléphone.includes(q);
    const matchCat = catFilter === "Tous" || m.catégorie === catFilter;
    return matchSearch && matchCat;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <PageTitle title="Membres" subtitle={`${MEMBRES.length} membres enregistrés dans la base`} />
        </div>
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0"
          style={{ background: "#DCFCE7", color: "#16A34A", fontWeight: 700, fontSize: "13px" }}
        >
          <Share2 size={15} />
          <span className="hidden sm:inline">Lien d'inscription</span>
          <span className="sm:hidden">Lien</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl min-w-0"
          style={{ background: "white", border: "1.5px solid rgba(27,63,166,0.12)" }}
        >
          <Search size={16} style={{ color: "#1B3FA6", flexShrink: 0 }} aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="flex-1 outline-none min-w-0"
            style={{ background: "transparent", color: "#0D1F5C", fontSize: "14px" }}
            aria-label="Rechercher un membre"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
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
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Member list */}
      <div
        className="rounded-2xl overflow-hidden card-ad"
        style={{
          background: "white",
        }}
      >
        {filtered.map((m: Membre, i) => {
          const colors = CAT_COLORS[m.catégorie] || { bg: "#E8ECF4", text: "#64748B" };
          const initials = `${m.prénom[0]}${m.nom[0]}`;

          return (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(27,63,166,0.07)" : "none" }}
            >
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ fontWeight: 800, color: "#0D1F5C", fontSize: "14px" }}>
                    {m.prénom} {m.nom}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full"
                    style={{ background: colors.bg, color: colors.text, fontSize: "10px", fontWeight: 700 }}
                  >
                    {m.catégorie}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span
                    className="flex items-center gap-1"
                    style={{ fontSize: "12px", color: "#64748B" }}
                  >
                    <Phone size={12} style={{ color: "#1B3FA6" }} />
                    {m.téléphone}
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{ fontSize: "12px", color: "#64748B" }}
                  >
                    <Calendar size={12} style={{ color: "#1B3FA6" }} />
                    Depuis {m.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#64748B" }}>
            Aucun membre trouvé
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #0D1F5C, #1B3FA6)",
          boxShadow: "0 6px 20px rgba(27,63,166,0.4)",
          zIndex: 40,
        }}
        aria-label="Ajouter un membre"
      >
        <Plus size={22} color="white" />
      </button>

      {/* Share link modal */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(13,31,92,0.6)" }}
          onClick={() => setShowLinkModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                id="share-modal-title"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: "#0D1F5C",
                  fontSize: "18px",
                }}
              >
                Lien d'inscription
              </h3>
              <button type="button" onClick={() => setShowLinkModal(false)} aria-label="Fermer la modal">
                <X size={20} style={{ color: "#64748B" }} />
              </button>
            </div>

            {/* Field builder */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#0D1F5C", marginBottom: "8px" }}>
                Champs du formulaire
              </p>
              <div className="flex flex-wrap gap-2">
                {FORM_FIELDS.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => !f.required && toggleField(f.label)}
                    className="px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      background: selectedFields.includes(f.label) ? "#1B3FA6" : "#E8ECF4",
                      color: selectedFields.includes(f.label) ? "white" : "#64748B",
                      fontWeight: 600,
                      fontSize: "12px",
                      opacity: f.required ? 0.8 : 1,
                      cursor: f.required ? "not-allowed" : "pointer",
                    }}
                  >
                    {f.label} {f.required && "*"}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>* Champs obligatoires</p>
            </div>

            {/* Preview */}
            <div
              className="rounded-xl p-3 mb-4"
              style={{ background: "#EEF3FF", border: "1px dashed rgba(27,63,166,0.3)" }}
            >
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", marginBottom: "6px" }}>
                APERÇU DES CHAMPS
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedFields.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded-lg"
                    style={{ background: "#DCFCE7", color: "#16A34A", fontSize: "11px", fontWeight: 600 }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Link */}
            <div
              className="flex items-center gap-2 px-3 py-3 rounded-xl mb-4"
              style={{ background: "#EEF3FF", border: "1px solid rgba(27,63,166,0.15)" }}
            >
              <span style={{ flex: 1, fontSize: "12px", color: "#0D1F5C", wordBreak: "break-all" }}>
                {shareLink}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
                style={{
                  background: copied ? "#DCFCE7" : "#1B3FA6",
                  color: copied ? "#16A34A" : "white",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>

            {/* WhatsApp share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Rejoignez notre église ! Inscrivez-vous ici : ${shareLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
              style={{ background: "#25D366", color: "white", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}
            >
              Partager via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
