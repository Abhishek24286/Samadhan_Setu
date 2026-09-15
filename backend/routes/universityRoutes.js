import express from 'express';
import { Problem } from '../models/Problem.js';
import { User } from '../models/User.js';
import { Solution } from '../models/Solution.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Get assigned inbox items for logged-in university
router.get(['/inbox', '/my-problems'], verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'university') {
      return res.status(403).json({ success: false, message: 'Access denied. University role required.' });
    }

    const university = await User.findById(req.user._id);

    // Fetch problems assigned directly to this university ID or matching their specific expertise tags
    const problems = await Problem.find({
      $or: [
        { assignedUniversity: university._id },
        { 
          assignedTo: 'University', 
          category: { $in: university.expertiseTags } 
        }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Express interest and submit a preliminary approach for an assigned problem
router.patch('/propose/:problemId', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'university') {
      return res.status(403).json({ success: false, message: 'Access denied. University role required.' });
    }

    const { problemId } = req.params;
    const { proposalDetails } = req.body;

    if (!proposalDetails) {
      return res.status(400).json({ success: false, message: 'Please provide a preliminary approach or notes.' });
    }

    const university = await User.findById(req.user._id);

    const cleanId = problemId ? problemId.trim() : '';
    let problem = await Problem.findOne({
      $or: [
        { problemId: cleanId },
        { problemId: cleanId.toUpperCase() }
      ]
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem record not found.' });
    }

    problem.assignedUniversity = university._id;
    problem.assignedUniversityName = university.institutionName || university.name;
    problem.status = 'Under Review'; 
    problem.adminRemarks = `University Preliminary Approach: ${proposalDetails}`;
    
    if (!Array.isArray(problem.timeline)) {
      problem.timeline = [];
    }

    problem.timeline.push({
      status: 'Under Review',
      message: `${university.institutionName || university.name} submitted a preliminary approach: "${proposalDetails}"`,
      updatedBy: university.name || 'University Representative',
      createdAt: new Date(),
    });

    await problem.save();

    return res.status(200).json({
      success: true,
      message: 'Preliminary approach logged successfully.',
      problem,
    });
  } catch (error) {
    console.error('[Propose Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Submit a technical solution or prototype for an assigned problem
router.post('/solutions', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'university') {
      return res.status(403).json({ success: false, message: 'Access denied. University role required.' });
    }

    const { 
      problemId,          
      title, 
      description, 
      technicalDetails, 
      estimatedResources, 
      documents 
    } = req.body;

    if (!problemId || !title || !description || !technicalDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide the problem ID, title, description, and technical details.' 
      });
    }

    const problem = await Problem.findOne({ problemId: problemId.trim().toUpperCase() });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem record not found.' });
    }

    const university = await User.findById(req.user._id);

    const newSolution = new Solution({
      problemId: problem.problemId,
      problemRef: problem._id,
      universityId: university._id,
      submittedBy: university.name || 'University Faculty/Representative',
      institutionName: university.institutionName || university.name,
      title,
      description,
      technicalDetails,
      estimatedResources: estimatedResources || '',
      documents: documents || '',
      status: 'Proposed',
    });

    await newSolution.save();

    problem.status = 'Solution Proposed';
    problem.timeline.push({
      status: 'Solution Proposed',
      message: `Technical solution proposed by ${university.institutionName || university.name}: "${title}"`,
      updatedBy: university.name || 'University Representative',
      createdAt: new Date(),
    });

    await problem.save();

    return res.status(201).json({
      success: true,
      message: 'Solution successfully submitted and logged to the problem timeline.',
      solution: newSolution,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Get all solutions submitted by the logged-in university
router.get('/solutions/my-submissions', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'university') {
      return res.status(403).json({ success: false, message: 'Access denied. University role required.' });
    }

    const solutions = await Solution.find({ universityId: req.user._id })
      .populate('problemRef', 'problemId title district category status')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: solutions.length,
      solutions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;