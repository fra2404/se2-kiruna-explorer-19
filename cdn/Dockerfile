# Usa una base Node.js
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file dell’applicazione
COPY . .

# Copia il file .env
COPY .env .env

# Costruisce l'applicazione
#RUN npm run build

# Espone la porta (assicurati che corrisponda a quella usata nell'app e nel docker-compose)
EXPOSE 3004

# Comando per avviare il servizio CDN
CMD ["npm", "run", "dev"]
