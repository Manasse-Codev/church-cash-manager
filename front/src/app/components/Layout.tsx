import { Outlet, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  HandCoins,
  Landmark,
  Building2,
  Users,
  Bell,
  LogOut,
  ChevronRight,
  Wifi,
  WifiOff,
} from "lucide-react";

const navItems = [
  { to: "/app", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/app/investisseurs", label: "Investisseurs", icon: HandCoins, end: false },
  { to: "/app/caisse", label: "Caisse", icon: Landmark, end: false },
  { to: "/app/construction", label: "Construction", icon: Building2, end: false },
  { to: "/app/membres", label: "Membres", icon: Users, end: false },
];

const KentePattern = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: 0, left: 0, opacity: 0.04 }}>
    <defs>
      <pattern id="kente" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="10" height="10" fill="#C67B4B" />
        <rect x="10" y="10" width="10" height="10" fill="#C67B4B" />
        <rect x="5" y="5" width="10" height="2" fill="#D4A843" />
        <rect x="5" y="13" width="10" height="2" fill="#D4A843" />
        <rect x="5" y="5" width="2" height="10" fill="#2F6B4E" />
        <rect x="13" y="5" width="2" height="10" fill="#2F6B4E" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kente)" />
  </svg>
);

export function Layout() {
  const navigate = useNavigate();
  const [isOnline] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#FDFAF3", fontFamily: "Nunito, sans-serif" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 h-full relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FDF6EA 0%, #F5E8C0 100%)",
          borderRight: "1px solid rgba(198,123,75,0.15)",
        }}
      >
        <KentePattern />
        {/* Logo area */}
        <div className="relative z-10 px-6 py-6 border-b" style={{ borderColor: "rgba(198,123,75,0.2)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #C67B4B, #D4A843)" }}
            >
              <span style={{ color: "white", fontSize: "18px", fontFamily: "serif" }}>✝</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#3A3226", fontSize: "13px", lineHeight: "1.2" }}>
                Assemblées de Dieu
              </div>
              <div style={{ color: "#6B5744", fontSize: "11px" }}>Gestion financière</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 relative z-10 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive ? "shadow-sm" : "hover:bg-white/50"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "#C67B4B", color: "white" }
                  : { color: "#3A3226" }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="relative z-10 px-3 py-4 border-t space-y-2" style={{ borderColor: "rgba(198,123,75,0.2)" }}>
          <div className="flex items-center gap-2 px-4 py-2">
            {isOnline ? (
              <Wifi size={14} style={{ color: "#2F6B4E" }} />
            ) : (
              <WifiOff size={14} style={{ color: "#C0392B" }} />
            )}
            <span style={{ fontSize: "12px", color: "#6B5744" }}>
              {isOnline ? "Connecté" : "Hors ligne"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 transition-all"
            style={{ color: "#3A3226" }}
          >
            <LogOut size={18} />
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0"
          style={{
            background: "#FDFAF3",
            borderBottom: "1px solid rgba(198,123,75,0.15)",
          }}
        >
          {/* Mobile: church name */}
          <div className="flex items-center gap-2 md:hidden">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C67B4B, #D4A843)" }}
            >
              <span style={{ color: "white", fontSize: "14px" }}>✝</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#3A3226", fontSize: "14px" }}>
              AD Finances
            </span>
          </div>

          {/* Desktop: page context */}
          <div className="hidden md:block">
            <span style={{ fontSize: "13px", color: "#6B5744" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isOnline && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: "#F5E0CE", color: "#C67B4B", fontWeight: 600, fontSize: "11px" }}
              >
                Sauvegardé hors ligne
              </span>
            )}
            <button
              className="relative w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#F5EFE4" }}
            >
              <Bell size={18} style={{ color: "#3A3226" }} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "#D4A843" }}
              />
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C67B4B, #D4A843)", color: "white", fontWeight: 700, fontSize: "14px" }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
        style={{
          background: "#FDF6EA",
          borderTop: "1px solid rgba(198,123,75,0.2)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-all"
            style={({ isActive }) =>
              isActive
                ? { color: "#C67B4B" }
                : { color: "#6B5744" }
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={isActive ? { background: "#F5E0CE" } : {}}
                >
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: "10px", fontWeight: isActive ? 700 : 500 }}>{label.split(" ")[0]}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
