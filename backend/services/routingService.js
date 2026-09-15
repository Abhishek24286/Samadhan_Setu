import { User } from '../models/User.js';
import { Problem } from '../models/Problem.js';

export const routeProblemToUniversities = async (problemId, category, aiTags) => {
  try {
    // 1. First try to find a specialized university matching the category or specific AI tags
    let primaryUniversity = await User.findOne({
      role: 'university',
      status: 'active',
      $or: [
        { expertiseTags: { $in: [category] } },
        { expertiseTags: { $in: aiTags } }
      ]
    });

    // 2. Fallback: If no specialist match is found, look for general universities (empty tags)
    if (!primaryUniversity) {
      primaryUniversity = await User.findOne({
        role: 'university',
        status: 'active',
        expertiseTags: { $size: 0 }
      });
    }

    if (!primaryUniversity) {
      console.log(`No available active universities found for category: ${category}`);
      return { success: false, routedCount: 0 };
    }

    // 3. Update the problem record with specific university assignment details
    await Problem.findOneAndUpdate(
      { problemId },
      {
        $set: { 
          assignedTo: 'University',
          assignedUniversity: primaryUniversity._id,
          assignedUniversityName: primaryUniversity.institutionName || primaryUniversity.name,
          status: 'Under Review'
        },
        $push: {
          timeline: {
            status: 'Forwarded to University',
            message: `AI categorized problem under '${category}' and routed to specialized institution: ${primaryUniversity.institutionName || primaryUniversity.name}.`,
            updatedBy: 'SamadhanSetu AI Engine',
            createdAt: new Date()
          }
        }
      }
    );

    console.log(`Successfully routed problem ${problemId} to university: ${primaryUniversity.name}`);
    return { success: true, routedCount: 1 };
  } catch (error) {
    console.error('Error in routeProblemToUniversities:', error);
    return { success: false, error: error.message };
  }
};