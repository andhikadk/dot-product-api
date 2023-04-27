import express from 'express';
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { verifyToken } from '../middlewares/authUser.js';

const router = express.Router();

router
  .get('/brands', verifyToken, getBrands)
  .get('/brands/:id', verifyToken, getBrandById)
  .post('/brands', verifyToken, createBrand)
  .put('/brands/:id', verifyToken, updateBrand)
  .delete('/brands/:id', verifyToken, deleteBrand);

export default router;
