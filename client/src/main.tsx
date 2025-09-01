import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "tailwindcss-animate"; // ✅ importa qui il JS delle animazioni

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

