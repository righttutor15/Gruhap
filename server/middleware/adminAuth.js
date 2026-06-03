const jwt = require('jsonwebtoken');
const { ApiError } = require('../Utils/ApiError');

const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gruhap_admin_jwt_secret_key');
    
    // Check if user has admin role (RBAC check)
    if (decoded.role !== 'admin') {
      throw new ApiError(403, 'Forbidden. Admin privileges required.');
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid authentication token.'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Authentication token has expired.'));
    } else {
      next(error);
    }
  }
};

module.exports = { verifyAdminToken };
