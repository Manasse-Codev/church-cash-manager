import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router";
import logoPng from "../../img/image.png";

const CATEGORIES = ["Membre", "Diacre", "Ancien", "Jeunesse", "Bienfaiteur"];

type FormData = { nom: string; prénom: string; téléphone: string; catégorie: string };

export function InscriptionPublique() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({ nom: "", prénom: "", téléphone: "", catégorie: "Membre" });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.nom.trim())       e.nom       = "Le nom est requis.";
    if (!form.prénom.trim())    e.prénom    = "Le prénom est requis.";
    if (!form.téléphone.trim()) e.téléphone = "Le téléphone est requis.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const fieldStyle = {
    background: "var(--blue-muted)",
    border: "1.5px solid var(--border)",
    color: "var(--blue-deep)",
    fontSize: "15px",
    borderRadius: "var(--radius-md)",
    padding: "12px 16px",
    width: "100%",
    outline: "none",
    fontWeight: 500,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{ background: "linear-gradient(160deg, var(--blue-deep) 0%, var(--blue-primary) 50%, var(--blue-accent) 100%)" }}>
      {/* Fond grille */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.05 }} aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="igrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#igrid)" />
        </svg>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md" style={{ background: "white", borderRadius: "var(--radius)", boxShadow: "0 24px 80px rgba(0, 32, 194, 0.25)", overflow: "hidden" }}>
        <div style={{ height: "5px", background: "linear-gradient(90deg, var(--blue-deep), var(--blue-primary), var(--blue-accent), var(--gold))" }} />

        {/* En-tête */}
        <div className="px-8 pt-10 pb-6 text-center" style={{ background: "linear-gradient(180deg, var(--blue-muted) 0%, white 100%)" }}>
          {/* Conteneur logo blanc arrondi */}
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center p-3.5 bg-white"
            style={{ boxShadow: "0 10px 25px rgba(0,32,194,0.12)", border: "1px solid rgba(0,32,194,0.05)" }}
          >
            <img src={logoPng} alt="Logo Assemblées de Dieu" className="w-full h-full object-contain" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--blue-deep)", fontSize: "20px", lineHeight: "1.2", letterSpacing: "-0.01em" }}>
            Assemblées de Dieu
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: "14px", marginTop: "4px", fontWeight: 600 }}>Formulaire d'inscription</p>
        </div>

        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--border), transparent)", margin: "0 24px" }} />

        {!submitted ? (
          <form onSubmit={handleSubmit} className="px-8 pb-10 pt-6 space-y-4" noValidate>
            {[
              { key: "nom",        label: "Nom",      placeholder: "Votre nom de famille", type: "text" },
              { key: "prénom",     label: "Prénom",   placeholder: "Votre prénom",         type: "text" },
              { key: "téléphone",  label: "Téléphone", placeholder: "+225 07 XX XX XX XX",   type: "tel"  },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label htmlFor={`inp-${f.key}`} style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>
                  {f.label} <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  id={`inp-${f.key}`}
                  type={f.type}
                  required
                  value={form[f.key as keyof FormData]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  style={{ ...fieldStyle, borderColor: errors[f.key as keyof FormData] ? "var(--danger)" : "var(--border)" }}
                />
                {errors[f.key as keyof FormData] && (
                  <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "2px", fontWeight: 600 }}>{errors[f.key as keyof FormData]}</p>
                )}
              </div>
            ))}

            <div className="space-y-1.5">
              <label htmlFor="inp-categorie" style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>
                Catégorie <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <select
                id="inp-categorie"
                required
                value={form.catégorie}
                onChange={(e) => setForm({ ...form, catégorie: e.target.value })}
                style={fieldStyle}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full btn-primary py-3.5 rounded-xl border-none" style={{ minHeight: "52px", boxShadow: "0 8px 24px rgba(0, 32, 194, 0.2)" }}>
              S'inscrire
            </button>
          </form>
        ) : (
          <div className="px-8 pb-10 pt-6 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--success-bg)" }}>
              <CheckCircle size={32} style={{ color: "var(--success)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--blue-deep)", fontSize: "20px", marginBottom: "10px" }}>
              Bienvenue dans la famille !
            </h2>
            <p style={{ color: "var(--gray-600)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
              {form.prénom}, votre inscription a été reçue avec succès. Que Dieu vous bénisse abondamment !
            </p>
            <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: "var(--blue-muted)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "13px", color: "var(--gray-600)", marginBottom: "6px", fontWeight: 500 }}>Catégorie : <strong style={{ color: "var(--blue-primary)", fontWeight: 700 }}>{form.catégorie}</strong></p>
              <p style={{ fontSize: "13px", color: "var(--gray-600)", fontWeight: 500 }}>Téléphone : <strong style={{ color: "var(--blue-deep)", fontWeight: 700 }}>{form.téléphone}</strong></p>
            </div>
            <button type="button" onClick={() => { setSubmitted(false); setForm({ nom: "", prénom: "", téléphone: "", catégorie: "Membre" }); }} className="w-full btn-outline py-3.5 rounded-xl text-sm" style={{ border: "2px solid var(--blue-primary)" }}>
              Nouvelle inscription
            </button>
          </div>
        )}

        <div style={{ height: "5px", background: "linear-gradient(90deg, var(--gold), var(--blue-accent), var(--blue-primary), var(--blue-deep))" }} />
      </div>

      <Link to="/" style={{ position: "relative", zIndex: 10, marginTop: "20px", color: "rgba(255,255,255,0.7)", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>
        ← Retour à l'accueil
      </Link>
    </div>
  );
}
