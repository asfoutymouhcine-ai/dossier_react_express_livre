FROM node:18

# Dossier de travail
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le projet
COPY . .

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "dev"]