import express from 'express';
import fs from 'fs';
import { Problem } from '../models/Problem.js';
import { User } from '../models/User.js';
import { analyzeProblemWithAI } from '../services/aiService.js';
import { routeProblemToUniversities } from '../services/routingService.js';
import upload from '../middleware/uploadMiddleware.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate sequential Reference ID: JH-2026-000001
const generateProblemId = async () => {
  const count = await Problem.countDocuments();
  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `JH-2026-${nextNumber}`;
};

// ==========================================
// 1. CITIZEN REPORT PROBLEM (With Image Upload)
// ==========================================
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const {
      description,
      district,
      block,
      village,
      location,
      citizenName,
      citizenMobile,
      citizenEmail,
    } = req.body;

    if (!description || !district || !location || !citizenName || !citizenMobile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (description, district, location, name, and mobile).',
      });
    }

    // Since multer diskStorage saves the file to the 'uploads/' folder, 
    // read the file buffer from disk so the AI service can analyze it.
    let imageBuffer = null;
    let mimeType = null;
    if (req.file) {
      imageBuffer = fs.readFileSync(req.file.path);
      mimeType = req.file.mimetype;
    }

    // Call AI service with text description and image buffer/mimetype
    const aiResult = await analyzeProblemWithAI(description, imageBuffer, mimeType);
    const problemId = await generateProblemId();

    // Store relative file path string for MongoDB storage & frontend rendering
    const imagePathUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProblem = new Problem({
      problemId,
      title: aiResult.title || description.slice(0, 40) + '...',
      category: aiResult.category || 'Other',
      description,
      aiMetadata: {
        severity: aiResult.severity || 'Medium',
        tags: aiResult.tags || [],
        summary: aiResult.summary || '',
        confidenceScore: aiResult.confidenceScore || 0,
      },
      imageUrl: imagePathUrl, // Matches your problemSchema definition
      district,
      block: block || 'Sadar Block',
      village: village || 'Gram Panchayat Area',
      location,
      citizenName,
      citizenMobile,
      citizenEmail: citizenEmail || '',
      reportedBy: req.user._id, // Set from authMiddleware
      status: 'Submitted',
      assignedTo: 'None',
      timeline: [
        {
          status: 'Submitted',
          message: `Community problem registered successfully. Auto-generated title: "${aiResult.title}" | Category: '${aiResult.category}'.`,
          updatedBy: req.user.name || 'Citizen',
          createdAt: new Date(),
        },
      ],
    });

    await newProblem.save();

    // AUTOMATIC EXPERTISE-BASED ROUTING TO UNIVERSITIES
    await routeProblemToUniversities(problemId, aiResult.category, aiResult.tags);

    return res.status(201).json({
      success: true,
      message: 'Your problem has been registered, auto-categorized by AI with image analysis, and routed to an expert university.',
      problemId,
      problem: newProblem,
    });
  } catch (error) {
    console.error('Error recording community problem:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record community problem.',
      error: error.message,
    });
  }
});

// ==========================================
// 2. TRACK PROBLEM BY REFERENCE ID
// ==========================================
router.get('/track/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const formattedId = problemId.trim().toUpperCase();

    const problem = await Problem.findOne({ problemId: formattedId });
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `No grievance or problem record found with Reference ID '${formattedId}'. Please verify and try again.`,
      });
    }

    return res.json({
      success: true,
      problem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error looking up problem record.',
      error: error.message,
    });
  }
});

// ==========================================
// 3. SLIDER / CAROUSEL FEED
// ==========================================
router.get('/slider', async (req, res) => {
  try {
    const items = await Problem.find({
      status: { $in: ['Under Review', 'Approved', 'Assigned', 'Solution Proposed', 'Work in Progress', 'Resolved'] },
    })
      .sort({ updatedAt: -1 })
      .limit(6);

    return res.json({
      success: true,
      count: items.length,
      problems: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch slider items.',
      error: error.message,
    });
  }
});

// ==========================================
// 4. PLATFORM AGGREGATED STATISTICS
// ==========================================
router.get('/stats', async (req, res) => {
  try {
    const totalReported = await Problem.countDocuments();
    const totalResolved = await Problem.countDocuments({ status: 'Resolved' });
    const inProgress = await Problem.countDocuments({
      status: { $in: ['Under Review', 'Approved', 'Assigned', 'Solution Proposed', 'Work in Progress'] },
    });
    const districtsCount = await Problem.distinct('district');
    const universitiesCount = await User.countDocuments({ role: 'university', status: 'active' });

    return res.json({
      success: true,
      stats: {
        problemsReported: totalReported,
        problemsResolved: totalResolved,
        problemsInProgress: inProgress,
        districtsCovered: Math.max(districtsCount.length, 24),
        universitiesParticipating: Math.max(universitiesCount, 5),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate platform statistics.',
      error: error.message,
    });
  }
});

// ==========================================
// 5. PUBLIC LIST OF PROBLEMS (With Filters)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { category, district, status, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if(district && district !== 'All') filter.district = district;
    if (status && status !== 'All') filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { problemId: { $regex: search, $options: 'i' } },
      ];
    }

    const problems = await Problem.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve problems list.',
      error: error.message,
    });
  }
});

export default router;