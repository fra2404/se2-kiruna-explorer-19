import connectDB from './config/database';
import { app } from './app';
import 'module-alias/register';
import dotenv from 'dotenv';
import { setupSwagger } from './swagger';

// Determina quale file .env caricare
const envFile = process.env.DOCKER_ENV ? '.env.docker' : '.env.local';

// Carica le variabili d'ambiente dal file specificato
dotenv.config({ path: envFile });

// Log per verificare il caricamento delle variabili d'ambiente
// console.log('MONGO_URI:', process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;

// Connetti al database
connectDB();

// Configura Swagger
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});