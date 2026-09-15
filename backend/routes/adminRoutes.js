import express from 'express';
import { Problem } from '../models/Problem.js';
import { User } from '../models/User.js';
import { Solution } from '../models/Solution.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply strict admin authentication and authorization to ALL routes in this file
router.use(verifyToken);
router.use(requireAdmin);

// 1. Get All Problems (for Admin Management)
router.get('/problems', async (req, res) => {
  try {
    const { status, district, category, search } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status;
    if (district && district !== 'All') filter.district = district;
    if (category && category !== 'All') filter.category = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { citizenName: { $regex: search, $options: 'i' } },
        { problemId: { $regex: search, $options: 'i' } },
      ];
    }

    const problems = await Problem.find(filter)
      .populate('assignedUniversity', 'name email institutionName district')
      .sort({ createdAt: -1 });

    const totalCount = await Problem.countDocuments();
    const pendingCount = await Problem.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } });
    const approvedCount = await Problem.countDocuments({ status: 'Approved' });
    const assignedCount = await Problem.countDocuments({ status: 'Assigned' });
    const inProgressCount = await Problem.countDocuments({
      status: { $in: ['Solution Proposed', 'Work in Progress'] },
    });
    const resolvedCount = await Problem.countDocuments({ status: 'Resolved' });
    const rejectedCount = await Problem.countDocuments({ status: 'Rejected' });

    return res.json({
      success: true,
      counts: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        assigned: assignedCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        rejected: rejectedCount,
      },
      problems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative problem repository.',
      error: error.message,
    });
  }
});

// 2. Approve Problem
router.patch('/problems/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem record not found.' });
    }

    problem.status = 'Approved';
    problem.adminRemarks = remarks || 'Problem validated and approved for institutional/departmental allocation.';
    problem.timeline.push({
      status: 'Approved',
      message: remarks || 'Verified by District Administration. Approved for technical solution development.',
      updatedBy: req.user.name,
      createdAt: new Date(),
    });

    await problem.save();

    return res.json({
      success: true,
      message: `Problem ${problem.problemId} has been approved successfully.`,
      problem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to approve problem.',
      error: error.message,
    });
  }
});

// 3. Reject Problem
router.patch('/problems/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'A documented rejection reason must be provided for administrative auditing.',
      });
    }

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem record not found.' });
    }

    problem.status = 'Rejected';
    problem.rejectionReason = reason;
    problem.timeline.push({
      status: 'Rejected',
      message: `Problem rejected during verification. Reason: ${reason}`,
      updatedBy: req.user.name,
      createdAt: new Date(),
    });

    await problem.save();

    return res.json({
      success: true,
      message: `Problem ${problem.problemId} rejected with recorded reason.`,
      problem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reject problem.',
      error: error.message,
    });
  }
});

// 4. Assign Problem to Department or University
router.patch('/problems/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignType, departmentName, universityId, remarks } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem record not found.' });
    }

    if (assignType === 'University') {
      const university = await User.findById(universityId);
      if (!university || university.role !== 'university') {
        return res.status(400).json({ success: false, message: 'Invalid technical institution selected.' });
      }
      problem.assignedTo = 'University';
      problem.assignedUniversity = university._id;
      problem.assignedUniversityName = university.institutionName || university.name;
      problem.assignedDepartment = '';
    } else {
      problem.assignedTo = 'Department';
      problem.assignedDepartment = departmentName || 'Concerned District Nodal Department';
      problem.assignedUniversity = null;
      problem.assignedUniversityName = '';
    }

    problem.status = 'Assigned';
    const targetName = problem.assignedTo === 'University' ? problem.assignedUniversityName : problem.assignedDepartment;
    problem.timeline.push({
      status: 'Assigned',
      message: `Problem formally assigned to ${targetName} for feasibility and implementation. ${remarks || ''}`,
      updatedBy: req.user.name,
      createdAt: new Date(),
    });

    await problem.save();

    return res.json({
      success: true,
      message: `Problem ${problem.problemId} assigned to ${targetName}.`,
      problem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to assign problem.',
      error: error.message,
    });
  }
});

// 5. Update Status (Work in Progress, Resolved, etc.)
router.patch('/problems/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem record not found.' });
    }

    problem.status = status;
    if (remarks) problem.adminRemarks = remarks;

    problem.timeline.push({
      status,
      message: remarks || `Administrative status updated to '${status}'.`,
      updatedBy: req.user.name,
      createdAt: new Date(),
    });

    await problem.save();

    return res.json({
      success: true,
      message: `Problem status updated to '${status}'.`,
      problem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update problem status.',
      error: error.message,
    });
  }
});

// 6. University Management
router.get('/universities', async (req, res) => {
  try {
    const universities = await User.find({ role: 'university' }).select('-password');
    
    // Enrich with count of assigned and solved problems
    const enriched = await Promise.all(
      universities.map(async (u) => {
        const activeCount = await Problem.countDocuments({
          assignedUniversity: u._id,
          status: { $in: ['Assigned', 'Solution Proposed', 'Work in Progress'] },
        });
        const resolvedCount = await Problem.countDocuments({
          assignedUniversity: u._id,
          status: 'Resolved',
        });
        return {
          ...u.toObject(),
          activeAssignedCount: activeCount,
          resolvedCount,
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
      message: 'Failed to retrieve university records.',
      error: error.message,
    });
  }
});

// 7. Update University Account Status (Approve/Disable)
router.patch('/universities/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' | 'disabled'

    const university = await User.findById(id);
    if (!university || university.role !== 'university') {
      return res.status(404).json({ success: false, message: 'University account not found.' });
    }

    university.status = status;
    await university.save();

    return res.json({
      success: true,
      message: `University account status set to '${status}'.`,
      university,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update university account status.',
      error: error.message,
    });
  }
});

// 8. View All University Solutions
router.get('/solutions', async (req, res) => {
  try {
    const solutions = await Solution.find().populate('universityId', 'name email institutionName').sort({ createdAt: -1 });
    return res.json({
      success: true,
      solutions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch solutions.',
      error: error.message,
    });
  }
});

// 9. Admin Review and Status Update for a University Solution (NEW)
router.patch('/solutions/:solutionId/status', async (req, res) => {
  try {
    const { solutionId } = req.params;
    const { status, remarks } = req.body; // status: 'Proposed', 'Under Review', 'Approved', 'Implemented'

    const validStatuses = ['Proposed', 'Under Review', 'Approved', 'Implemented'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status type provided.' });
    }

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ success: false, message: 'Solution record not found.' });
    }

    solution.status = status;
    await solution.save();

    // Find the corresponding problem to update its status and timeline automatically
    const problem = await Problem.findById(solution.problemRef);
    if (problem) {
      if (status === 'Approved') problem.status = 'Work in Progress';
      if (status === 'Implemented') problem.status = 'Resolved';

      problem.timeline.push({
        status: status === 'Implemented' ? 'Resolved' : 'Work in Progress',
        message: remarks || `Administrative update on solution "${solution.title}": Status set to '${status}'.`,
        updatedBy: req.user.name || 'Government Administrator',
        createdAt: new Date(),
      });

      await problem.save();
    }

    return res.status(200).json({
      success: true,
      message: `Solution status successfully updated to '${status}'.`,
      solution,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update solution status.',
      error: error.message,
    });
  }
});

export default router;