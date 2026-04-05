import axios from "axios";
import keycloak from "../auth/keycloak";

// Instance Axios utilisee pour appeler le backend.
const http = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "content-type": "application/json" }
});

// Ajoute automatiquement le token a chaque requete si l'utilisateur est connecte.
http.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  }

  return config;
});

export default http;
