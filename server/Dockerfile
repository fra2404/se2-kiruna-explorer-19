# Usa l'immagine ufficiale di Node.js con supporto multi-architettura
FROM node:18

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file di package per gestire correttamente la cache
COPY package*.json ./

# Installa strumenti di build per la compilazione dei moduli nativi
RUN apt-get update && apt-get install -y python3 make g++

# Installa le dipendenze, forzando la ricostruzione di bcrypt
RUN npm install && npm rebuild bcrypt --build-from-source

# Copia il resto del codice dell'applicazione
COPY . .

# Esponi la porta usata dall'applicazione (5001)
EXPOSE 5001

# Comando per avviare l'applicazione
CMD ["npm", "run", "dev"]
