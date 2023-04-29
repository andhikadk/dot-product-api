import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Brand from '../models/Brand.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const products = await Product.find()
        .populate('user', 'name')
        .populate('brand', 'name');
      return res.status(200).json(products);
    }
    const products = await Product.find({
      user: req.user,
    })
      .populate('user', 'name')
      .populate('brand', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name')
      .populate('brand', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res) => {
  const { name, price, brand } = req.body;
  if (!name || !price || !brand)
    return res.status(400).json({ message: 'All field are required' });
  try {
    const brandId = await Brand.findById(brand);
    await Product.create({
      user: req.user,
      name,
      price,
      brand: brandId._id,
    });
    const createdProduct = await Product.findOne();
    res.status(201).json({
      message: 'Product created successfully',
      _id: createdProduct._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
export const updateProduct = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'product not found' });
  }
  try {
    const updatedproduct = await Product.findById(req.params.id);
    if (!updatedproduct) {
      return res.status(404).json({ message: 'product not found' });
    }
    await Product.updateOne({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
