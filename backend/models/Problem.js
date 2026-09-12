import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      default: 'Government Administrator',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Drinking Water',
        'Roads & Transport',
        'Electricity & Power',
        'Sanitation & Waste',
        'Healthcare',
        'Education',
        'Agriculture & Irrigation',
        'Environment & Forest',
        'Public Safety',
        'Other'
      ],
      default: 'Other',
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: String,
      trim: true,
      default: 'Sadar Block',
    },
    village: {
      type: String,
      trim: true,
      default: 'Gram Panchayat Area',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    citizenName: {
      type: String,
      required: true,
      trim: true,
    },
    citizenMobile: {
      type: String,
      required: true,
      trim: true,
    },
    citizenEmail: {
      type: String,
      trim: true,
      default: '',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Approved',
        'Assigned',
        'Solution Proposed',
        'Work in Progress',
        'Resolved',
        'Rejected'
      ],
      default: 'Submitted',
    },
    assignedTo: {
      type: String,
      enum: ['None', 'Department', 'University'],
      default: 'None',
    },
    assignedDepartment: {
      type: String,
      default: '',
    },
    assignedUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedUniversityName: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    timeline: [timelineEventSchema],
  },
  {
    timestamps: true,
  }
);

export const Problem = mongoose.model('Problem', problemSchema);
