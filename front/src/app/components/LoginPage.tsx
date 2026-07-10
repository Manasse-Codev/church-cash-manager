import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const TriangleDivider = () => (
  <div className="flex justify-center gap-1 my-4">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderBottom: i % 2 === 0 ? "8px solid #D4A843" : "8px solid #C67B4B",
          opacity: 0.5,
        }}
      />
    ))}
  </div>
);

const AdinkraLogo = () => (
  <svg viewBox="0 0 80 80" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
    {/* Cross + Gye Nyame inspired */}
    <circle cx="40" cy="40" r="38" fill="none" stroke="#D4A843" strokeWidth="2" />
    <rect x="36" y="12" width="8" height="56" rx="3" fill="white" opacity="0.9" />
    <rect x="18" y="30" width="44" height="8" rx="3" fill="white" opacity="0.9" />
    <circle cx="40" cy="40" r="8" fill="#D4A843" />
    <circle cx="40" cy="40" r="4" fill="white" />
    {/* Decorative arcs */}
    <path d="M 22 22 Q 40 10 58 22" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
    <path d="M 22 58 Q 40 70 58 58" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@eglise.cg");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/app");
    }, 800);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#FDFAF3" }}
    >
      {/* Background pattern */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="login-kente" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="#C67B4B" />
            <rect x="20" y="20" width="20" height="20" fill="#C67B4B" />
            <rect x="10" y="8" width="20" height="4" fill="#D4A843" />
            <rect x="10" y="28" width="20" height="4" fill="#D4A843" />
            <rect x="8" y="10" width="4" height="20" fill="#2F6B4E" />
            <rect x="28" y="10" width="4" height="20" fill="#2F6B4E" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#login-kente)" />
      </svg>

      {/* Decorative top band */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ background: "linear-gradient(90deg, #C67B4B, #D4A843, #2F6B4E, #D4A843, #C67B4B)" }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm"
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px dashed rgba(198,123,75,0.35)",
          boxShadow: "0 8px 40px rgba(198,123,75,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Card header with gradient */}
        <div
          className="px-8 pt-8 pb-2 text-center relative"
          style={{ background: "linear-gradient(180deg, rgba(198,123,75,0.08) 0%, transparent 100%)" }}
        >
          {/* Logo circle */}
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #C67B4B 0%, #D4A843 100%)",
              boxShadow: "0 4px 20px rgba(212,168,67,0.4)",
            }}
          >
            <AdinkraLogo />
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: "#3A3226",
              fontSize: "22px",
              lineHeight: "1.2",
            }}
          >
            Assemblées de Dieu
          </h1>
          <p style={{ color: "#6B5744", fontSize: "13px", marginTop: "4px" }}>
            Gestion Financière de l'Église
          </p>
        </div>

        <TriangleDivider />

        {/* Form */}
        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4">
          <div>
            <label
              style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226", display: "block", marginBottom: "6px" }}
            >
              Adresse email
            </label>
            <div className="relative">
              <Mail
                size={16}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#C67B4B" }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: "#F5EFE4",
                  border: "1px solid rgba(198,123,75,0.2)",
                  color: "#3A3226",
                  fontSize: "15px",
                }}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label
              style={{ fontSize: "13px", fontWeight: 600, color: "#3A3226", display: "block", marginBottom: "6px" }}
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                size={16}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#C67B4B" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: "#F5EFE4",
                  border: "1px solid rgba(198,123,75,0.2)",
                  color: "#3A3226",
                  fontSize: "15px",
                }}
                placeholder="Mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#6B5744" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" style={{ fontSize: "13px", color: "#C67B4B", fontWeight: 600 }}>
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl transition-all duration-200 relative overflow-hidden"
            style={{
              background: loading
                ? "#D4A843"
                : "linear-gradient(135deg, #D4A843 0%, #C67B4B 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "16px",
              boxShadow: "0 4px 16px rgba(212,168,67,0.4)",
              minHeight: "52px",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p
        className="relative z-10 mt-6 text-center px-4"
        style={{ color: "#6B5744", fontSize: "12px", maxWidth: "320px" }}
      >
        Une application pour la gestion transparente de l'église
      </p>

      {/* Decorative bottom band */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{ background: "linear-gradient(90deg, #2F6B4E, #D4A843, #C67B4B, #D4A843, #2F6B4E)" }}
      />
    </div>
  );
}
