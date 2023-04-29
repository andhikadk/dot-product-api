import express from 'express';
import {
  register,
  login,
  logout,
  token,
  profile,
} from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authUser.js';

const router = express.Router();

router
  .post('/register', register)
  .post('/login', login)
  .delete('/logout', logout)
  .get('/token', token)
  .get('/profile', verifyToken, profile);

export default router;
