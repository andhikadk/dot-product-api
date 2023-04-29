import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;
    const token = headers && headers.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;
    const token = headers && headers.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      if (user.role !== 'admin')
        return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
