import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    const user = await User.findById(req.params.id, 'name email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Public
export const createUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (!name || !email || !password || !confPassword)
    return res.status(400).json({ message: 'All field are required' });
  if (password !== confPassword)
    return res.status(400).json({ message: 'Password does not match' });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const checkEmail = await User.find({ email });
    if (checkEmail.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const createdUser = await User.findOne();
    res
      .status(201)
      .json({ message: 'User created successfully', _id: createdUser._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { name, email, password, confPassword } = req.body;
  if (!name || !email || !password || !confPassword)
    return res.status(400).json({ message: 'All field are required' });
  if (password !== confPassword)
    return res.status(400).json({ message: 'Password does not match' });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const updatedUser = await User.findById(req.params.id);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name,
          email,
          password: hashedPassword,
        },
      }
    );
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
