import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./shared/context/AuthProvider";

const CHUNK_RELOAD_KEY = "litaro_chunk_reload";

window.addEventListener("vite:preloadError", (event) => {
  let last;

  try {
    last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0);
  } catch {
    last = Date.now();
  }

  if (Date.now() - last < 10000) return;

  try {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    return;
  }

  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
