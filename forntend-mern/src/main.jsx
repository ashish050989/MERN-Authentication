import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

export const serverUrl = "http://localhost:5001";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App serverUrl={serverUrl} />
  </StrictMode>,
);
