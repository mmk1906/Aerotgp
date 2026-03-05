export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  isPaid: boolean;
  price?: number;
  maxParticipants: number;
  registrationDeadline: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registeredCount: number;
  image: string;
}

export interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  eventId: string;
  timestamp: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'not_required' | 'pending' | 'paid';
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  photo: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Cadthon',
    description: 'Cad Design Competion',
    date: '2026-03-16',
    venue: 'Cad Lab',
    isPaid: true,
    price: 499,
    maxParticipants: 50,
    registrationDeadline: '2026-03-16',
    status: 'upcoming',
    registeredCount: 32,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
  },
  {
    id: '2',
    title: 'Aero Modelling',
    description: 'RC Plane and Drone Flying Competition',
    date: '2026-04-17',
    venue: 'Campus Ground',
    isPaid: false,
    maxParticipants: 200,
    registrationDeadline: '2026-04-05',
    status: 'upcoming',
    registeredCount: 145,
    image: 'https://images.unsplash.com/photo-1721905310734-d79a04683aef?w=800&q=80',
  },
  {
    id: '3',
    title: 'Slide war',
    description: 'PPT Presentation Competition',
    date: '2026-03-17',
    venue: 'Smart Class',
    isPaid: true,
    price: 299,
    maxParticipants: 30,
    registrationDeadline: '2026-03-15',
    status: 'upcoming',
    registeredCount: 28,
    image: 'https://images.unsplash.com/photo-1572675362297-a4b848a8d9a0?w=800&q=80',
  },
  {
    id: '4',
    title: 'E-Sports',
    description: 'BGMI & Free Fire Gaming Competition',
    date: '2026-04-17',
    venue: 'Smart Class',
    isPaid: false,
    maxParticipants: 100,
    registrationDeadline: '2026-04-15',
    status: 'upcoming',
    registeredCount: 67,
    image: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800&q=80',
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: 'r1',
    studentId: '2',
    studentName: 'John Doe',
    studentEmail: 'john@student.edu',
    eventId: '1',
    timestamp: '2026-03-01T10:30:00Z',
    approvalStatus: 'pending',
    paymentStatus: 'pending',
  },
  {
    id: 'r2',
    studentId: '3',
    studentName: 'Jane Smith',
    studentEmail: 'jane@student.edu',
    eventId: '2',
    timestamp: '2026-03-02T14:20:00Z',
    approvalStatus: 'approved',
    paymentStatus: 'not_required',
  },
];

export const mockFaculty: Faculty[] = [
  {
    id: 'f1',
    name: 'Prof. Vishwjeet Ambade',
    designation: 'Head of Department',
    qualification: 'M.Tech (CAD/CAM)  Ph.D*',
    specialization: 'CAD/CAM ',
    email: 'hod.aeronautical@tgpcet.com',
    photo: 'https://www.tgpcet.com/assets/img/Faculty/Ambade.png',
  },
  {
    id: 'f2',
    name: 'Prof. Mayuri Wandhare	',
    designation: 'Assistant Professor',
    qualification: 'M.Tech (Heat Power Engg) 2013',
    specialization: 'Heat Power Engg',
    email: 'mayuri.aeronautical@tgpcet.com',
    photo: 'https://th.bing.com/th/id/OIP.csf7yp-67bZsKhlWf1cPswHaHa?w=105&h=108&c=7&qlt=90&bgcl=9dbec2&r=0&o=6&pid=13.1',
  },
  {
    id: 'f3',
    name: 'Prof. Shrikant Kathwate',
    designation: 'Assistant Professor',
    qualification: 'M.Tech (Heat Power Engg) 2014, Ph.D*',
    specialization: 'Heat Power Engg',
    email: 'shrikant.aeronautical@tgpcet.com',
    photo: 'https://www.tgpcet.com/IdeaLab/assets/img/Tech_Guru/Shrikant.jpg',
  },
  {
    id: 'f4',
    name: 'Prof. Jonna Naresh',
    designation: 'Assistant Professor',
    qualification: 'M.Tech (Aerospace Engg.), Ph.D*',
    specialization: 'Aircraft Structure & Aerodynamics',
    email: 'naresh.aeronautical@tgpcet.com',
    photo: 'https://www.tgpcet.com/assets/img/Faculty/Jonna_Naresh.jpg',
  },
  {
    id: 'f5',
    name: 'Prof. Himani Harpal',
    designation: 'Associate Professor',
    qualification: 'B.E. (ME ) M.Tech (AE)',
    specialization: '--',
    email: 'himani.aeronautical@tgpcet.com',
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL_20I4YcYjFsX-d95KIJw90lAt6fCEalaAA&s',
  },
  {
    id: 'f6',
    name: 'Prof. Arepally Shushrutha',
    designation: 'Assistant Professor',
    qualification: 'B.Tech (AE), M.Tech (AE)',
    specialization: '--',
    email: 'shushrutha.aeronautical@tgpcet.com',
    photo: '',
    
  },
  {
    id: 'f8',
    name: 'Prof. Rupali Mohabiya',
    designation: 'Assistant Professor',
    qualification: 'B.Tech (AE), M.Tech (Aerospace)',
    specialization: '--',
    email: 'rupali.aeronautical@tgpcet.com',
    photo: '',
    
  },
  {
    id: 'f9',
    name: 'Mr. Pankaj Ramteke',
    designation: 'JR.Clerk',
    qualification: '--',
    specialization: '--',
    email: 'pankaj.aeronautical@tgpcet.com',
    photo: '',
    
  },
];
