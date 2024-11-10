# Usa un'immagine di base per Node.js
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il codice sorgente
COPY . .

# Espone la porta 5173, che è la porta predefinita per Vite
EXPOSE 5173

# Comando per avviare l'app in modalità sviluppo con Vite
CMD ["npm", "run", "dev", "--host", "0.0.0.0"]  
# Assicurati di avere lo script "dev" definito nel package.json