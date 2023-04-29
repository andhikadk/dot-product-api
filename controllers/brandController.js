import mongoose from 'mongoose';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({
      user: req.user,
    });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
export const getBrandById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Brand not found' });
  }
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a brand
// @route   POST /api/brands
// @access  Public
export const createBrand = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'All field are required' });
  try {
    const checkBrand = await Brand.find({ name });
    if (checkBrand.length > 0) {
      return res.status(400).json({ message: 'Brand already exists' });
    }
    await Brand.create({
      name,
    });
    const createdBrand = await Brand.findOne();
    res.status(201).json({
      message: 'Brand created successfully',
      _id: createdBrand._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Public
export const updateBrand = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'brand not found' });
  }
  try {
    const updatedbrand = await Brand.findById(req.params.id);
    if (!updatedbrand) {
      return res.status(404).json({ message: 'brand not found' });
    }
    await Brand.updateOne({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({ message: 'Brand updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Public
export const deleteBrand = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Brand not found' });
  }
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    await Product.deleteMany({ brand: req.params.id });
    await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
