import express from 'express';
import { Problem } from '../models/Problem.js';
import { Solution } from '../models/Solution.js';
import { User } from '../models/User.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Public Directory of Participating Technical Institutions
router.get('/directory', async (req, res) => {
  try {
    const universities = await User.find({ role: 'university', status: 'active' }).select(
      'name email mobile institutionName district createdAt'
    );

    const enriched = await Promise.all(
      universities.map(async (u) => {
        const assignedCount = await Problem.countDocuments({ assignedUniversity: u._id });
        const resolvedCount = await Problem.countDocuments({ assignedUniversity: u._id, status: 'Resolved' });
        const recentProblems = await Problem.find({ assignedUniversity: u._id })
          .select('title category district status')
          .limit(2);

        return {
          id: u._id,
          name: u.name,
          institutionName: u.institutionName || u.name,
          email: u.email,
          district: u.district || 'Ranchi',
          assignedCount,
          resolvedCount,
          recentProblems,
        };
      })
    );

    return res.json({
      success: true,
      universities: enriched,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve university directory.',
      error: error.message,
    });
  }
});

// All routes below require University or Admin authentication
router.use(verifyToken);
router.use(requireRole('university', 'admin'));

// 2. Get Problems Assigned to the Logged-in University
router.get('/my-problems', async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignedUniversity: req.user._id };

    const problems = await Problem.find(query).sort({ updatedAt: -1 });

    return res.json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned problems.',
      error: error.message,
    });
  }
});

// 3. Submit Proposed Solution for an Assigned Problem
router.post('/solutions', async (req, res) => {
  try {
    const {
      problemId,
      title,
      description,
      technicalDetails,
      estimatedResources,
      documents,
      submittedBy,
    } = req.body;

    if (!problemId || !title || !description || !technicalDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide problem ID, solution title, description, and technical details.',
      });
    }

    const problem = await Problem.findOne({ problemId });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem record not found.' });
    }

    const solution = new Solution({
      problemId,
      problemRef: problem._id,
      universityId: req.user._id,
      submittedBy: submittedBy || req.user.name,
      institutionName: req.user.institutionName || req.user.name,
      title,
      description,
      technicalDetails,
      estimatedResources: estimatedResources || 'As per departmental standards',
      documents: documents || '',
      status: 'Proposed',
    });

    await solution.save();

    // Automatically update problem status to 'Solution Proposed'
    problem.status = 'Solution Proposed';
    problem.timeline.push({
      status: 'Solution Proposed',
      message: `Technical solution proposed by ${req.user.institutionName || req.user.name}: "${title}". Pending district administrative review.`,
      updatedBy: req.user.name,
      createdAt: new Date(),
    });

    await problem.save();

    return res.status(201).json({
      success: true,
      message: 'Technical solution submitted successfully. District administration has been notified.',
      solution,
      problem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record solution submission.',
      error: error.message,
    });
  }
});

// 4. Get Solutions Submitted by this University
router.get('/my-solutions', async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { universityId: req.user._id };
    const solutions = await Solution.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: solutions.length,
      solutions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve submitted solutions.',
      error: error.message,
    });
  }
});

export default router;
