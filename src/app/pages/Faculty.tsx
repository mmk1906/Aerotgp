import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Mail, Phone, BookOpen, Award, Loader2 } from 'lucide-react';
import { getAllFaculty, Faculty as FacultyType } from '../services/databaseService';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Faculty() {
  const [filter, setFilter] = useState('all');
  const [faculty, setFaculty] = useState<FacultyType[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = ['all', 'HOD', 'Professor', 'Associate Professor', 'Assistant Professor', 'Non-Teaching Staff', 'Jr. Clerk'];

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const fetchedFaculty = await getAllFaculty();
      
      // Sort faculty by role hierarchy - Non-teaching and Jr. Clerk always at the end
      const roleOrder: Record<string, number> = {
        'HOD': 0,
        'Professor': 1,
        'Associate Professor': 2,
        'Assistant Professor': 3,
        'Other': 4,
        'Non-Teaching Staff': 5,
        'Jr. Clerk': 6
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Our Faculty
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet our distinguished team of educators and researchers dedicated to excellence in aerospace engineering
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 rounded-full transition-all font-medium ${
                filter === f
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800/50 backdrop-blur-sm text-gray-300 hover:bg-slate-700/50 border border-slate-700'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <span className="text-gray-400 text-lg">Loading faculty members...</span>
          </div>
        ) : (
          <>
            {/* Faculty Grid */}
            {filteredFaculty.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFaculty.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full group hover:shadow-xl hover:shadow-blue-500/20">
                      {/* Profile Image */}
                      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                        <ImageWithFallback
                          src={member.photo || 'https://via.placeholder.com/400x500?text=No+Image'}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        
                        {/* Role Badge */}
                        {member.role && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-blue-400/50">
                              {member.role}
                            </span>
                          </div>
                        )}
                        
                        {/* Name & Designation Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {member.name}
                          </h3>
                          <p className="text-blue-400 font-medium flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            {member.designation}
                          </p>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        {/* Specialization */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            <h4 className="text-sm font-semibold">Specialization</h4>
                          </div>
                          <p className="text-gray-300 leading-relaxed">
                            {member.specialization}
                          </p>
                        </div>

                        {/* Qualifications */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-400">Qualifications</h4>
                          <p className="text-gray-300 leading-relaxed">
                            {member.qualification}
                          </p>
                        </div>

                        {/* Experience */}
                        {member.experience && (
                          <div className="pt-2 border-t border-slate-700/50">
                            <p className="text-sm text-gray-400">
                              <span className="font-semibold">Experience:</span> {member.experience}
                            </p>
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="pt-4 border-t border-slate-700/50 space-y-2">
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group/email"
                          >
                            <Mail className="w-4 h-4 group-hover/email:scale-110 transition-transform" />
                            <span className="text-sm truncate">{member.email}</span>
                          </a>
                          {member.phone && (
                            <a
                              href={`tel:${member.phone}`}
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group/phone"
                            >
                              <Phone className="w-4 h-4 group-hover/phone:scale-110 transition-transform" />
                              <span className="text-sm">{member.phone}</span>
                            </a>
                          )}
                        </div>

                        {/* Research Interests */}
                        {member.researchInterests && member.researchInterests.length > 0 && (
                          <div className="pt-4 border-t border-slate-700/50">
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Research Interests</h4>
                            <div className="flex flex-wrap gap-2">
                              {member.researchInterests.map((interest, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-slate-800/50 text-gray-300 text-xs rounded border border-slate-700/50"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Faculty Members Found</h3>
                  <p className="text-gray-500">No faculty members found in this category.</p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}