import Keycloak from 'keycloak-js'

// Hna kan7eddou config dyal Keycloak.
// Ila ma kanouch env vars, ghadi yakhod had defaults.
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'book_realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'book_front',
}

// Kancreyiw instance wa7da bach n3awdou nst3mloha f app kamla.
const keycloak = new Keycloak(keycloakConfig)

export default keycloak
