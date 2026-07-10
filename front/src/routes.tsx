import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { PublicLayout } from "./layouts/PublicLayout";
import { AppLayout }    from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { Loader } from "./components/shared/Loader";

// ── Pages publiques (lazy) ────────────────────────────────────────────
const LandingPage        = lazy(() => import("./pages/public/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage          = lazy(() => import("./pages/public/LoginPage").then(m => ({ default: m.LoginPage })));
const InscriptionPublique = lazy(() => import("./pages/public/InscriptionPublique").then(m => ({ default: m.InscriptionPublique })));

// ── Pages app (lazy) ─────────────────────────────────────────────────
const Dashboard     = lazy(() => import("./pages/app/Dashboard").then(m => ({ default: m.Dashboard })));
const Investisseurs = lazy(() => import("./pages/app/Investisseurs").then(m => ({ default: m.Investisseurs })));
const Caisse        = lazy(() => import("./pages/app/Caisse").then(m => ({ default: m.Caisse })));
const Construction  = lazy(() => import("./pages/app/Construction").then(m => ({ default: m.Construction })));
const Departements  = lazy(() => import("./pages/app/Departements").then(m => ({ default: m.Departements })));
const Membres       = lazy(() => import("./pages/app/Membres").then(m => ({ default: m.Membres })));

const wrap = (el: React.ReactNode) => (
  <Suspense fallback={<Loader text="Chargement de la page…" />}>{el}</Suspense>
);

export const router = createBrowserRouter([
  // ── Routes publiques ──
  {
    Component: PublicLayout,
    children: [
      { path: "/",        element: wrap(<LandingPage />) },
      { path: "/inscription", element: wrap(<InscriptionPublique />) },
    ],
  },

  // ── Login (sans layout) ──
  { path: "/connexion", element: wrap(<LoginPage />) },

  // ── Ancienne route login (compat) ──
  { path: "/login",     element: wrap(<LoginPage />) },

  // ── Routes app (protégées) ──
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                   element: wrap(<Dashboard />) },
      { path: "investisseurs",         element: wrap(<Investisseurs />) },
      { path: "caisse",                element: wrap(<Caisse />) },
      { path: "construction",          element: wrap(<Construction />) },
      { path: "departements",          element: wrap(<Departements />) },
      { path: "membres",               element: wrap(<Membres />) },
    ],
  },
]);
