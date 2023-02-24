import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  const authUser = await User.find({ refresh_token: refreshToken });
  if (!authUser[0]) return res.sendStatus(403);
  const user = authUser[0]._id;
  req.user = user;
  next();
};
