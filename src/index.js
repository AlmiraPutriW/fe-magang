import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Pastikan AuthProvider di-import
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Pastikan ini membungkus App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
