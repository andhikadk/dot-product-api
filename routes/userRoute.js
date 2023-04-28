import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authUser.js';

const router = express.Router();

router
  .get('/users', verifyToken, getUsers)
  .get('/users/:id', verifyToken, getUserById)
  .put('/users/:id', verifyToken, updateUser)
  .delete('/users/:id', verifyToken, deleteUser);

export default router;
