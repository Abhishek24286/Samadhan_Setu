import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['citizen', 'university', 'admin'],
      default: 'citizen',
    },
    institutionName: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    // New fields for University
    registrationNumber: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    expertiseTags: {
      type: [String],
      default: [],
    },
    serviceLocation: {
      type: String,
      default: '',
    },
    contactPerson: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'pending_approval', 'disabled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
