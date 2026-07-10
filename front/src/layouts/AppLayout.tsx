import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, HandCoins, Landmark, Building2,
  Users, Bell, LogOut, ChevronRight, Wifi, WifiOff,
  FolderOpen,
} from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import logoPng from "../img/image.png";

const NAV_ITEMS = [
  { to: "/app",              label: "Tableau de bord", icon: LayoutDashboard, end: true  },
  { to: "/app/investisseurs", label: "Investisseurs",   icon: HandCoins,       end: false },
  { to: "/app/caisse",       label: "Caisse",          icon: Landmark,        end: false },
  { to: "/app/construction", label: "Construction",    icon: Building2,       end: false },
  { to: "/app/departements", label: "Départements",    icon: FolderOpen,      end: false },
  { to: "/app/membres",      label: "Membres",         icon: Users,           end: false },
];

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isOnline = navigator.onLine;

  const handleLogout = () => { logout(); navigate("/connexion"); };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--background)" }}>

      {/* ── Sidebar Desktop ── */}
      <aside
        className="hidden md:flex flex-col w-64 h-full flex-shrink-0"
        style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
          <div className="w-10 h-10 rounded-xl bg-white/5 p-1 flex items-center justify-center flex-shrink-0">
            <img src={logoPng} alt="Logo Assemblées de Dieu" className="w-full h-full object-contain" />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "white", fontSize: "13px", lineHeight: "1.2", letterSpacing: "0.02em" }}>
              Assemblées de Dieu
            </div>
            <div style={{ color: "var(--blue-light)", fontSize: "10px", fontWeight: 700, marginTop: "2px" }}>
              Gestion financière
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Navigation application">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/5"
              style={({ isActive }) =>
                isActive
                  ? { background: "rgba(37,99,235,0.15)", color: "var(--blue-light)", fontWeight: 700 }
                  : { color: "rgba(255,255,255,0.6)", fontWeight: 500 }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "14px" }}>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bas sidebar */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          {/* Statut en ligne */}
          <div className="flex items-center gap-2 px-4 py-2">
            {isOnline
              ? <Wifi size={13} style={{ color: "var(--success)" }} />
              : <WifiOff size={13} style={{ color: "var(--danger)" }} />}
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
              {isOnline ? "Connecté" : "Hors ligne"}
            </span>
          </div>

          {/* Utilisateur */}
          {user && (
            <div className="px-4 py-2 flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--blue-primary)", color: "white", fontWeight: 800, fontSize: "13px" }}
                aria-hidden="true"
              >
                {user.nom[0]}
              </div>
              <div className="min-w-0">
                <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.nom}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{user.role}</div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseOver={(e) => { (e.currentTarget.style.background = "rgba(239,68,68,0.12)"); (e.currentTarget.style.color = "#FCA5A5"); }}
            onMouseOut={(e) =>  { (e.currentTarget.style.background = "transparent"); (e.currentTarget.style.color = "rgba(255,255,255,0.5)"); }}
            aria-label="Se déconnecter"
          >
            <LogOut size={16} />
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Contenu principal ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* ── Top bar ── */}
        <header
          className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0"
          style={{ background: "white", borderBottom: "1px solid var(--border)" }}
        >
          {/* Mobile: logo + nom */}
          <div className="flex items-center gap-2 md:hidden">
            <img src={logoPng} alt="Logo AD" className="w-8 h-8 object-contain" />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--blue-deep)", fontSize: "14px" }}>
              AD Finances
            </span>
          </div>

          {/* Desktop: date */}
          <div className="hidden md:block">
            <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95"
              style={{ background: "var(--blue-muted)" }}
              aria-label="Notifications"
            >
              <Bell size={17} style={{ color: "var(--blue-primary)" }} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "var(--destructive)" }} />
            </button>

            {user && (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--blue-primary), var(--blue-accent))", color: "white", fontWeight: 700, fontSize: "13px" }}
                aria-label={`Connecté en tant que ${user.nom}`}
              >
                {user.nom[0]}
              </div>
            )}
          </div>
        </header>

        {/* ── Page ── */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* ── Bottom tab bar mobile ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{
          background: "var(--sidebar)",
          borderTop: "1px solid var(--sidebar-border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-label="Navigation mobile"
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex-1 flex flex-col items-center py-2.5 gap-1 transition-all"
            style={({ isActive }) =>
              isActive ? { color: "var(--blue-light)" } : { color: "rgba(255,255,255,0.4)" }
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={isActive ? { background: "rgba(37,99,235,0.15)" } : {}}
                >
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: "9px", fontWeight: isActive ? 700 : 500 }}>
                  {label.split(" ")[0]}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
