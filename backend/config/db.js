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
        expertise: ['Drinking Water', 'Rural Technology', 'Civil & Structural', 'Roads & Transport', 'Sanitation & Waste', 'Education'],
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
      {
        name: 'Nilamber-Pitamber University, Palamu',
        email: 'npu@jharkhand.edu.in',
        mobile: '9431122006',
        password: 'University@2026',
        role: 'university',
        institutionName: 'NPU Medininagar',
        district: 'Palamu',
        expertise: ['Drinking Water', 'Roads & Transport', 'Electricity & Power', 'Sanitation & Waste', 'Education', 'Agriculture & Irrigation'],
        status: 'active',
      },
      {
        name: 'Ranchi University',
        email: 'ranchiuni@jharkhand.edu.in',
        mobile: '9431122007',
        password: 'University@2026',
        role: 'university',
        institutionName: 'Ranchi University',
        district: 'Ranchi',
        expertise: ['Sanitation & Waste', 'Electricity & Power', 'Public Safety'],
        status: 'active',
      },
      {
        name: 'Patna University',
        email: 'patnauni@bihar.edu.in',
        mobile: '9431122008',
        password: 'University@2026',
        role: 'university',
        institutionName: 'Patna University',
        district: 'Patna',
        expertise: ['Drinking Water', 'Healthcare', 'Agriculture & Irrigation'],
        status: 'active',
      }
    ];

    for (const uni of universitiesSeed) {
      const exists = await User.findOne({ email: uni.email });
      if (!exists) {
        const u = new User(uni);
        await u.save();
        console.log(`[Seed] University seeded: ${uni.name}`);
      }
    }

    // 3. Seed Realistic Community Problems (5 for Palamu, 5 for Other Universities)
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      const problems = [
        // ==================== PALAMU PROBLEMS (5 Items) ====================
        {
          problemId: 'JH-2026-PLM-01',
          title: 'Severe Drinking Water Shortage in Ward 4 Chianki',
          description: 'The primary tube well has been non-functional for over two weeks, leaving more than 200 households without safe drinking water.',
          category: 'Drinking Water',
          aiMetadata: {
            severity: 'High',
            tags: ['water-crisis', 'tube-well', 'urgent'],
            summary: 'Tube well failure affecting 200+ households in Ward 4, Palamu.',
            confidenceScore: 0.92,
          },
          district: 'Palamu',
          block: 'Daltonganj',
          village: 'Chianki Village',
          location: 'Near Panchayat Bhawan, Main Road',
          citizenName: 'Rajesh Kumar',
          citizenMobile: '9876543210',
          citizenEmail: 'rajesh.kumar@example.com',
          status: 'Assigned',
          imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTI4ZjhmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyI+UGFsYW11IFdhdGVyIEV2aWRlbmNlPC90ZXh0Pjwvc3ZnPg==',
        },
        {
          problemId: 'JH-2026-PLM-02',
          title: 'Damaged Road Infrastructure near College Gate',
          description: 'Large potholes have formed due to recent heavy rains, causing major safety risks for students and daily commuters.',
          category: 'Roads & Transport',
          aiMetadata: {
            severity: 'Medium',
            tags: ['potholes', 'road-safety', 'infrastructure'],
            summary: 'Dangerous potholes near college gate requiring immediate repair.',
            confidenceScore: 0.88,
          },
          district: 'Palamu',
          block: 'Medininagar',
          village: 'Satbarwa Area',
          location: 'University Campus Gate No. 2',
          citizenName: 'Priya Singh',
          citizenMobile: '9123456789',
          citizenEmail: 'priya.singh@example.com',
          status: 'Work in Progress',
          imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYmVmNmQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyI+UGFsYW11IFJvYWQgRXZpZGVuY2U8L3RleHQ+PC9zdmc+',
        },
        {
          problemId: 'JH-2026-PLM-03',
          title: 'Frequent Power Outages affecting Study Hours',
          description: 'Transformer failure has caused continuous power outages for the last 4 days, disrupting student academics and local shops.',
          category: 'Electricity & Power',
          aiMetadata: {
            severity: 'High',
            tags: ['power-cut', 'transformer', 'electricity'],
            summary: 'Transformer breakdown causing prolonged outages in student locality.',
            confidenceScore: 0.95,
          },
          district: 'Palamu',
          block: 'Patan',
          village: 'Patan Village',
          location: 'Market Ward 2',
          citizenName: 'Amit Oraon',
          citizenMobile: '9988776655',
          citizenEmail: '',
          status: 'Under Review',
          imageUrl: '',
        },
        {
          problemId: 'JH-2026-PLM-04',
          title: 'Garbage Accumulation near Community Center',
          description: 'Uncollected waste is piling up, creating a breeding ground for mosquitoes and unhygienic community conditions.',
          category: 'Sanitation & Waste',
          aiMetadata: {
            severity: 'Medium',
            tags: ['garbage', 'sanitation', 'health-hazard'],
            summary: 'Uncollected waste accumulation near the main community center.',
            confidenceScore: 0.85,
          },
          district: 'Palamu',
          block: 'Hussainabad',
          village: 'Hussainabad Rural',
          location: 'Near Old Community Hall',
          citizenName: 'Sunita Devi',
          citizenMobile: '9811223344',
          citizenEmail: 'sunita.devi@example.com',
          status: 'Solution Proposed',
          imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNkOWJiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyI+UGFsYW11IFdhc3RlIEV2aWRlbmNlPC90ZXh0Pjwvc3ZnPg==',
        },
        {
          problemId: 'JH-2026-PLM-05',
          title: 'Lack of Library Books in Rural Study Center',
          description: 'The local reading room lacks basic educational textbooks and study furniture for competitive exam aspirants.',
          category: 'Education',
          aiMetadata: {
            severity: 'Low',
            tags: ['education', 'library', 'books'],
            summary: 'Shortage of study materials in rural reading room.',
            confidenceScore: 0.80,
          },
          district: 'Palamu',
          block: 'Hariharganj',
          village: 'Kalyanpur',
          location: 'Gram Panchayat Library Building',
          citizenName: 'Manoj Kumar',
          citizenMobile: '9700112233',
          citizenEmail: 'manoj@example.com',
          status: 'Approved',
          imageUrl: '',
        },

        // ==================== OTHER UNIVERSITY PROBLEMS (5 Items) ====================
        {
          problemId: 'JH-2026-OTH-01',
          title: 'Blocked Drainage System causing Waterlogging in Kanke',
          description: 'Pre-monsoon blockage in secondary drainage pipes has led to wastewater spilling onto residential pathways.',
          category: 'Sanitation & Waste',
          aiMetadata: {
            severity: 'High',
            tags: ['drainage', 'waterlogging', 'sanitation'],
            summary: 'Blocked drainage causing wastewater overflow in residential lanes.',
            confidenceScore: 0.90,
          },
          district: 'Ranchi',
          block: 'Kanke',
          village: 'Pithoria',
          location: 'Near Central Market Square',
          citizenName: 'Sanjay Munda',
          citizenMobile: '9431122334',
          citizenEmail: 'sanjay.munda@example.com',
          status: 'Work in Progress',
          imageUrl: '',
        },
        {
          problemId: 'JH-2026-OTH-02',
          title: 'Damaged Solar Street Lights in Residential Alley',
          description: 'Solar panels have been damaged and lights are non-functional, creating safety issues at night.',
          category: 'Electricity & Power',
          aiMetadata: {
            severity: 'Medium',
            tags: ['solar-light', 'public-safety', 'electricity'],
            summary: 'Non-functional solar street lights posing safety concerns.',
            confidenceScore: 0.86,
          },
          district: 'Ranchi',
          block: 'Namkum',
          village: 'Tatisilwai',
          location: 'Lane 3, Housing Colony',
          citizenName: 'Anjali Sharma',
          citizenMobile: '9300445566',
          citizenEmail: 'anjali@example.com',
          status: 'Assigned',
          imageUrl: '',
        },
        {
          problemId: 'JH-2026-OTH-03',
          title: 'Contaminated Handpump Water Source in Phulwari',
          description: 'Water coming out of the community handpump has a foul smell and brownish tint, rendering it unfit for consumption.',
          category: 'Drinking Water',
          aiMetadata: {
            severity: 'Critical',
            tags: ['contaminated-water', 'health-hazard', 'handpump'],
            summary: 'Foul-smelling contaminated water from community handpump.',
            confidenceScore: 0.96,
          },
          district: 'Patna',
          block: 'Phulwari Sharif',
          village: 'Islampur',
          location: 'Near Government Primary School',
          citizenName: 'Mohammad Tariq',
          citizenMobile: '9835112233',
          citizenEmail: 'tariq@example.com',
          status: 'Resolved',
          imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjRiOGI4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyI+UGF0bmEgV2F0ZXIgRXZpZGVuY2U8L3RleHQ+PC9zdmc+',
        },
        {
          problemId: 'JH-2026-OTH-04',
          title: 'Lack of Public Health Awareness Camp',
          description: 'Rising seasonal viral fevers in the village require urgent medical intervention and public awareness camps.',
          category: 'Healthcare',
          aiMetadata: {
            severity: 'Medium',
            tags: ['health', 'awareness-camp', 'medical'],
            summary: 'Request for health checkup camp due to seasonal fevers.',
            confidenceScore: 0.82,
          },
          district: 'Patna',
          block: 'Danapur',
          village: 'Khagaul Rural',
          location: 'Community Panchayat Hall',
          citizenName: 'Dr. Rakesh Verma',
          citizenMobile: '9900223344',
          citizenEmail: 'rakesh.verma@example.com',
          status: 'Solution Proposed',
          imageUrl: '',
        },
        {
          problemId: 'JH-2026-OTH-05',
          title: 'Clogged Agricultural Canal Branch',
          description: 'Silt and plastic waste have clogged the local irrigation canal branch, preventing water supply to agricultural fields.',
          category: 'Agriculture & Irrigation',
          aiMetadata: {
            severity: 'High',
            tags: ['irrigation', 'agriculture', 'canal'],
            summary: 'Clogged canal branch blocking irrigation water flow to farms.',
            confidenceScore: 0.89,
          },
          district: 'Patna',
          block: 'Bikram',
          village: 'Bihta Outskirts',
          location: 'Canal Marker 14',
          citizenName: 'Birendra Yadav',
          citizenMobile: '9470123456',
          citizenEmail: '',
          status: 'Assigned',
          imageUrl: '',
        }
      ];

      for (const p of problems) {
        // Smart matching based on district or category expertise
        let matchingUni = await User.findOne({
          role: 'university',
          district: p.district,
          expertise: { $in: [p.category] }
        });

        // Fallback to match by expertise alone if district match isn't found
        if (!matchingUni) {
          matchingUni = await User.findOne({
            role: 'university',
            expertise: { $in: [p.category] }
          });
        }

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
      console.log(`[Seed] Seeded 10 dummy problems (5 Palamu + 5 Other Districts) with auto-matching.`);

      // Seed sample Solution by Nilamber-Pitamber University for Palamu Problem 1
      const palamuProblem = await Problem.findOne({ problemId: 'JH-2026-PLM-01' });
      const npuUniversity = await User.findOne({ email: 'npu@jharkhand.edu.in' });
      
      if (palamuProblem && npuUniversity) {
        const sol = new Solution({
          problemId: 'JH-2026-PLM-01',
          problemRef: palamuProblem._id,
          universityId: npuUniversity._id,
          submittedBy: 'Prof. Arvind Kumar, Dept of Civil Engineering',
          institutionName: 'Nilamber-Pitamber University, Palamu',
          title: 'Solar-Powered Community Submersible Pump Retrofit',
          description: 'Deployment of a 3HP solar submersible pump alongside cleaning and deepening of the borewell shaft.',
          status: 'Under Review',
        });
        await sol.save();
        console.log('[Seed] Sample technical solution seeded for JH-2026-PLM-01 by Nilamber-Pitamber University.');
      }
    }
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
  }
};