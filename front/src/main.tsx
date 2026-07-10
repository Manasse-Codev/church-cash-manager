import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Élément #root introuvable dans le DOM.");

createRoot(rootEl).render(<App />);