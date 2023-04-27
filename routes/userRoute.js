import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authUser.js';

const router = express.Router();

router
  .get('/users', getUsers)
  .get('/users/:id', getUserById)
  .post('/users', createUser)
  .put('/users/:id', verifyToken, updateUser)
  .delete('/users/:id', verifyToken, deleteUser);

export default router;
