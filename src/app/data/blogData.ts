export interface Blog {
  id: string;
  title: string;
  author: string;
  authorId: string;
  category: 'Aviation' | 'Space' | 'UAVs' | 'Aerodynamics' | 'Technology' | 'Research';
  coverImage: string;
  content: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
  bookmarkedBy: string[];
}

export const mockBlogs: Blog[] = [
  {
    id: 'blog1',
    title: 'The Future of Hypersonic Flight',
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    category: 'Aviation',
    coverImage: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    content: `<h2>Introduction to Hypersonic Technology</h2>
    <p>Hypersonic flight, defined as travel at speeds exceeding Mach 5, represents the next frontier in aerospace engineering. This technology promises to revolutionize both military and civilian aviation.</p>
    
    <h3>Current Developments</h3>
    <p>Recent advancements in materials science and propulsion systems have brought hypersonic flight closer to reality. Several countries are actively developing hypersonic vehicles, with test flights showing promising results.</p>
    
    <h3>Challenges and Solutions</h3>
    <p>The extreme temperatures generated at hypersonic speeds require innovative cooling systems and heat-resistant materials. Carbon-carbon composites and ceramic matrix composites are leading candidates for thermal protection systems.</p>
    
    <p>The potential applications range from rapid global transportation to space access, making this one of the most exciting areas of aerospace research today.</p>`,
    tags: ['Hypersonic', 'Propulsion', 'Materials', 'Innovation'],
    status: 'approved',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
    likes: 145,
    likedBy: [],
    bookmarkedBy: [],
  },
  {
    id: 'blog2',
    title: 'Autonomous UAV Systems: Current State and Future',
    author: 'Prof. Vishwjeet Ambade',
    authorId: '1',
    category: 'UAVs',
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
    content: `<h2>Evolution of Autonomous Drones</h2>
    <p>Unmanned Aerial Vehicles (UAVs) have evolved from simple remote-controlled aircraft to sophisticated autonomous systems capable of complex missions.</p>
    
    <h3>AI and Machine Learning Integration</h3>
    <p>Modern UAVs leverage artificial intelligence for obstacle avoidance, path planning, and target recognition. Deep learning algorithms enable real-time decision-making in dynamic environments.</p>
    
    <h3>Applications</h3>
    <ul>
      <li>Precision Agriculture</li>
      <li>Disaster Response and Search & Rescue</li>
      <li>Infrastructure Inspection</li>
      <li>Environmental Monitoring</li>
      <li>Delivery Services</li>
    </ul>
    
    <h3>Regulatory Challenges</h3>
    <p>As UAV technology advances, regulatory frameworks must evolve to ensure safe integration into national airspace systems while fostering innovation.</p>`,
    tags: ['UAV', 'Autonomous Systems', 'AI', 'Drones'],
    status: 'approved',
    createdAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
    likes: 98,
    likedBy: [],
    bookmarkedBy: [],
  },
  {
    id: 'blog3',
    title: 'Computational Fluid Dynamics in Aircraft Design',
    author: 'Dr. Michael Chen',
    authorId: '1',
    category: 'Aerodynamics',
    coverImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    content: `<h2>The Role of CFD in Modern Aerospace</h2>
    <p>Computational Fluid Dynamics (CFD) has transformed aircraft design by enabling engineers to simulate and optimize aerodynamic performance before physical prototyping.</p>
    
    <h3>Advanced Simulation Techniques</h3>
    <p>Modern CFD tools employ sophisticated turbulence models and high-performance computing to solve complex Navier-Stokes equations. Large Eddy Simulation (LES) and Direct Numerical Simulation (DNS) provide unprecedented accuracy.</p>
    
    <h3>Design Optimization</h3>
    <p>Multi-objective optimization algorithms coupled with CFD enable engineers to explore vast design spaces, balancing performance metrics such as:</p>
    <ul>
      <li>Lift-to-drag ratio</li>
      <li>Fuel efficiency</li>
      <li>Structural weight</li>
      <li>Noise reduction</li>
    </ul>
    
    <h3>Future Directions</h3>
    <p>Machine learning integration with CFD promises to accelerate design cycles through surrogate modeling and reduced-order modeling techniques.</p>`,
    tags: ['CFD', 'Aerodynamics', 'Simulation', 'Design'],
    status: 'approved',
    createdAt: '2026-02-25T09:15:00Z',
    updatedAt: '2026-02-25T09:15:00Z',
    likes: 112,
    likedBy: [],
    bookmarkedBy: [],
  },
  {
    id: 'blog4',
    title: 'Commercial Space Tourism: A New Era',
    author: 'Emily Rodriguez',
    authorId: '2',
    category: 'Space',
    coverImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80',
    content: `<h2>Dawn of Space Tourism</h2>
    <p>The dream of space tourism is becoming reality as private companies successfully launch civilians into space. This marks a pivotal moment in aerospace history.</p>
    
    <h3>Current Operators</h3>
    <p>Several companies are now offering or developing space tourism services, including suborbital flights and orbital missions. The competition has driven innovation and reduced costs.</p>
    
    <h3>Safety and Training</h3>
    <p>Passenger safety remains paramount. Rigorous training programs prepare tourists for the physical and psychological challenges of spaceflight, including:</p>
    <ul>
      <li>G-force adaptation</li>
      <li>Zero-gravity familiarization</li>
      <li>Emergency procedures</li>
      <li>Basic spacecraft operations</li>
    </ul>
    
    <h3>Economic Impact</h3>
    <p>The emerging space tourism industry is creating new jobs, spurring technological advancement, and inspiring the next generation of aerospace engineers.</p>`,
    tags: ['Space Tourism', 'Commercial Space', 'Innovation'],
    status: 'approved',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z',
    likes: 203,
    likedBy: [],
    bookmarkedBy: [],
  },
  {
    id: 'blog5',
    title: 'Sustainable Aviation Fuels: The Path to Green Flying',
    author: 'Dr. James Patterson',
    authorId: '1',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    content: `<h2>The Sustainability Challenge</h2>
    <p>Aviation accounts for approximately 2-3% of global CO2 emissions. Sustainable Aviation Fuels (SAF) offer a promising solution to reduce the industry's carbon footprint.</p>
    
    <h3>Types of SAF</h3>
    <p>Several pathways exist for producing sustainable aviation fuels:</p>
    <ul>
      <li>Biofuels from waste oils and agricultural residues</li>
      <li>Synthetic fuels from CO2 capture and renewable energy</li>
      <li>Hydrogen and fuel cell technologies</li>
    </ul>
    
    <h3>Performance and Compatibility</h3>
    <p>Modern SAFs are "drop-in" replacements, requiring no modifications to existing aircraft engines. They offer similar or better performance characteristics compared to conventional jet fuel.</p>
    
    <h3>Challenges</h3>
    <p>Scaling production and reducing costs remain key challenges. Government incentives and industry partnerships are crucial for widespread adoption.</p>`,
    tags: ['Sustainability', 'Green Aviation', 'SAF', 'Environment'],
    status: 'approved',
    createdAt: '2026-03-03T16:45:00Z',
    updatedAt: '2026-03-03T16:45:00Z',
    likes: 167,
    likedBy: [],
    bookmarkedBy: [],
  },
];
