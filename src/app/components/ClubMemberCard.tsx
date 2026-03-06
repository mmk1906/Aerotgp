import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Mail, Award } from 'lucide-react';
import { ClubMember } from '../data/clubData';

interface ClubMemberCardProps {
  member: ClubMember;
  index: number;
}

export function ClubMemberCard({ member, index }: ClubMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 group h-full">
        <div className="relative">
          {/* Member Photo */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            {/* Designation Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-semibold">{member.designation}</span>
              </div>
            </div>
          </div>

          {/* Member Info */}
          <CardContent className="relative -mt-20 z-10">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-2 text-white">{member.name}</h3>
              
              {member.year && (
                <p className="text-sm text-blue-400 mb-3">{member.year}</p>
              )}

              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Area of Interest</p>
                <p className="text-sm text-gray-300 font-medium">{member.areaOfInterest}</p>
              </div>

              {member.email && (
                <div className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-sm truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {member.email}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
