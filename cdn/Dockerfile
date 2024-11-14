# Usa l'immagine ufficiale di Node.js con supporto multi-architettura
FROM node:18

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file di package per gestire correttamente la cache
COPY package*.json ./

# Installa le dipendenze, forzando la ricostruzione di bcrypt
RUN npm install 

# Copia il resto del codice dell'applicazione
COPY . .

# Esponi la porta usata dall'applicazione (5001)
EXPOSE 3004

# Comando per avviare l'applicazione
CMD ["npm", "run", "dev"]
