import crypto from "crypto";

// URL et realm utilises pour verifier les tokens Keycloak.
const keycloakUrl = process.env.KEYCLOAK_URL || "http://localhost:8080";
const keycloakRealm = process.env.KEYCLOAK_REALM || "book_realm";
const expectedIssuer = `${keycloakUrl}/realms/${keycloakRealm}`;

// Variables pour garder les cles publiques en memoire.
let jwksCache = null;
let jwksFetchedAt = 0;

// Convertit une valeur base64url en base64 classique.
function toBase64(base64UrlValue) {
  return base64UrlValue.replace(/-/g, "+").replace(/_/g, "/");
}

// Decode une partie du token JWT.
function decodeTokenPart(value) {
  const normalized = toBase64(value);
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return JSON.parse(Buffer.from(`${normalized}${padding}`, "base64").toString("utf8"));
}

// Recupere le token depuis le header Authorization.
function getBearerToken(headerValue) {
  if (!headerValue || !headerValue.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice(7).trim();
}

function extractRoles(payload) {
  const realmRoles = Array.isArray(payload?.realm_access?.roles)
    ? payload.realm_access.roles
    : [];

  return realmRoles;
}

// Recupere les cles publiques de Keycloak.
async function getJwks() {
  const now = Date.now();

  if (jwksCache && now - jwksFetchedAt < 60 * 60 * 1000) {
    return jwksCache;
  }

  const response = await fetch(
    `${expectedIssuer}/protocol/openid-connect/certs`
  );

  if (!response.ok) {
    throw new Error("Impossible de recuperer les certificats Keycloak");
  }

  const data = await response.json();
  jwksCache = data.keys || [];
  jwksFetchedAt = now;
  return jwksCache;
}

// Transforme le certificat en format PEM.
function buildCertificatePem(x5cValue) {
  const lines = x5cValue.match(/.{1,64}/g) || [];
  return `-----BEGIN CERTIFICATE-----\n${lines.join("\n")}\n-----END CERTIFICATE-----`;
}

// Verifie que le token JWT est valide.
async function verifyAccessToken(token) {
  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    throw new Error("Token invalide");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = tokenParts;
  const header = decodeTokenPart(encodedHeader);
  const payload = decodeTokenPart(encodedPayload);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Algorithme ou identifiant de cle non supporte");
  }

  if (payload.iss !== expectedIssuer) {
    throw new Error("Issuer invalide");
  }

  if (!payload.exp || Date.now() >= payload.exp * 1000) {
    throw new Error("Token expire");
  }

  const keys = await getJwks();
  const matchingKey = keys.find((key) => key.kid === header.kid && Array.isArray(key.x5c));

  if (!matchingKey || !matchingKey.x5c?.[0]) {
    throw new Error("Cle publique introuvable");
  }

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();

  const isValid = verifier.verify(
    buildCertificatePem(matchingKey.x5c[0]),
    Buffer.from(toBase64(encodedSignature), "base64")
  );

  if (!isValid) {
    throw new Error("Signature invalide");
  }

  return payload;
}

// Middleware Express qui bloque l'acces si le token est absent ou invalide.
export async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    const payload = await verifyAccessToken(token);
    req.auth = payload;
    req.roles = extractRoles(payload);
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Token invalide ou expire" });
  }
}

// Verifie que l'utilisateur possede au moins un des roles autorises.
export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.roles) ? req.roles : [];
    const isAllowed = allowedRoles.some((role) => userRoles.includes(role));

    if (!isAllowed) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    next();
  };
}
