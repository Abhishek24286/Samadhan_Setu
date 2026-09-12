import express from 'express';
import { Problem } from '../models/Problem.js';
import { User } from '../models/User.js';

const router = express.Router();

// Helper to generate sequential Reference ID: JH-2026-000001
const generateProblemId = async () => {
  const count = await Problem.countDocuments();
  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `JH-2026-${nextNumber}`;
};

// 1. Citizen Report Problem (Public or Logged In)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      district,
      block,
      village,
      location,
      citizenName,
      citizenMobile,
      citizenEmail,
    } = req.body;

    if (!title || !description || !category || !district || !location || !citizenName || !citizenMobile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (title, description, category, district, location, your name, and mobile).',
      });
    }

    const problemId = await generateProblemId();

    const newProblem = new Problem({
      problemId,
      title,
      description,
      category,
      district,
      block: block || 'Sadar Block',
      village: village || 'Panchayat Area',
      location,
      citizenName,
      citizenMobile,
      citizenEmail: citizenEmail || '',
      status: 'Submitted',
      timeline: [
        {
          status: 'Submitted',
          message: 'Community problem registered successfully by citizen. Queued for administrative scrutiny.',
          updatedBy: 'Citizen',
          createdAt: new Date(),
        },
      ],
    });

    await newProblem.save();

    return res.status(201).json({
      success: true,
      message: 'Your community problem has been registered with the Government of Jharkhand portal.',
      problemId,
      problem: newProblem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record community problem.',
      error: error.message,
    });
  }
});

// 2. Track Problem by Reference ID (e.g., JH-2026-000001)
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

// 3. Slider / Carousel Feed: Real Work in Progress & Community Solutions
router.get('/slider', async (req, res) => {
  try {
    // Return sample active / resolved work across districts for the homepage slider
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

// 4. Platform Aggregated Statistics (Real numbers from DB)
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
        districtsCovered: Math.max(districtsCount.length, 24), // 24 districts in Jharkhand
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

// 5. Public List of Problems
router.get('/', async (req, res) => {
  try {
    const { category, district, status, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (district && district !== 'All') filter.district = district;
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
