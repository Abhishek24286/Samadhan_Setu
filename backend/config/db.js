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
        password: 'Admin@JH2026', // Will be hashed by pre('save')
        role: 'admin',
        institutionName: 'Department of Planning and Citizen Affairs, Govt of Jharkhand',
        district: 'Ranchi',
        status: 'active',
      });
      await adminUser.save();
      console.log('[Seed] Official Government Administrator created: admin@jharkhand.gov.in / Admin@JH2026');
    }

    // 2. Seed Partner Universities
    const universitiesSeed = [
      {
        name: 'Govenment Engineering College Palamu',
        email: 'gecp@jharkhand.edu.in',
        mobile: '9431122001',
        password: 'University@2026',
        role: 'university',
        institutionName: 'GEC Palamu, Palamu',
        district: 'Palamu',
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
        status: 'active',
      },
    ];

  universitiesSeed.forEach(async (uni) => {
  const exists = await User.findOne({ email: uni.email });
  if (!exists) {
    const u = new User(uni);
    await u.save();
    console.log(`[Seed] University account seeded: ${uni.name} (${uni.email})`);
  }
});

    // 3. Seed Realistic Community Problems across Jharkhand
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      const bitMesra = await User.findOne({ email: 'bitmesra@jharkhand.edu.in' });
      const nitJsr = await User.findOne({ email: 'nitjsr@jharkhand.edu.in' });
      const iitDhanbad = await User.findOne({ email: 'iitism@jharkhand.edu.in' });

      const problems = [
        {
          problemId: 'JH-2026-000001',
          title: 'Drinking water shortage and borewell salinity in rural village',
          description: 'Severe ground water depletion and seasonal borewell failure affecting over 350 rural families in Chhatarpur block. Villagers travel over 4 km daily for potable drinking water.',
          category: 'Drinking Water',
          district: 'Palamu',
          block: 'Chhatarpur',
          village: 'Murumdag Panchayat',
          location: 'Village Ward 4 near Primary School',
          citizenName: 'Rameshwar Mahato',
          citizenMobile: '9835012345',
          citizenEmail: 'rameshwar.palamu@gmail.com',
          status: 'Under Review',
          assignedTo: 'None',
          timeline: [
            {
              status: 'Submitted',
              message: 'Community problem reported by citizen through public portal.',
              updatedBy: 'Citizen',
              createdAt: new Date('2026-09-01T10:00:00Z'),
            },
            {
              status: 'Under Review',
              message: 'Assigned to Block Development Officer and District Water Resources Cell for physical feasibility check.',
              updatedBy: 'District Administrator, Palamu',
              createdAt: new Date('2026-09-02T14:30:00Z'),
            },
          ],
        },
        {
          problemId: 'JH-2026-000002',
          title: 'Solar street lighting required near rural bypass road',
          description: 'A 2.5 kilometer unlit rural stretch connecting Kanke road with ring road has witnessed multiple night accidents and safety hazards for women farmers commuting from evening markets.',
          category: 'Electricity & Power',
          district: 'Ranchi',
          block: 'Kanke',
          village: 'Sukhurhutu',
          location: 'Kanke-Ring Road Bypass Junction',
          citizenName: 'Sunita Devi',
          citizenMobile: '9835098765',
          citizenEmail: 'sunita.kanke@gmail.com',
          status: 'Solution Proposed',
          assignedTo: 'University',
          assignedUniversity: bitMesra?._id,
          assignedUniversityName: 'BIT Mesra, Ranchi',
          timeline: [
            {
              status: 'Submitted',
              message: 'Problem logged by Sukhurhutu Women Self-Help Group representative.',
              updatedBy: 'Citizen',
              createdAt: new Date('2026-09-03T09:15:00Z'),
            },
            {
              status: 'Approved',
              message: 'Verified by District Administration Ranchi as high-priority road safety concern.',
              updatedBy: 'District Collectorate, Ranchi',
              createdAt: new Date('2026-09-04T11:00:00Z'),
            },
            {
              status: 'Assigned',
              message: 'Assigned to BIT Mesra Dept of Electrical & Electronics for low-cost smart solar lighting blueprint.',
              updatedBy: 'Government Administrator',
              createdAt: new Date('2026-09-05T15:20:00Z'),
            },
            {
              status: 'Solution Proposed',
              message: 'BIT Mesra faculty submitted an automated dusk-to-dawn LiFePO4 battery solar street lamp proposal with GSM fault reporting.',
              updatedBy: 'BIT Mesra, Ranchi',
              createdAt: new Date('2026-09-08T16:00:00Z'),
            },
          ],
        },
        {
          problemId: 'JH-2026-000003',
          title: 'Severe drainage overflow and siltation during monsoon',
          description: 'Heavy municipal drainage siltation causing blackwater flooding across 80 homes and a government high school during monsoon rainfalls.',
          category: 'Sanitation & Waste',
          district: 'Dhanbad',
          block: 'Jharia',
          village: 'Bastacola',
          location: 'Behind Bastacola Colliery Market',
          citizenName: 'Deepak Kumar Verma',
          citizenMobile: '9431187654',
          citizenEmail: 'deepak.dhanbad@gmail.com',
          status: 'Work in Progress',
          assignedTo: 'University',
          assignedUniversity: iitDhanbad?._id,
          assignedUniversityName: 'IIT (ISM) Dhanbad',
          timeline: [
            {
              status: 'Submitted',
              message: 'Civic complaint registered by local market committee.',
              updatedBy: 'Citizen',
              createdAt: new Date('2026-08-25T11:00:00Z'),
            },
            {
              status: 'Approved',
              message: 'Verified by Dhanbad Municipal Corporation.',
              updatedBy: 'Dhanbad Municipal Corporation',
              createdAt: new Date('2026-08-27T10:30:00Z'),
            },
            {
              status: 'Assigned',
              message: 'Assigned to IIT (ISM) Dhanbad Dept of Civil & Environmental Engineering.',
              updatedBy: 'Government Administrator',
              createdAt: new Date('2026-08-28T14:00:00Z'),
            },
            {
              status: 'Work in Progress',
              message: 'Civil engineering survey completed; silt trap installation and gradient restructuring underway by civic works contractors.',
              updatedBy: 'Executive Engineer, Dhanbad',
              createdAt: new Date('2026-09-06T12:00:00Z'),
            },
          ],
        },
        {
          problemId: 'JH-2026-000004',
          title: 'Waste management and unauthorized dumping in municipal zone',
          description: 'Open municipal dumping adjacent to residential ward causing groundwater leach risk and stray animal hazards near Sakchi fringe.',
          category: 'Sanitation & Waste',
          district: 'East Singhbhum',
          block: 'Jamshedpur',
          village: 'Sakchi Ward 12',
          location: 'Near Old Subarnarekha River Bridge',
          citizenName: 'Anita Hembrom',
          citizenMobile: '9431144321',
          citizenEmail: 'anita.jsr@gmail.com',
          status: 'Resolved',
          assignedTo: 'Department',
          assignedDepartment: 'Jamshedpur Notified Area Committee (JNAC)',
          adminRemarks: 'Segregated waste collection vehicles deployed; daily morning collection roster established and community bio-compost pit constructed.',
          timeline: [
            {
              status: 'Submitted',
              message: 'Problem logged by resident welfare association.',
              updatedBy: 'Citizen',
              createdAt: new Date('2026-08-10T08:30:00Z'),
            },
            {
              status: 'Approved',
              message: 'Inspected and verified by Sanitary Inspector, JNAC.',
              updatedBy: 'District Administration',
              createdAt: new Date('2026-08-12T09:00:00Z'),
            },
            {
              status: 'Assigned',
              message: 'Assigned to Jamshedpur Notified Area Committee for immediate clearance.',
              updatedBy: 'Government Administrator',
              createdAt: new Date('2026-08-13T10:00:00Z'),
            },
            {
              status: 'Work in Progress',
              message: 'Site cleaned, fencing erected, and biometric attendance waste collection van scheduled.',
              updatedBy: 'JNAC Sanitary Officer',
              createdAt: new Date('2026-08-18T16:00:00Z'),
            },
            {
              status: 'Resolved',
              message: 'Public issue verified as completely resolved with citizen sign-off and photographic confirmation.',
              updatedBy: 'Joint Secretary, Govt of Jharkhand',
              createdAt: new Date('2026-08-25T17:00:00Z'),
            },
          ],
        },
        {
          problemId: 'JH-2026-000005',
          title: 'Primary Health Center power failure during infant deliveries',
          description: 'Frequent grid power outages at Chauparan rural health center disrupting newborn phototherapy units and vaccine refrigeration cold-chain.',
          category: 'Healthcare',
          district: 'Hazaribagh',
          block: 'Chauparan',
          village: 'Chauparan Main',
          location: 'Community Health Centre Campus',
          citizenName: 'Dr. Alok Verma',
          citizenMobile: '9431199887',
          citizenEmail: 'dr.alok.chauparan@gmail.com',
          status: 'Approved',
          assignedTo: 'None',
          adminRemarks: 'Verified by District Chief Medical Officer. Recommended for solar hybrid micro-grid allocation to engineering college.',
          timeline: [
            {
              status: 'Submitted',
              message: 'Logged by Medical Officer in-charge Chauparan CHC.',
              updatedBy: 'Citizen',
              createdAt: new Date('2026-09-07T11:45:00Z'),
            },
            {
              status: 'Approved',
              message: 'Approved for urgent institutional assignment by Health Department Govt of Jharkhand.',
              updatedBy: 'Government Administrator',
              createdAt: new Date('2026-09-09T14:15:00Z'),
            },
          ],
        },
        {
          problemId: 'JH-2026-000006',
          title: 'Canal siltation and lack of micro-irrigation for paddy farmers',
          description: 'Over 120 hectares of paddy cultivation drying up due to blocked branch canal sluice gate from Tenughat reservoir feeder.',
          category: 'Agriculture & Irrigation',
          district: 'Bokaro',
          block: 'Petarwar',
          village: 'Garga Basin',
          location: 'Branch Canal Kilometer 14',
          citizenName: 'Ganesh Mahto',
          citizenMobile: '9431133445',
          status: 'Assigned',
          assignedTo: 'Department',
          assignedDepartment: 'Water Resources Department, Bokaro Division',
          timeline: [
            {
              status: 'Submitted',
              message: 'Problem submitted by Petarwar Krishak Samiti.',
              updatedBy: 'Citizen',
              createdAt: new Date('2026-09-05T10:00:00Z'),
            },
            {
              status: 'Approved',
              message: 'Agricultural distress verified by Block Agriculture Officer.',
              updatedBy: 'Government Administrator',
              createdAt: new Date('2026-09-07T11:00:00Z'),
            },
            {
              status: 'Assigned',
              message: 'Assigned to Executive Engineer, Water Resources Department, Tenughat Division.',
              updatedBy: 'Government Administrator',
              createdAt: new Date('2026-09-08T15:30:00Z'),
            },
          ],
        },
        {
          problemId: 'JH-2026-000007',
          title: 'Request for private commercial gym subsidy',
          description: 'Requesting funding to purchase high-end treadmills and weight machines for a private fitness club.',
          category: 'Other',
          district: 'Ranchi',
          block: 'Sadar',
          village: 'Lalpur',
          location: 'Circular Road',
          citizenName: 'Vikram Singh',
          citizenMobile: '9431166778',
          status: 'Rejected',
          rejectionReason: 'Commercial private enterprise request. SamadhanSetu exclusively addresses public civic, rural, and community problems.',
          timeline: [
            {
              status: 'Submitted',
              message: 'Application registered.',
              updatedBy: 'Citizen',
              createdAt: new Date('2026-08-30T10:00:00Z'),
            },
            {
              status: 'Rejected',
              message: 'Rejected during administrative scrutiny as non-civic commercial request.',
              updatedBy: 'Government Administrator',
              createdAt: new Date('2026-08-31T12:00:00Z'),
            },
          ],
        },
      ];

      for (const p of problems) {
        const problemDoc = new Problem(p);
        await problemDoc.save();
      }
      console.log(`[Seed] Seeded ${problems.length} community problems across Jharkhand.`);

      // Also seed sample Solution submitted by BIT Mesra for Problem JH-2026-000002
      const solarProblem = await Problem.findOne({ problemId: 'JH-2026-000002' });
      if (solarProblem && bitMesra) {
        const sol = new Solution({
          problemId: 'JH-2026-000002',
          problemRef: solarProblem._id,
          universityId: bitMesra._id,
          submittedBy: 'Dr. Sudip Das, Dept of Electrical Engineering',
          institutionName: 'BIT Mesra, Ranchi',
          title: 'Autonomous Solar Street Lighting Network with GSM Telemetry',
          description: 'Design of 45 high-efficiency 40W LED luminaires powered by individual 120W monocrystalline solar panels with integrated LiFePO4 battery enclosures.',
          technicalDetails: 'Features motion-triggered 50% dimming between 12:00 AM and 4:30 AM to conserve storage. Integrated with GSM SIM900 module to trigger battery health alarms directly to Kanke block junior engineer.',
          estimatedResources: 'Estimated material cost ₹4,80,000 for entire 2.5 km stretch; student fabrication period 3 weeks in BIT campus lab.',
          documents: 'https://jharkhand.gov.in/docs/bit_mesra_solar_blueprint_v1.pdf',
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
