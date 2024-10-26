import dotenv from 'dotenv';
import connectDB from './config/database';
import app from './app';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Log per verificare il caricamento delle variabili d'ambiente
console.log('MONGO_URI:', process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;

// Connetti al database
connectDB();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});