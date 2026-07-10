import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { Investisseurs } from "./components/Investisseurs";
import { Caisse } from "./components/Caisse";
import { Construction } from "./components/Construction";
import { Departements } from "./components/Departements";
import { Membres } from "./components/Membres";
import { InscriptionPublique } from "./components/InscriptionPublique";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/inscription",
    Component: InscriptionPublique,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "investisseurs", Component: Investisseurs },
      { path: "caisse", Component: Caisse },
      { path: "construction", Component: Construction },
      { path: "departements", Component: Departements },
      { path: "membres", Component: Membres },
    ],
  },
]);
