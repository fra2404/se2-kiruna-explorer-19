# Usa una base Node.js
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file
COPY . .

# Carica variabili di ambiente dal file .env del server
COPY .env .env


# Espone la porta
EXPOSE 5001

# Comando per avviare il server
CMD ["npm", "run", "dev"]
