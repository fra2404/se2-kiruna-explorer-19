import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/routes';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middleware';

export const app = express();

// Abilita CORS per la porta 5173
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Rotte
app.use('/api', router);

// Middleware di gestione degli errori
app.use(errorHandler);
