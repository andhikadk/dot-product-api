import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { verifyToken } from '../middlewares/authUser.js';

const router = express.Router();

router
  .get('/products', verifyToken, getProducts)
  .get('/products/:id', verifyToken, getProductById)
  .post('/products', verifyToken, createProduct)
  .put('/products/:id', verifyToken, updateProduct)
  .delete('/products/:id', verifyToken, deleteProduct);

export default router;
