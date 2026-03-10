import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Users, Award, Rocket, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllEvents, Event } from '../services/databaseService';
import { getAllClubs, Club } from '../services/clubService';

export function Home() {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    projects: 0,
    events: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    animateStats();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [events, clubsData] = await Promise.all([
        getAllEvents(),
        getAllClubs()
      ]);

      // Filter upcoming events
      const upcoming = events
        .filter(e => e.status === 'upcoming')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      setUpcomingEvents(upcoming);

      // Get active clubs
      setClubs(clubsData.filter(c => c.status === 'active'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = () => {
    const targetStats = {
      students: 500,
      faculty: 25,
      projects: 150,
      events: 50,
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        students: Math.floor(targetStats.students * progress),
        faculty: Math.floor(targetStats.faculty * progress),
        projects: Math.floor(targetStats.projects * progress),
        events: Math.floor(targetStats.events * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, interval);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1721905310734-d79a04683aef?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/90 via-[#0a0e1a]/80 to-[#0a0e1a]" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="inline-block mb-4 md:mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Rocket className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mx-auto" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent px-2">
              Shaping the Future of Flight
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-2">
              Excellence in Aeronautical Engineering Education, Research, and Innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/about" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:min-w-[150px]">
                  Explore <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:min-w-[150px]">
                  View Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Highlights Section */}
      <section className="relative py-12 md:py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Department Highlights</h2>
            <p className="text-gray-400 text-base md:text-lg px-4">Leading innovation in aerospace technology</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: 'Advanced Research',
                description: 'Cutting-edge research in aerodynamics, propulsion, and materials science.',
                image: 'https://images.unsplash.com/photo-1737703121444-c568a9d3bc0e?w=800&q=80',
              },
              {
                title: 'State-of-the-Art Labs',
                description: 'World-class facilities including wind tunnels and flight simulators.',
                image: 'https://images.unsplash.com/photo-1572675362297-a4b848a8d9a0?w=800&q=80',
              },
              {
                title: 'Industry Partnerships',
                description: 'Strong collaborations with leading aerospace companies and agencies.',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
              },
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 group h-full">
                  <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  </div>
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base">{highlight.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-[#0f172a] to-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Upcoming Events</h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg">Join us for exciting learning opportunities</p>
            </div>
            <Link to="/events" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full">
                  <div className="relative h-40 sm:h-44 md:h-48">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {event.isPaid && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                        ₹{event.price}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="whitespace-nowrap">{event.registeredCount}/{event.maxParticipants} registered</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}