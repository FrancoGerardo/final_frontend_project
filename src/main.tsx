import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Basename para React Router - derivado de BASE_URL de Vite
// Convierte valores como '/' o './' en '/'
const resolvedBase = new URL(
  import.meta.env.BASE_URL || "/",
  window.location.href
).pathname;
const basename = resolvedBase === "/" ? undefined : resolvedBase;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
