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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Our Faculty
          </h1>
          <p className="text-xl text-gray-400">
            Meet our distinguished team of educators and researchers
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'All Faculty' : f}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <span className="ml-4 text-gray-400 text-lg">Loading faculty members...</span>
          </div>
        ) : (
          <>
            {/* Faculty Grid */}
            {filteredFaculty.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFaculty.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                        <p className="text-blue-400 text-sm mb-3">{member.designation}</p>
                        <div className="space-y-2 text-sm text-gray-400 mb-4">
                          <p>
                            <span className="font-semibold">Qualification:</span> {member.qualification}
                          </p>
                          <p>
                            <span className="font-semibold">Specialization:</span>{' '}
                            {member.specialization}
                          </p>
                          {member.experience && (
                            <p>
                              <span className="font-semibold">Experience:</span>{' '}
                              {member.experience}
                            </p>
                          )}
                        </div>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </a>
                        )}
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