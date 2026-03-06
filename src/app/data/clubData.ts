export interface ClubMember {
  id: string;
  name: string;
  photo: string;
  designation: string;
  areaOfInterest: string;
  email?: string;
  year?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  eventTag: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  teamMembers: string[];
  progressStage: 'Design' | 'Fabrication' | 'Testing' | 'Completed';
  images: string[];
  date: string;
  postedBy: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  logo: string;
  facultyCoordinator: string;
  memberCount: number;
  establishedYear: string;
}

// Mock Club Members Data
export const mockClubMembers: ClubMember[] = [
  {
    id: '1',
    name: 'Raj Sharma',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    designation: 'President',
    areaOfInterest: 'UAV Design',
    email: 'raj.sharma@example.com',
    year: 'Final Year',
  },
  {
    id: '2',
    name: 'Priya Patel',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    designation: 'Vice President',
    areaOfInterest: 'Aerodynamics',
    email: 'priya.patel@example.com',
    year: 'Third Year',
  },
  {
    id: '3',
    name: 'Arjun Mehta',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    designation: 'Technical Lead',
    areaOfInterest: 'Propulsion Systems',
    email: 'arjun.mehta@example.com',
    year: 'Final Year',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    designation: 'Research Coordinator',
    areaOfInterest: 'Aircraft Structures',
    email: 'sneha.reddy@example.com',
    year: 'Third Year',
  },
  {
    id: '5',
    name: 'Karan Singh',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    designation: 'Core Member',
    areaOfInterest: 'CFD Analysis',
    email: 'karan.singh@example.com',
    year: 'Second Year',
  },
  {
    id: '6',
    name: 'Ananya Desai',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    designation: 'Core Member',
    areaOfInterest: 'Flight Dynamics',
    email: 'ananya.desai@example.com',
    year: 'Second Year',
  },
  {
    id: '7',
    name: 'Vikram Joshi',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    designation: 'Core Member',
    areaOfInterest: 'Drone Technology',
    email: 'vikram.joshi@example.com',
    year: 'Third Year',
  },
  {
    id: '8',
    name: 'Divya Kumar',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    designation: 'Core Member',
    areaOfInterest: 'Avionics',
    email: 'divya.kumar@example.com',
    year: 'Second Year',
  },
];

// Mock Gallery Images
export const mockGalleryImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/48.png',
    caption: 'Annual Aero Fest 2025',
    eventTag: 'Fest',
    uploadedBy: 'Raj Sharma',
    uploadedAt: '2025-12-15',
    status: 'approved',
  },
  {
    id: '2',
    url: 'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/45.png',
    caption: 'Drone Workshop Session',
    eventTag: 'Workshop',
    uploadedBy: 'Priya Patel',
    uploadedAt: '2025-11-20',
    status: 'approved',
  },
  {
    id: '3',
    url: 'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/56.png',
    caption: 'Team Building Activity',
    eventTag: 'Event',
    uploadedBy: 'Arjun Mehta',
    uploadedAt: '2025-10-05',
    status: 'approved',
  },
  {
    id: '4',
    url: 'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/38.png',
    caption: 'Guest Lecture by Industry Expert',
    eventTag: 'Lecture',
    uploadedBy: 'Sneha Reddy',
    uploadedAt: '2025-09-18',
    status: 'approved',
  },
  {
    id: '5',
    url: 'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/39.png',
    caption: 'Lab Session - Wind Tunnel Testing',
    eventTag: 'Lab',
    uploadedBy: 'Karan Singh',
    uploadedAt: '2025-08-22',
    status: 'approved',
  },
  {
    id: '6',
    url: 'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/36.jpeg',
    caption: 'Inter-College Competition',
    eventTag: 'Competition',
    uploadedBy: 'Ananya Desai',
    uploadedAt: '2025-07-10',
    status: 'approved',
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    caption: 'Aircraft Design Project',
    eventTag: 'Project',
    uploadedBy: 'Vikram Joshi',
    uploadedAt: '2026-01-15',
    status: 'approved',
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    caption: 'Quadcopter Assembly Workshop',
    eventTag: 'Workshop',
    uploadedBy: 'Divya Kumar',
    uploadedAt: '2026-02-20',
    status: 'approved',
  },
];

// Mock Project Updates
export const mockProjectUpdates: ProjectUpdate[] = [
  {
    id: '1',
    title: 'Fixed Wing UAV Design',
    description: 'Completed the aerodynamic analysis and wing design for our fixed-wing UAV. The prototype is ready for wind tunnel testing next week.',
    teamMembers: ['Raj Sharma', 'Arjun Mehta', 'Karan Singh'],
    progressStage: 'Testing',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    ],
    date: '2026-03-01',
    postedBy: 'Raj Sharma',
  },
  {
    id: '2',
    title: 'Hybrid Rocket Motor Development',
    description: 'Successfully completed the fabrication of the combustion chamber. Currently working on the nozzle design and oxidizer feed system.',
    teamMembers: ['Priya Patel', 'Sneha Reddy', 'Vikram Joshi'],
    progressStage: 'Fabrication',
    images: [
      'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800&q=80',
    ],
    date: '2026-02-25',
    postedBy: 'Priya Patel',
  },
  {
    id: '3',
    title: 'Autonomous Delivery Drone',
    description: 'Completed the GPS navigation system integration. The drone can now follow waypoints autonomously. Working on obstacle detection using LIDAR.',
    teamMembers: ['Arjun Mehta', 'Divya Kumar', 'Ananya Desai'],
    progressStage: 'Testing',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
    ],
    date: '2026-02-15',
    postedBy: 'Arjun Mehta',
  },
  {
    id: '4',
    title: 'RC Aircraft Competition Entry',
    description: 'Initial design phase completed. Working on structural analysis using ANSYS. Target to complete fabrication by next month.',
    teamMembers: ['Sneha Reddy', 'Karan Singh'],
    progressStage: 'Design',
    images: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    ],
    date: '2026-01-30',
    postedBy: 'Sneha Reddy',
  },
  {
    id: '5',
    title: 'Airfoil Optimization Study',
    description: 'Research project on optimizing airfoil shapes for low Reynolds number applications. CFD simulations completed, preparing research paper.',
    teamMembers: ['Karan Singh', 'Ananya Desai'],
    progressStage: 'Completed',
    images: [
      'https://images.unsplash.com/photo-1581092918484-8313e1f7e8d6?w=800&q=80',
    ],
    date: '2026-01-10',
    postedBy: 'Karan Singh',
  },
];

// Mock Clubs Data
export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Aero Club',
    description: 'The Aero Club is dedicated to promoting aviation and aerospace knowledge through practical projects, workshops, and competitions.',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
    facultyCoordinator: 'Dr. Amit Kumar',
    memberCount: 25,
    establishedYear: '2015',
  },
  {
    id: '2',
    name: 'Drone Technology Club',
    description: 'Focused on unmanned aerial vehicle design, development, and applications in various sectors.',
    logo: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&q=80',
    facultyCoordinator: 'Prof. Sneha Verma',
    memberCount: 18,
    establishedYear: '2018',
  },
  {
    id: '3',
    name: 'Space Research Club',
    description: 'Dedicated to research in space technology, satellite systems, and rocketry.',
    logo: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&q=80',
    facultyCoordinator: 'Dr. Rajesh Nair',
    memberCount: 15,
    establishedYear: '2019',
  },
];
