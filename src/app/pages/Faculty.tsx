import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Mail } from 'lucide-react';
import { mockFaculty } from '../data/mockData';

export function Faculty() {
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'Professor', 'Associate Professor', 'Assistant Professor'];

  const filteredFaculty =
    filter === 'all'
      ? mockFaculty
      : mockFaculty.filter((f) => f.designation.includes(filter));

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

        {/* Faculty Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFaculty.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={faculty.photo}
                    alt={faculty.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{faculty.name}</h3>
                  <p className="text-blue-400 text-sm mb-3">{faculty.designation}</p>
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <p>
                      <span className="font-semibold">Qualification:</span> {faculty.qualification}
                    </p>
                    <p>
                      <span className="font-semibold">Specialization:</span>{' '}
                      {faculty.specialization}
                    </p>
                  </div>
                  <a
                    href={`mailto:${faculty.email}`}
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{faculty.email}</span>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
