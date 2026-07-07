const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
        include: [{ model: db.Role }]
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(401).json({ message: 'Token is invalid or expired' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No authentication token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.Role || !roles.includes(req.user.Role.role_name)) {
      const roleName = req.user?.Role?.role_name || 'UNDEFINED';
      return res.status(403).json({
        message: `User role ${roleName} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
