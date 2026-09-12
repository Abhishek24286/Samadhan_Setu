import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    problemRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submittedBy: {
      type: String,
      required: true,
    },
    institutionName: {
      type: String,
      required: true,
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
    technicalDetails: {
      type: String,
      required: true,
    },
    estimatedResources: {
      type: String,
      default: '',
    },
    documents: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Proposed', 'Under Review', 'Approved', 'Implemented'],
      default: 'Proposed',
    },
  },
  {
    timestamps: true,
  }
);

export const Solution = mongoose.model('Solution', solutionSchema);
