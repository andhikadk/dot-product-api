import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Register a user
// @route   POST /api/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (!name || !email || !password || !confPassword)
    return res.status(400).json({ message: 'All fields are required' });
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

// @desc    Login user
// @route   POST /api/login
// @access  Public
export const login = async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length < 1)
      return res.status(401).json({ message: 'User not found' });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.status(401).json({ message: 'Password does not match' });
    }
    const { _id, name, email, role } = user[0];
    const accessToken = jwt.sign(
      { _id, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );
    const refreshToken = jwt.sign(
      { _id, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    await User.updateOne({ _id }, { refresh_token: refreshToken });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /logout
// @access  Public
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.find({ refresh_token: refreshToken });
  if (!user[0]) return res.sendStatus(204);
  const { _id } = user[0];
  await User.findByIdAndUpdate(_id, { refresh_token: null });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

// @desc    Refresh token
// @route   GET /token
// @access  Public
export const token = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.find({ refresh_token: refreshToken });
    if (!user[0]) return res.status(401).json({ message: 'Unauthorized' });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        const { _id, name, email, role } = user[0];
        const accessToken = jwt.sign(
          { _id, name, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '60s',
          }
        );
        res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
