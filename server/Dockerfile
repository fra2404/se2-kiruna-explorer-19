# Usa un'immagine di base per Node.js
FROM node:14

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il codice sorgente
COPY . .

# Espone la porta in base alla variabile di ambiente PORT
EXPOSE 5001

# Comando per avviare il server in modalità sviluppo
CMD ["npm", "run", "dev"]