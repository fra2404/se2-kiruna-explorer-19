import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

export const app = express();

app.use(express.json());
app.use(cookieParser());

// Rotte
app.use('/api', router);

// Middleware di gestione degli errori
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
