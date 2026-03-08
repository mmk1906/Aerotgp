import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Rocket, Users, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { getActiveClubs, Club } from '../services/clubService';
import { toast } from 'sonner';

export function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const clubsData = await getActiveClubs();
      setClubs(clubsData);
    } catch (error) {
      console.error('Error loading clubs:', error);
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Student Clubs & Organizations
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join our vibrant community of aerospace enthusiasts. Explore clubs, participate in projects,
            and develop your skills alongside fellow students.
          </p>
        </motion.div>

        {/* Clubs Grid */}
        {clubs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Rocket className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">No Active Clubs</h3>
            <p className="text-gray-400">Check back soon for new clubs!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/clubs/${club.slug}`}>
                  <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 h-full group">
                    {/* Club Banner */}
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      {club.banner ? (
                        <img
                          src={club.banner}
                          alt={club.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <Rocket className="w-20 h-20 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                      
                      {/* Club Logo */}
                      {club.logo && (
                        <div className="absolute bottom-4 left-4">
                          <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-700 overflow-hidden">
                            <img
                              src={club.logo}
                              alt={club.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <CardTitle className="text-2xl group-hover:text-blue-400 transition-colors">
                        {club.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {club.establishedYear && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Est. {club.establishedYear}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{club.memberCount || 0} members</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {club.shortDescription || club.description}
                      </p>

                      {club.category && (
                        <Badge variant="outline" className="mb-4">
                          {club.category}
                        </Badge>
                      )}

                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-500"
                        asChild
                      >
                        <span className="flex items-center justify-center">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-8 text-center">
              <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Want to Join a Club?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Joining a club is easy! Follow these steps to get started:
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8 text-left">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3 text-lg font-bold">1</div>
                  <h4 className="font-semibold mb-2">Login or Sign Up</h4>
                  <p className="text-sm text-gray-400">Create your account to get started with club membership.</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3 text-lg font-bold">2</div>
                  <h4 className="font-semibold mb-2">Complete Your Profile</h4>
                  <p className="text-sm text-gray-400">Add your details in the Student Portal to verify your identity.</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3 text-lg font-bold">3</div>
                  <h4 className="font-semibold mb-2">Submit Join Request</h4>
                  <p className="text-sm text-gray-400">Click on any club above and submit your join request for admin approval.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Login to Join
                  </Button>
                </Link>
                <Link to="/portal/profile">
                  <Button variant="outline">
                    Go to Profile
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}