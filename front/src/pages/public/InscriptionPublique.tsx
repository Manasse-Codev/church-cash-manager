import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Link } from "react-router";
import logoPng from "../../img/image.png";

export function InscriptionPublique() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);
  const [fields, setFields] = useState<any[]>([]);
  
  // États formulaire
  const [form, setForm] = useState<Record<string, string>>({
    nom: "",
    prenom: "",
    telephone: "",
    categorie: "Membre"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken);
    
    if (!urlToken) {
      setInvalidToken(true);
      setLoading(false);
      return;
    }

    // Charger la configuration du formulaire publique
    const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
    fetch(`${API_BASE_URL}/membres/form-config/public/${urlToken}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lien invalide");
        return res.json();
      })
      .then((json) => {
        // Le backend retourne la config qui enveloppe les champs dans un intercepteur global (TransformInterceptor) ou brut
        const config = json.data || json;
        const champs = config.champs || [];
        setFields(champs);
        
        // Initialiser les états du formulaire
        const initialForm: Record<string, string> = {
          nom: "",
          prenom: "",
          telephone: "",
          categorie: "Membre"
        };
        champs.forEach((f: any) => {
          const key = f.label.toLowerCase().replace(/é/g, "e").replace(/â/g, "a");
          if (!["nom", "prenom", "telephone", "categorie"].includes(key)) {
            initialForm[f.label] = "";
          }
        });
        setForm(initialForm);
        setLoading(false);
      })
      .catch(() => {
        setInvalidToken(true);
        setLoading(false);
      });
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nom?.trim()) e.nom = "Le nom est requis.";
    if (!form.prenom?.trim()) e.prenom = "Le prénom est requis.";
    if (!form.telephone?.trim()) e.telephone = "Le téléphone est requis.";
    
    // Valider les autres champs requis
    fields.forEach((f) => {
      const key = f.label.toLowerCase().replace(/é/g, "e").replace(/â/g, "a");
      if (!["nom", "prenom", "telephone", "categorie"].includes(key) && f.required) {
        if (!form[f.label]?.trim()) {
          e[f.label] = `${f.label} est requis.`;
        }
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Extraire les champs dynamiques
    const dynamicFields: Record<string, string> = {};
    Object.keys(form).forEach((k) => {
      if (!["nom", "prenom", "telephone", "categorie"].includes(k)) {
        dynamicFields[k] = form[k];
      }
    });

    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      telephone: form.telephone,
      categorie: form.categorie,
      champsDynamiques: dynamicFields,
    };

    const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
    fetch(`${API_BASE_URL}/membres/public/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur d'inscription");
        setSubmitted(true);
      })
      .catch(() => {
        alert("Une erreur est survenue lors de l'inscription.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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

  const CATEGORIES_OPTIONS = ["Membre", "Diacre", "Ancien", "Jeunesse", "Bienfaiteur"];

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

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-gray-500 text-sm font-semibold">Chargement du formulaire...</p>
          </div>
        ) : invalidToken ? (
          <div className="px-8 py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "#FEE2E2" }}>
              <AlertTriangle size={32} style={{ color: "#DC2626" }} />
            </div>
            <h2 className="text-red-600 font-extrabold text-lg">Lien invalide ou expiré</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ce lien d'inscription n'est plus actif. Veuillez vous rapprocher d'un administrateur de l'église pour obtenir un nouveau lien.
            </p>
          </div>
        ) : !submitted ? (
          <form onSubmit={handleSubmit} className="px-8 pb-10 pt-6 space-y-4" noValidate>
            {/* Prénom */}
            <div className="space-y-1.5">
              <label htmlFor="inp-prenom" style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>
                Prénom <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="inp-prenom"
                type="text"
                required
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                placeholder="Votre prénom"
                style={{ ...fieldStyle, borderColor: errors.prenom ? "var(--danger)" : "var(--border)" }}
              />
              {errors.prenom && (
                <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "2px", fontWeight: 600 }}>{errors.prenom}</p>
              )}
            </div>

            {/* Nom */}
            <div className="space-y-1.5">
              <label htmlFor="inp-nom" style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>
                Nom de famille <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="inp-nom"
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Votre nom"
                style={{ ...fieldStyle, borderColor: errors.nom ? "var(--danger)" : "var(--border)" }}
              />
              {errors.nom && (
                <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "2px", fontWeight: 600 }}>{errors.nom}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <label htmlFor="inp-telephone" style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>
                Téléphone <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="inp-telephone"
                type="tel"
                required
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="Ex: +225 07 00 00 00 00"
                style={{ ...fieldStyle, borderColor: errors.telephone ? "var(--danger)" : "var(--border)" }}
              />
              {errors.telephone && (
                <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "2px", fontWeight: 600 }}>{errors.telephone}</p>
              )}
            </div>

            {/* Catégorie */}
            <div className="space-y-1.5">
              <label htmlFor="inp-categorie" style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>
                Catégorie <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <select
                id="inp-categorie"
                required
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                style={fieldStyle}
              >
                {CATEGORIES_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Champs dynamiques supplémentaires */}
            {fields.filter(f => {
              const k = f.label.toLowerCase().replace(/é/g, "e").replace(/â/g, "a");
              return !["nom", "prenom", "telephone", "categorie"].includes(k);
            }).map((f) => (
              <div key={f.label} className="space-y-1.5">
                <label htmlFor={`inp-${f.label}`} style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block" }}>
                  {f.label} {f.required && <span style={{ color: "var(--danger)" }}>*</span>}
                </label>
                <input
                  id={`inp-${f.label}`}
                  type={f.type}
                  required={f.required}
                  value={form[f.label] || ""}
                  onChange={(e) => setForm({ ...form, [f.label]: e.target.value })}
                  placeholder={`Entrez votre ${f.label.toLowerCase()}`}
                  style={{ ...fieldStyle, borderColor: errors[f.label] ? "var(--danger)" : "var(--border)" }}
                />
                {errors[f.label] && (
                  <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "2px", fontWeight: 600 }}>{errors[f.label]}</p>
                )}
              </div>
            ))}

            <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3.5 rounded-xl border-none cursor-pointer" style={{ minHeight: "52px", boxShadow: "0 8px 24px rgba(0, 32, 194, 0.2)" }}>
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
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
              {form.prenom}, votre inscription a été reçue avec succès. Que Dieu vous bénisse abondamment !
            </p>
            <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: "var(--blue-muted)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "13px", color: "var(--gray-600)", marginBottom: "6px", fontWeight: 500 }}>Catégorie : <strong style={{ color: "var(--blue-primary)", fontWeight: 700 }}>{form.categorie}</strong></p>
              <p style={{ fontSize: "13px", color: "var(--gray-600)", fontWeight: 500 }}>Téléphone : <strong style={{ color: "var(--blue-deep)", fontWeight: 700 }}>{form.telephone}</strong></p>
            </div>
            <button type="button" onClick={() => { setSubmitted(false); setForm({ nom: "", prenom: "", telephone: "", categorie: "Membre" }); }} className="w-full btn-outline py-3.5 rounded-xl text-sm cursor-pointer" style={{ border: "2px solid var(--blue-primary)" }}>
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
