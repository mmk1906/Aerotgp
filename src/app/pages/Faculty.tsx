import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Mail, Loader2 } from 'lucide-react';
import { getAllFaculty, Faculty as FacultyType } from '../services/databaseService';
import { toast } from 'sonner';

export function Faculty() {
  const [filter, setFilter] = useState('all');
  const [faculty, setFaculty] = useState<FacultyType[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = ['all', 'HOD', 'Professor', 'Associate Professor', 'Assistant Professor'];

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const fetchedFaculty = await getAllFaculty();
      
      // Sort faculty by role hierarchy
      const roleOrder = {
        'HOD': 0,
        'Professor': 1,
        'Associate Professor': 2,
        'Assistant Professor': 3,
        'Other': 4
      };
      
      const sortedFaculty = fetchedFaculty.sort((a, b) => {
        const roleA = roleOrder[a.role || 'Other'] ?? 5;
        const roleB = roleOrder[b.role || 'Other'] ?? 5;
        return roleA - roleB;
      });
      
      setFaculty(sortedFaculty);
    } catch (error) {
      console.error('Error loading faculty:', error);
      toast.error('Failed to load faculty members');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty =
    filter === 'all'
      ? faculty
      : faculty.filter((f) => f.role === filter || f.designation.includes(filter));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Our Faculty
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
            Meet our distinguished team of educators and researchers
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 md:mb-12 px-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 md:px-6 py-2 rounded-full transition-all text-xs sm:text-sm md:text-base ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col sm:flex-row justify-center items-center py-20 gap-4">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-500" />
            <span className="text-gray-400 text-base sm:text-lg">Loading faculty members...</span>
          </div>
        ) : (
          <>
            {/* Faculty Grid */}
            {filteredFaculty.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredFaculty.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full">
                      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                            {member.name}
                          </h3>
                          <p className="text-blue-400 text-xs sm:text-sm font-medium">
                            {member.designation}
                          </p>
                        </div>
                      </div>
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="mb-3 sm:mb-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">Specialization:</h4>
                          <p className="text-gray-300 text-xs sm:text-sm">{member.specialization}</p>
                        </div>
                        <div className="mb-3 sm:mb-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">Qualifications:</h4>
                          <p className="text-gray-300 text-xs sm:text-sm">{member.qualifications}</p>
                        </div>
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm"
                        >
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No faculty members found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}