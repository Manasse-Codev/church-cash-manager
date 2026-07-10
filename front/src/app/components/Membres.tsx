import { useState } from "react";
import { Search, Plus, X, Share2, Copy, CheckCircle, Phone, Calendar } from "lucide-react";

const membres = [
  { id: 1, nom: "Emmanuel", prénom: "Moukala", catégorie: "Ancien", téléphone: "+242 06 123 4567", date: "12 Jan 2019" },
  { id: 2, nom: "Marie-Thérèse", prénom: "Bilomba", catégorie: "Membre", téléphone: "+242 05 987 6543", date: "03 Mar 2021" },
  { id: 3, nom: "Joseph", prénom: "Nzinzi", catégorie: "Diacre", téléphone: "+242 06 456 7890", date: "07 Jul 2015" },
  { id: 4, nom: "Paul", prénom: "Malanda", catégorie: "Membre", téléphone: "+242 05 321 0987", date: "22 Sep 2022" },
  { id: 5, nom: "Cécile", prénom: "Ngoma", catégorie: "Membre", téléphone: "+242 06 654 3210", date: "15 Nov 2020" },
  { id: 6, nom: "Pierre", prénom: "Louzolo", catégorie: "Diacre", téléphone: "+242 05 111 2222", date: "01 Jun 2018" },
  { id: 7, nom: "Agnès", prénom: "Mbemba", catégorie: "Membre", téléphone: "+242 06 333 4444", date: "08 Fév 2023" },
  { id: 8, nom: "Théodore", prénom: "Bakoula", catégorie: "Bienfaiteur", téléphone: "+242 05 555 6666", date: "30 Avr 2016" },
];

const catColors: Record<string, { bg: string; text: string }> = {
  Ancien: { bg: "#F5E0CE", text: "#C67B4B" },
  Diacre: { bg: "#D4EDE3", text: "#2F6B4E" },
  Membre: { bg: "#F5E8C0", text: "#8B6914" },
  Bienfaiteur: { bg: "#E8D4F0", text: "#6B3D8A" },
};

const categories = ["Tous", "Ancien", "Diacre", "Membre", "Bienfaiteur"];

const formFields = [
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

  const filtered = membres.filter((m) => {
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
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: "#3A3226",
              fontSize: "24px",
            }}
          >
            Membres
          </h1>
          <p style={{ color: "#6B5744", fontSize: "13px" }}>{membres.length} membres enregistrés</p>
        </div>
        <button
          onClick={() => setShowLinkModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0"
          style={{ background: "#D4EDE3", color: "#2F6B4E", fontWeight: 700, fontSize: "13px" }}
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
          style={{ background: "white", border: "1px solid rgba(198,123,75,0.2)" }}
        >
          <Search size={16} style={{ color: "#C67B4B", flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="flex-1 outline-none min-w-0"
            style={{ background: "transparent", color: "#3A3226", fontSize: "14px" }}
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-xl outline-none"
          style={{
            background: "white",
            border: "1px solid rgba(198,123,75,0.2)",
            color: "#3A3226",
            fontSize: "14px",
          }}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Member list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(198,123,75,0.12)",
          boxShadow: "0 2px 12px rgba(198,123,75,0.06)",
        }}
      >
        {filtered.map((m, i) => {
          const colors = catColors[m.catégorie] || { bg: "#F0EBE0", text: "#6B5744" };
          const initials = `${m.prénom[0]}${m.nom[0]}`;

          return (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(198,123,75,0.08)" : "none" }}
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
                  <span style={{ fontWeight: 700, color: "#3A3226", fontSize: "14px" }}>
                    {m.prénom} {m.nom}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: colors.bg, color: colors.text, fontSize: "10px", fontWeight: 700 }}
                  >
                    {m.catégorie}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span
                    className="flex items-center gap-1"
                    style={{ fontSize: "12px", color: "#6B5744" }}
                  >
                    <Phone size={11} />
                    {m.téléphone}
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{ fontSize: "12px", color: "#6B5744" }}
                  >
                    <Calendar size={11} />
                    Depuis {m.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#6B5744" }}>
            Aucun membre trouvé
          </div>
        )}
      </div>

      {/* FAB */}
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

      {/* Share link modal */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(58,50,38,0.5)" }}
          onClick={() => setShowLinkModal(false)}
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
                Lien d'inscription
              </h3>
              <button onClick={() => setShowLinkModal(false)}>
                <X size={20} style={{ color: "#6B5744" }} />
              </button>
            </div>

            {/* Field builder */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#3A3226", marginBottom: "8px" }}>
                Champs du formulaire
              </p>
              <div className="flex flex-wrap gap-2">
                {formFields.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => !f.required && toggleField(f.label)}
                    className="px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      background: selectedFields.includes(f.label) ? "#C67B4B" : "#F0EBE0",
                      color: selectedFields.includes(f.label) ? "white" : "#6B5744",
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
              <p style={{ fontSize: "11px", color: "#6B5744", marginTop: "6px" }}>* Champs obligatoires</p>
            </div>

            {/* Preview */}
            <div
              className="rounded-xl p-3 mb-4"
              style={{ background: "#F5EFE4", border: "1px dashed rgba(198,123,75,0.3)" }}
            >
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#6B5744", marginBottom: "6px" }}>
                APERÇU DES CHAMPS
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedFields.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded-lg"
                    style={{ background: "#D4EDE3", color: "#2F6B4E", fontSize: "11px", fontWeight: 600 }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Link */}
            <div
              className="flex items-center gap-2 px-3 py-3 rounded-xl mb-4"
              style={{ background: "#F5EFE4", border: "1px solid rgba(198,123,75,0.2)" }}
            >
              <span style={{ flex: 1, fontSize: "12px", color: "#3A3226", wordBreak: "break-all" }}>
                {shareLink}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
                style={{
                  background: copied ? "#D4EDE3" : "#C67B4B",
                  color: copied ? "#2F6B4E" : "white",
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Partager via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
