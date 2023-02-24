import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await User.find({ refresh_token: refreshToken });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_TOKEN,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const { _id, name, email, role } = user[0];
        const accessToken = jwt.sign(
          { _id, name, email, role },
          process.env.ACCESS_SECRET_TOKEN,
          {
            expiresIn: '15s',
          }
        );
        res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
