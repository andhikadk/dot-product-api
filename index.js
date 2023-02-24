import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import authRoute from './routes/authRoute.js';

dotenv.config();
const app = express();

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
  console.log('Database connected');
});

// Middleware
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
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Server
app.listen(process.env.APP_PORT, () => {
  console.log(`Server running at ${process.env.APP_PORT}`);
});
