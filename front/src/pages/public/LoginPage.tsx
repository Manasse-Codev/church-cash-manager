import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";
import logoPng from "../../img/image.png";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email,    setEmail]    = useState("admin@eglise.cg");
  const [password, setPassword] = useState("admin123");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, var(--blue-deep) 0%, var(--blue-primary) 50%, var(--blue-accent) 100%)" }}
    >
      {/* Grid de fond */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05 }} aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="lgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lgrid)" />
        </svg>
      </div>

      {/* Cercles décoratifs */}
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", filter: "blur(30px)" }} aria-hidden="true" />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px",  width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.02)", filter: "blur(30px)" }} aria-hidden="true" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{ background: "white", borderRadius: "var(--radius)", boxShadow: "0 24px 80px rgba(0, 32, 194, 0.25)", overflow: "hidden" }}
      >
        {/* Bande supérieure */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, var(--blue-deep), var(--blue-primary), var(--blue-accent), var(--gold))" }} />

        {/* En-tête */}
        <div className="px-8 pt-10 pb-6 text-center" style={{ background: "linear-gradient(180deg, var(--blue-muted) 0%, white 100%)" }}>
          {/* Conteneur logo blanc arrondi */}
          <div
            className="w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center p-3 bg-white"
            style={{ boxShadow: "0 12px 30px rgba(0,32,194,0.12)", border: "1px solid rgba(0,32,194,0.05)" }}
          >
            <img src={logoPng} alt="Logo Assemblées de Dieu" className="w-full h-full object-contain" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--blue-deep)", fontSize: "20px", lineHeight: "1.2", letterSpacing: "-0.01em" }}>
            Assemblées de Dieu
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: "14px", marginTop: "4px", fontWeight: 600 }}>Espace de gestion financière</p>
        </div>

        {/* Séparateur */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--border), transparent)", margin: "0 24px" }} />

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5" noValidate>
          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-danger/10" style={{ background: "var(--danger-bg)", color: "var(--danger)" }} role="alert">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span style={{ fontSize: "13px", fontWeight: 700 }}>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="login-email" style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block", marginBottom: "6px" }}>
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--blue-accent)" }} aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all"
                style={{ background: "var(--blue-muted)", border: "1.5px solid var(--border)", color: "var(--blue-deep)", fontSize: "15px", fontWeight: 500 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue-primary)")}
                onBlur={(e) =>  (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="login-password" style={{ fontSize: "13px", fontWeight: 700, color: "var(--blue-deep)", display: "block", marginBottom: "6px" }}>
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--blue-accent)" }} aria-hidden="true" />
              <input
                id="login-password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                autoComplete="current-password"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none transition-all"
                style={{ background: "var(--blue-muted)", border: "1.5px solid var(--border)", color: "var(--blue-deep)", fontSize: "15px", fontWeight: 500 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue-primary)")}
                onBlur={(e) =>  (e.currentTarget.style.borderColor = "var(--border)")}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: "#64748B", padding: "4px" }}
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="cursor-pointer" style={{ fontSize: "13px", color: "var(--blue-accent)", fontWeight: 700, background: "none", border: "none", padding: 0 }}>
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl relative overflow-hidden"
            style={{
              background: loading ? "var(--gray-400)" : "linear-gradient(135deg, var(--blue-primary), var(--blue-accent))",
              border: "none", color: "white", fontWeight: 700, fontSize: "15px",
              boxShadow: loading ? "none" : "0 8px 24px rgba(0, 32, 194, 0.25)", minHeight: "52px",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connexion…
              </span>
            ) : "Se connecter"}
          </button>
        </form>

        {/* Bande inférieure */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, var(--gold), var(--blue-accent), var(--blue-primary), var(--blue-deep))" }} />
      </div>

      {/* Lien retour */}
      <Link to="/" style={{ position: "relative", zIndex: 10, marginTop: "20px", color: "rgba(255,255,255,0.7)", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>
        ← Retour à l'accueil
      </Link>

      <p className="relative z-10 mt-4 text-center" style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 500 }}>
        © {new Date().getFullYear()} Assemblées de Dieu — Côte d'Ivoire
      </p>
    </div>
  );
}
