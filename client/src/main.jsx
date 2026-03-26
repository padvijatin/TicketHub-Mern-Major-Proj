import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./store/auth.jsx";
import { WishlistProvider } from "./store/wishlist.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </AuthProvider>
);
