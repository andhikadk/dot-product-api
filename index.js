import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './config/database.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import authRoute from './routes/authRoute.js';
import brandRoute from './routes/brandRoute.js';

// Config
dotenv.config();
export const app = express();
db();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', userRoute);
app.use('/api', productRoute);
app.use('/api', authRoute);
app.use('/api', brandRoute);
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route Not found' });
});

// Server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
