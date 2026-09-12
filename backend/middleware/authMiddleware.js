import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid format. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jharkhand_secret_2026');

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found. Authentication rejected.',
      });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({
        success: false,
        message: 'Account has been disabled by district administration.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
      error: error.message,
    });
  }
};

// Role-based authorization middleware
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this administrative resource.`,
      });
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireUniversity = requireRole('university', 'admin');
