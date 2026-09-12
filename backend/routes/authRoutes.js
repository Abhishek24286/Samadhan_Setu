import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'jharkhand_secret_2026',
    { expiresIn: '7d' }
  );
};

// 1. Citizen & University Public Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password, userType, institutionName, district } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: name, email, mobile, and password.',
      });
    }

    // STRICT SECURITY RULE: Public signup MUST NEVER allow admin creation
    if (userType === 'admin' || req.body.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Government Administrator accounts cannot be created through public registration.',
      });
    }

    const assignedRole = userType === 'university' ? 'university' : 'citizen';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
      role: assignedRole,
      institutionName: assignedRole === 'university' ? institutionName || name : '',
      district: district || 'Ranchi',
      status: assignedRole === 'university' ? 'pending_approval' : 'active',
    });

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message:
        assignedRole === 'university'
          ? 'University registration submitted! Account is pending district nodal verification.'
          : 'Citizen account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        institutionName: newUser.institutionName,
        district: newUser.district,
        status: newUser.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process registration.',
      error: error.message,
    });
  }
});

// 2. Standard Login (Citizen & University)
router.post('/login', async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email/mobile and password.',
      });
    }

    // Lookup by email or mobile
    const user = await User.findOne({
      $or: [
        { email: emailOrMobile.toLowerCase() },
        { mobile: emailOrMobile.trim() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No registered account found with these details.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated by the administrator.',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        institutionName: user.institutionName,
        district: user.district,
        status: user.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login service encountered an error.',
      error: error.message,
    });
  }
});

// 3. Dedicated Government Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Government Official ID and Password are required.',
      });
    }

    const user = await User.findOne({
      $or: [
        { email: adminId.toLowerCase() },
        { mobile: adminId.trim() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Administrative credentials not recognized.',
      });
    }

    // STRICT ROLE VERIFICATION: Must have role 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: This portal is strictly restricted to authorized Government of Jharkhand administrators.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Incorrect administrative security key.',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Government Administrative Session Authorized.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionName: user.institutionName,
        district: user.district,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Administrative authentication service error.',
      error: error.message,
    });
  }
});

// 4. Current User Session Profile
router.get('/me', verifyToken, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

export default router;
