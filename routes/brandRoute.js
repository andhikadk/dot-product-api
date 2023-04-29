import express from 'express';
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authUser.js';

const router = express.Router();

router
  .get('/brands', verifyToken, getBrands)
  .get('/brands/:id', verifyToken, getBrandById)
  .post('/brands', verifyAdmin, createBrand)
  .put('/brands/:id', verifyAdmin, updateBrand)
  .delete('/brands/:id', verifyAdmin, deleteBrand);

export default router;
