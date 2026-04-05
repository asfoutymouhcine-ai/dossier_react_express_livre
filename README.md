# Application Livres

Projet de gestion de livres developpe avec React pour le frontend, Express pour le backend, MongoDB pour la base de donnees et Keycloak pour l'authentification et la gestion des roles.

## Technologies utilisees

- React
- Express.js
- MongoDB
- Keycloak
- Docker Compose

## Structure du projet

```text
dossier_react_express_livre/
|- Front_Book/
|- Backend_Book/
`- docker-compose.yaml
```

## Fonctionnalites principales

- Authentification avec Keycloak
- Inscription d'un nouvel utilisateur depuis le frontend
- Gestion des roles `admin` et `client`
- Protection des routes avec token Bearer
- Gestion des livres
- Gestion des categories
- Filtrage des livres par categorie

## RBAC

Le projet applique un controle d'acces base sur les roles :

- `client`
  - peut lire les livres et categories
  - peut ajouter un livre
  - peut ajouter une categorie
  - ne peut pas modifier
  - ne peut pas supprimer

- `admin`
  - peut lire
  - peut ajouter
  - peut modifier
  - peut supprimer

## Lancement du projet

### 1. Lancer Keycloak et MongoDB

Depuis la racine du projet :

```powershell
docker compose up -d
```

### 2. Lancer le backend

```powershell
cd Backend_Book
npm install
npm run dev
```

### 3. Lancer le frontend

```powershell
cd Front_Book
npm install
npm run dev
```

## Configuration Keycloak

Configurer dans Keycloak :

- Realm : `book_realm`
- Client frontend : `book_front`
- Roles :
  - `admin`
  - `client`

Exemple d'utilisateurs :

- `asfoury` -> role `admin`
- `mouhcine` -> role `client`

Pour l'inscription :

- activer la registration dans Keycloak
- donner automatiquement le role `client` aux nouveaux comptes si demande

## Verification dans DevTools

Dans le navigateur :

1. Ouvrir DevTools avec `F12`
2. Aller dans `Network`
3. Recharger la page
4. Cliquer sur une requete `/api/books` ou `/api/categories`
5. Verifier dans `Request Headers` :

```text
Authorization: Bearer <token>
```

## Tests attendus

- Sans connexion : requete protegee -> `401`
- Connecte avec `client` :
  - `GET` -> `200`
  - `POST` -> `200`
  - `PUT` -> `403`
  - `DELETE` -> `403`
- Connecte avec `admin` :
  - `GET` -> `200`
  - `POST` -> `200`
  - `PUT` -> `200`
  - `DELETE` -> `200`

## Auteur

- Projet realise par MOUHCINE
