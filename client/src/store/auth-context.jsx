import { createContext, useContext } from "react";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
