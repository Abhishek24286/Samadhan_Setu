import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mock OTP Store for development
const otpStore = new Map();

const generateMockOtp = (mobile) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(mobile, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
  console.log(`\n[MOCK SMS GATEWAY] OTP for ${mobile} is: ${otp}\n`);
  return otp;
};

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
    const { 
      name, email, mobile, password, userType, institutionName, district,
      registrationNumber, address, expertiseTags, serviceLocation, contactPerson,
      aadhaarNumber 
    } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: name, email, mobile, and password.',
      });
    }

    // Allow admin creation ONLY with official .gov.in email
    if (userType === 'admin') {
      if (!email.toLowerCase().endsWith('.gov.in')) {
        return res.status(403).json({
          success: false,
          message: 'Security Violation: District Collectorate accounts require an official .gov.in email address.',
        });
      }
    }

    let assignedRole = 'citizen';
    if (userType === 'university') assignedRole = 'university';
    if (userType === 'admin') assignedRole = 'admin';

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
      aadhaarNumber: assignedRole === 'citizen' ? (aadhaarNumber || undefined) : undefined,
      registrationNumber: assignedRole === 'university' ? registrationNumber : '',
      address: assignedRole === 'university' ? address : '',
      expertiseTags: assignedRole === 'university' ? (expertiseTags || []) : [],
      serviceLocation: assignedRole === 'university' ? serviceLocation : '',
      contactPerson: assignedRole === 'university' ? contactPerson : '',
      status: assignedRole === 'university' ? 'pending_approval' : 'active',
    });

    await newUser.save();

    const token = generateToken(newUser);

    let successMessage = 'Citizen account created successfully.';
    if (assignedRole === 'university') {
      successMessage = 'University registration submitted! Account is pending district nodal verification.';
    } else if (assignedRole === 'admin') {
      successMessage = 'District Collectorate account created successfully.';
    }

    return res.status(201).json({
      success: true,
      message: successMessage,
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
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A record with this identifier already exists in the system.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process registration.',
      error: error.message,
    });
  }
});

// 2. Standard Login (Citizen & University)
// 2. Standard Login (Citizen & University)
// 2. Standard Login (Citizen & University)
router.post('/login', async (req, res) => {
  try {
    // 1. Debug log to see what the frontend is actually sending
    console.log('Incoming Login Request Body:', req.body);

    const { email, mobile, aadhaarNumber, password, identifier } = req.body;

    // Grab whichever field has a value
    const loginValue = identifier || email || mobile || aadhaarNumber;

    if (!loginValue || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an identifier (email/mobile) and a password.',
      });
    }

    // Build a flexible query to find the user
    let query = {};
    const trimmedVal = String(loginValue).trim();

    if (trimmedVal.includes('@')) {
      query = { email: trimmedVal.toLowerCase() };
    } else {
      query = {
        $or: [
          { mobile: trimmedVal },
          { email: trimmedVal.toLowerCase() },
          { aadhaarNumber: trimmedVal }
        ]
      };
    }

    let user = await User.findOne(query);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account not found.',
      });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been disabled. Please contact support.',
      });
    }

    if (user.status === 'pending_approval') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending district nodal verification approval.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
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
    console.error('Login Error Stack:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
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

// 5. Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile, context } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile number or identification is required.' });

    const identifier = mobile.trim();

    if (context === 'login') {
      const user = await User.findOne({
        $or: [
          { mobile: identifier },
          { aadhaarNumber: identifier }
        ]
      }).select('+aadhaarNumber');

      if (!user) {
        return res.status(404).json({ success: false, message: 'No registered account found with this ID/mobile number.' });
      }
    }

    const otp = generateMockOtp(identifier);
    return res.json({
      success: true,
      message: 'OTP sent successfully (Prototype Test OTP: 123456).',
      mockOtp: otp 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// 6. Verify OTP Login (Updated with 123456 prototype bypass)
router.post('/verify-otp-login', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const identifier = mobile ? mobile.trim() : '';

    const isPrototypeBypass = (otp === '123456');
    const record = otpStore.get(identifier);

    if (!isPrototypeBypass && (!record || record.otp !== otp || record.expiresAt < Date.now())) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP. (Use 123456 for testing)' });
    }

    let user = await User.findOne({
      $or: [
        { mobile: identifier },
        { aadhaarNumber: identifier }
      ]
    }).select('+aadhaarNumber');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ success: false, message: 'Account deactivated.' });
    }

    otpStore.delete(identifier);
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
    return res.status(500).json({ success: false, message: 'OTP verification failed.', error: error.message });
  }
});

// 7. Verify OTP Signup (Citizen only, updated with 123456 bypass)
router.post('/verify-otp-signup', async (req, res) => {
  try {
    const { name, mobile, otp, district, password, email, aadhaarNumber } = req.body;
    const identifier = (aadhaarNumber || mobile || '').trim();

    const isPrototypeBypass = (otp === '123456');
    const record = otpStore.get(identifier) || otpStore.get(mobile ? mobile.trim() : '');

    // If it's NOT the bypass code, enforce strict OTP record checks
    if (!isPrototypeBypass && (!record || record.otp !== otp || record.expiresAt < Date.now())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. (Use 123456 for testing)' });
    }

    const existingUser = await User.findOne({ 
      $or: [
        ...(mobile ? [{ mobile: mobile.trim() }] : []),
        ...(aadhaarNumber ? [{ aadhaarNumber: aadhaarNumber }] : []),
        ...(email ? [{ email: email.toLowerCase() }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this mobile, ID, or email already exists.' });
    }

    const finalEmail = email ? email.toLowerCase() : `${mobile || 'user'}@citizen.jharkhand.gov.in`;
    const finalPassword = password || mobile || 'Password123!';

    const newUser = new User({
      name: name || 'Citizen User',
      email: finalEmail,
      mobile: mobile ? mobile.trim() : '',
      password: finalPassword,
      role: 'citizen',
      district: district || 'Ranchi',
      aadhaarNumber: aadhaarNumber || undefined,
      status: 'active',
    });

    await newUser.save();
    if (identifier) otpStore.delete(identifier);
    
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Citizen account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        district: newUser.district,
        status: newUser.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Signup failed.', error: error.message });
  }
});

export default router;