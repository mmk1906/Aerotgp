import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { Rocket, Users, Trophy, ArrowRight } from 'lucide-react';
import { getAllClubs, Club } from '../services/databaseService';
import { toast } from 'sonner';

export function ClubsDirectory() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const fetchedClubs = await getAllClubs();
      setClubs(fetchedClubs.filter(club => club.status === 'active'));
    } catch (error) {
      console.error('Error loading clubs:', error);
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading clubs...</p>
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
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Department Clubs
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our student-led clubs and organizations dedicated to innovation, learning, and excellence
          </p>
        </motion.div>

        {/* Clubs Grid */}
        {clubs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Rocket className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h3 className="text-2xl font-semibold mb-4">No Clubs Available</h3>
            <p className="text-gray-400 mb-8">Clubs will be added soon. Check back later!</p>
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
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full flex flex-col group">
                  {/* Club Logo/Banner */}
                  {club.logo || club.banner ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={club.banner || club.logo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                      {club.logo && club.banner && (
                        <div className="absolute bottom-4 left-4">
                          <img
                            src={club.logo}
                            alt={`${club.name} logo`}
                            className="w-16 h-16 rounded-lg border-2 border-white/20 bg-slate-900/80"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                      <Rocket className="w-20 h-20 text-blue-400/50" />
                    </div>
                  )}

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold mb-3">{club.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
                      {club.shortDescription || club.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {club.memberCount && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-400">
                            {club.memberCount} Members
                          </span>
                        </div>
                      )}
                      {club.establishedYear && (
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-400">
                            Est. {club.establishedYear}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Explore Button */}
                    <Button
                      onClick={() => navigate(`/clubs/${club.slug}`)}
                      className="w-full group"
                    >
                      Explore {club.name}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
