import { Outlet, Link, useLocation } from "react-router";
import logoPng from "../img/image.png";

const NAV_LINKS = [
  { to: "/",            label: "Accueil"      },
  { to: "/#a-propos",   label: "À propos"     },
  { to: "/#departements", label: "Départements" },
  { to: "/#actualites", label: "Actualités"   },
  { to: "/#contact",    label: "Contact"      },
];

export function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(10, 25, 49, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          {/* Logo + nom */}
          <Link to="/" className="flex items-center gap-3 transition-transform active:scale-98" aria-label="Accueil Assemblées de Dieu">
            <img src={logoPng} alt="Logo Assemblées de Dieu" className="w-10 h-10 object-contain" />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "white", fontSize: "14px", lineHeight: "1.1", letterSpacing: "0.02em" }}>
                Assemblées de Dieu
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>
                TOUT L'ÉVANGILE
              </div>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <a
                key={link.to}
                href={link.to}
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-sm)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => { (e.currentTarget.style.color = "white"); (e.currentTarget.style.background = "rgba(255,255,255,0.08)"); }}
                onMouseOut={(e) =>  { (e.currentTarget.style.color = "rgba(255,255,255,0.8)"); (e.currentTarget.style.background = "transparent"); }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Link
            to="/connexion"
            className="btn-primary"
            style={{ padding: "8px 22px", fontSize: "14px", borderRadius: "var(--radius-md)" }}
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* ── Contenu ── */}
      <main className={isHome ? "" : "pt-16"}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--blue-deep)", color: "white", marginTop: "auto", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Identité */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoPng} alt="Logo AD" className="w-12 h-12 object-contain" />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "15px", letterSpacing: "0.02em" }}>
                  Assemblées de Dieu
                </div>
                <div style={{ color: "var(--blue-light)", fontSize: "11px", fontWeight: 700 }}>Côte d'Ivoire</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: "1.7" }}>
              Tout l'Évangile à toute créature. Une communauté de foi, d'espérance et d'amour au service de Dieu et des hommes.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, marginBottom: "20px", color: "white", letterSpacing: "0.02em" }}>
              Liens rapides
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.to} style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s ease", fontWeight: 500 }}
                     onMouseOver={(e) => (e.currentTarget.style.color = "var(--blue-light)")}
                     onMouseOut={(e) =>  (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, marginBottom: "20px", color: "white", letterSpacing: "0.02em" }}>
              Contact
            </h3>
            <ul className="space-y-3" style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
              <li className="flex items-center gap-2">📍 Cocody, Abidjan, Côte d'Ivoire</li>
              <li className="flex items-center gap-2">📞 +225 07 00 00 00 00</li>
              <li className="flex items-center gap-2">✉️ contact@ad-ci.org</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "20px" }}>
          <p className="text-center" style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
            © {new Date().getFullYear()} Assemblées de Dieu — Côte d'Ivoire. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
