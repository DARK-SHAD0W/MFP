FROM node:25.6.1-alpine3.23

WORKDIR /app

# Déterminisme install
COPY package.json package-lock.json ./
RUN npm ci

# Créer le dossier data (utile pour volume + ro)
RUN mkdir -p /app/data

# Copier le code
COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000

CMD ["npm","run","dev"]