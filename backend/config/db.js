import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Problem } from '../models/Problem.js';
import { Solution } from '../models/Solution.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jharkhand_samadhan'
    );
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    await seedInitialData();
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

const seedInitialData = async () => {
  try {
    // 1. Seed Government Administrator
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Shri R. K. Soren (IAS), Joint Secretary',
        email: 'admin@jharkhand.gov.in',
        mobile: '9431100001',
        password: 'Admin@JH2026', 
        role: 'admin',
        institutionName: 'Department of Planning and Citizen Affairs, Govt of Jharkhand',
        district: 'Ranchi',
        status: 'active',
      });
      await adminUser.save();
      console.log('[Seed] Official Government Administrator created: admin@jharkhand.gov.in / Admin@JH2026');
    }

    // 2. Seed Partner Universities WITH Specific Expertise
    const universitiesSeed = [
      {
        name: 'Birla Institute of Technology (BIT) Mesra',
        email: 'bitmesra@jharkhand.edu.in',
        mobile: '9431122000',
        password: 'University@2026',
        role: 'university',
        institutionName: 'BIT Mesra, Ranchi',
        district: 'Ranchi',
        expertise: ['Electricity & Power', 'Smart Infrastructure', 'Information Technology', 'Electronics'],
        status: 'active',
      },
      {
        name: 'Government Engineering College Palamu',
        email: 'gecp@jharkhand.edu.in',
        mobile: '9431122001',
        password: 'University@2026',
        role: 'university',
        institutionName: 'GEC Palamu, Palamu',
        district: 'Palamu',
        expertise: ['Drinking Water', 'Rural Technology', 'Civil & Structural'],
        status: 'active',
      },
      {
        name: 'National Institute of Technology (NIT) Jamshedpur',
        email: 'nitjsr@jharkhand.edu.in',
        mobile: '9431122002',
        password: 'University@2026',
        role: 'university',
        institutionName: 'NIT Jamshedpur',
        district: 'East Singhbhum',
        expertise: ['Sanitation & Waste', 'Mechanical Engineering', 'Manufacturing'],
        status: 'active',
      },
      {
        name: 'IIT (ISM) Dhanbad',
        email: 'iitism@jharkhand.edu.in',
        mobile: '9431122003',
        password: 'University@2026',
        role: 'university',
        institutionName: 'IIT (ISM) Dhanbad',
        district: 'Dhanbad',
        expertise: ['Mining Engineering', 'Civil & Environmental', 'Water Resources', 'Geology'],
        status: 'active',
      },
      {
        name: 'Central University of Jharkhand',
        email: 'cuj@jharkhand.edu.in',
        mobile: '9431122004',
        password: 'University@2026',
        role: 'university',
        institutionName: 'Central University of Jharkhand, Ranchi',
        district: 'Ranchi',
        expertise: ['Healthcare', 'Public Policy', 'Agriculture & Irrigation', 'Environment'],
        status: 'active',
      },
      {
        name: 'Vinoba Bhave University Hazaribagh',
        email: 'vbu@jharkhand.edu.in',
        mobile: '9431122005',
        password: 'University@2026',
        role: 'university',
        institutionName: 'Vinoba Bhave University, Hazaribagh',
        district: 'Hazaribagh',
        expertise: ['Education', 'Social Welfare', 'Basic Sciences', 'Healthcare'],
        status: 'active',
      },
    ];

    for (const uni of universitiesSeed) {
      const exists = await User.findOne({ email: uni.email });
      if (!exists) {
        const u = new User(uni);
        await u.save();
        console.log(`[Seed] University seeded with expertise: ${uni.name}`);
      }
    }

    // 3. Seed Realistic Community Problems & Auto-Match based on Expertise
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      const problems = [
        {
          problemId: 'JH-2026-000001',
          title: 'Drinking water shortage and borewell salinity in rural village',
          description: 'Severe ground water depletion and seasonal borewell failure affecting over 350 rural families in Chhatarpur block.',
          category: 'Drinking Water',
          district: 'Palamu',
          block: 'Chhatarpur',
          village: 'Murumdag Panchayat',
          location: 'Village Ward 4 near Primary School',
          citizenName: 'Rameshwar Mahato',
          citizenMobile: '9835012345',
          status: 'Under Review',
        },
        {
          problemId: 'JH-2026-000002',
          title: 'Solar street lighting required near rural bypass road',
          description: 'A 2.5 kilometer unlit rural stretch connecting Kanke road with ring road has witnessed multiple night accidents.',
          category: 'Electricity & Power',
          district: 'Ranchi',
          block: 'Kanke',
          village: 'Sukhurhutu',
          location: 'Kanke-Ring Road Bypass Junction',
          citizenName: 'Sunita Devi',
          citizenMobile: '9835098765',
          status: 'Solution Proposed',
        },
        {
          problemId: 'JH-2026-000003',
          title: 'Severe drainage overflow and siltation during monsoon',
          description: 'Heavy municipal drainage siltation causing blackwater flooding across 80 homes.',
          category: 'Sanitation & Waste',
          district: 'Dhanbad',
          block: 'Jharia',
          village: 'Bastacola',
          location: 'Behind Bastacola Colliery Market',
          citizenName: 'Deepak Kumar Verma',
          citizenMobile: '9431187654',
          status: 'Work in Progress',
        },
      ];

      for (const p of problems) {
        // Smart matching: find a university whose expertise array includes this problem's category
        const matchingUni = await User.findOne({
          role: 'university',
          expertise: { $in: [p.category] }
        });

        if (matchingUni) {
          p.assignedTo = 'University';
          p.assignedUniversity = matchingUni._id;
          p.assignedUniversityName = matchingUni.name;
          p.timeline = [
            {
              status: 'Assigned',
              message: `Automatically routed to ${matchingUni.name} based on institutional core expertise in ${p.category}.`,
              updatedBy: 'Smart Assignment Engine',
              createdAt: new Date(),
            }
          ];
        } else {
          p.assignedTo = 'None';
        }

        const problemDoc = new Problem(p);
        await problemDoc.save();
      }
      console.log(`[Seed] Seeded and dynamically mapped problems to universities based on expertise.`);

      // Seed sample Solution by BIT Mesra for problem JH-2026-000002
      const solarProblem = await Problem.findOne({ problemId: 'JH-2026-000002' });
      const bitMesra = await User.findOne({ email: 'bitmesra@jharkhand.edu.in' });
      
      if (solarProblem && bitMesra) {
        const sol = new Solution({
          problemId: 'JH-2026-000002',
          problemRef: solarProblem._id,
          universityId: bitMesra._id,
          submittedBy: 'Dr. Sudip Das, Dept of Electrical Engineering',
          institutionName: 'BIT Mesra, Ranchi',
          title: 'Autonomous Solar Street Lighting Network with GSM Telemetry',
          description: 'Design of 45 high-efficiency 40W LED luminaires powered by individual solar panels.',
          status: 'Under Review',
        });
        await sol.save();
        console.log('[Seed] Sample technical solution seeded for JH-2026-000002 by BIT Mesra.');
      }
    }
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
  }
};