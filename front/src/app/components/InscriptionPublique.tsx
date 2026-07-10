import { useState } from "react";
import { CheckCircle } from "lucide-react";

const categories = ["Membre", "Diacre", "Ancien", "Jeunesse", "Bienfaiteur"];

const JoinedHandsIllustration = () => (
  <svg viewBox="0 0 120 80" width="120" height="80" xmlns="http://www.w3.org/2000/svg">
    {/* Left hand */}
    <ellipse cx="35" cy="55" rx="22" ry="12" fill="#C67B4B" opacity="0.8" />
    <rect x="20" y="30" width="8" height="28" rx="4" fill="#C67B4B" opacity="0.9" />
    <rect x="29" y="26" width="7" height="30" rx="3.5" fill="#D4A843" opacity="0.9" />
    <rect x="37" y="28" width="7" height="28" rx="3.5" fill="#C67B4B" opacity="0.9" />
    <rect x="45" y="32" width="6" height="24" rx="3" fill="#D4A843" opacity="0.9" />
    {/* Right hand */}
    <ellipse cx="85" cy="55" rx="22" ry="12" fill="#2F6B4E" opacity="0.8" />
    <rect x="92" y="30" width="8" height="28" rx="4" fill="#2F6B4E" opacity="0.9" />
    <rect x="84" y="26" width="7" height="30" rx="3.5" fill="#4A9B6F" opacity="0.9" />
    <rect x="76" y="28" width="7" height="28" rx="3.5" fill="#2F6B4E" opacity="0.9" />
    <rect x="69" y="32" width="6" height="24" rx="3" fill="#4A9B6F" opacity="0.9" />
    {/* Gold ring where hands meet */}
    <circle cx="60" cy="52" r="8" fill="#D4A843" opacity="0.5" />
    <circle cx="60" cy="52" r="4" fill="#D4A843" opacity="0.8" />
  </svg>
);

export function InscriptionPublique() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prénom: "",
    téléphone: "",
    catégorie: "Membre",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{ background: "#FDFAF3" }}
    >
      {/* Background pattern */}
      <svg
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.035, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="bg-kente" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="#C67B4B" />
            <rect x="20" y="20" width="20" height="20" fill="#C67B4B" />
            <rect x="10" y="8" width="20" height="4" fill="#D4A843" />
            <rect x="10" y="28" width="20" height="4" fill="#D4A843" />
            <rect x="8" y="10" width="4" height="20" fill="#2F6B4E" />
            <rect x="28" y="10" width="4" height="20" fill="#2F6B4E" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-kente)" />
      </svg>

      {/* Top band */}
      <div
        className="fixed top-0 left-0 right-0 h-1.5 z-10"
        style={{ background: "linear-gradient(90deg, #C67B4B, #D4A843, #2F6B4E, #D4A843, #C67B4B)" }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm mt-6"
        style={{
          background: "white",
          borderRadius: "24px",
          border: "1px dashed rgba(198,123,75,0.3)",
          boxShadow: "0 8px 40px rgba(198,123,75,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Church header */}
        <div
          className="px-6 pt-6 pb-4 text-center relative"
          style={{ background: "linear-gradient(180deg, rgba(198,123,75,0.08) 0%, transparent 100%)" }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #C67B4B 0%, #D4A843 100%)",
              boxShadow: "0 4px 16px rgba(212,168,67,0.35)",
            }}
          >
            <span style={{ color: "white", fontSize: "24px", fontFamily: "serif" }}>✝</span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: "#3A3226",
              fontSize: "20px",
              lineHeight: "1.2",
            }}
          >
            Assemblées de Dieu
          </h1>
          <p style={{ color: "#6B5744", fontSize: "13px", marginTop: "2px" }}>Formulaire d'inscription</p>

          {/* Zigzag divider */}
          <div className="flex justify-center gap-1 mt-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderBottom: i % 2 === 0 ? "7px solid #D4A843" : "7px solid #C67B4B",
                  opacity: 0.45,
                }}
              />
            ))}
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-4">
            {[
              { key: "nom", label: "Nom", placeholder: "Votre nom de famille", type: "text" },
              { key: "prénom", label: "Prénom", placeholder: "Votre prénom", type: "text" },
              { key: "téléphone", label: "Téléphone", placeholder: "+242 06 XXX XXXX", type: "tel" },
            ].map((field) => (
              <div key={field.key}>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#3A3226", display: "block", marginBottom: "6px" }}>
                  {field.label} <span style={{ color: "#C67B4B" }}>*</span>
                </label>
                <input
                  type={field.type}
                  required
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl outline-none"
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
              <label style={{ fontSize: "13px", fontWeight: 700, color: "#3A3226", display: "block", marginBottom: "6px" }}>
                Catégorie <span style={{ color: "#C67B4B" }}>*</span>
              </label>
              <select
                required
                value={form.catégorie}
                onChange={(e) => setForm({ ...form, catégorie: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  background: "#F5EFE4",
                  border: "1px solid rgba(198,123,75,0.2)",
                  color: "#3A3226",
                  fontSize: "15px",
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl mt-2"
              style={{
                background: "linear-gradient(135deg, #D4A843 0%, #C67B4B 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: "16px",
                boxShadow: "0 4px 16px rgba(212,168,67,0.4)",
                minHeight: "52px",
              }}
            >
              S'inscrire
            </button>
          </form>
        ) : (
          /* Success state */
          <div className="px-6 pb-8 text-center">
            <div className="flex justify-center mb-4">
              <JoinedHandsIllustration />
            </div>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#D4EDE3" }}
            >
              <CheckCircle size={32} style={{ color: "#2F6B4E" }} />
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                color: "#3A3226",
                fontSize: "22px",
                lineHeight: "1.2",
                marginBottom: "8px",
              }}
            >
              Bienvenue dans la famille !
            </h2>
            <p style={{ color: "#6B5744", fontSize: "14px", lineHeight: "1.6" }}>
              {form.prénom}, votre inscription a été bien reçue. Que Dieu vous bénisse abondamment !
            </p>

            <div
              className="mt-5 px-4 py-3 rounded-xl"
              style={{ background: "#F5EFE4", border: "1px dashed rgba(198,123,75,0.3)" }}
            >
              <p style={{ fontSize: "13px", color: "#6B5744" }}>
                Catégorie : <strong style={{ color: "#C67B4B" }}>{form.catégorie}</strong>
              </p>
              <p style={{ fontSize: "13px", color: "#6B5744", marginTop: "2px" }}>
                Téléphone : <strong style={{ color: "#3A3226" }}>{form.téléphone}</strong>
              </p>
            </div>

            <button
              onClick={() => { setSubmitted(false); setForm({ nom: "", prénom: "", téléphone: "", catégorie: "Membre" }); }}
              className="mt-5 px-6 py-3 rounded-xl"
              style={{ background: "#F0EBE0", color: "#3A3226", fontWeight: 700, fontSize: "14px" }}
            >
              Nouvelle inscription
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p
        className="relative z-10 mt-5 text-center"
        style={{ color: "#6B5744", fontSize: "12px" }}
      >
        Une application pour la gestion transparente de l'église
      </p>

      {/* Bottom band */}
      <div
        className="fixed bottom-0 left-0 right-0 h-1.5 z-10"
        style={{ background: "linear-gradient(90deg, #2F6B4E, #D4A843, #C67B4B, #D4A843, #2F6B4E)" }}
      />
    </div>
  );
}
