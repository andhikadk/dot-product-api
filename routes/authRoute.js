import express from 'express';
import {
  register,
  login,
  logout,
  token,
} from '../controllers/authController.js';

const router = express.Router();

router
  .post('/register', register)
  .post('/login', login)
  .delete('/logout', logout)
  .get('/token', token);

export default router;
