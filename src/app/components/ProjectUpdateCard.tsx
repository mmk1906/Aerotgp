import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { ProjectUpdate } from '../data/clubData';

interface ProjectUpdateCardProps {
  update: ProjectUpdate;
  index: number;
  onImageClick?: (imageUrl: string) => void;
}

const stageColors = {
  Design: 'bg-blue-500',
  Fabrication: 'bg-yellow-500',
  Testing: 'bg-orange-500',
  Completed: 'bg-green-500',
};

const stageIcons = {
  Design: '📐',
  Fabrication: '🔧',
  Testing: '🧪',
  Completed: '✅',
};

export function ProjectUpdateCard({ update, index, onImageClick }: ProjectUpdateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{update.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(update.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            <Badge 
              className={`${stageColors[update.progressStage]} text-white border-none`}
            >
              <span className="mr-1">{stageIcons[update.progressStage]}</span>
              {update.progressStage}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed mb-4">{update.description}</p>

          {/* Images */}
          {update.images.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {update.images.map((image, idx) => (
                <div 
                  key={idx}
                  className="relative h-40 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => onImageClick?.(image)}
                >
                  <img
                    src={image}
                    alt={`${update.title} - ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300" />
                </div>
              ))}
            </div>
          )}

          {/* Team Members */}
          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-start space-x-2">
              <Users className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Team Members</p>
                <div className="flex flex-wrap gap-2">
                  {update.teamMembers.map((member, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      className="border-slate-600 text-gray-300"
                    >
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Posted By */}
            <div className="mt-3 text-xs text-gray-500">
              Posted by {update.postedBy}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-blue-400 font-semibold">
                {update.progressStage === 'Design' && '25%'}
                {update.progressStage === 'Fabrication' && '50%'}
                {update.progressStage === 'Testing' && '75%'}
                {update.progressStage === 'Completed' && '100%'}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${stageColors[update.progressStage]} transition-all duration-500`}
                style={{
                  width: update.progressStage === 'Design' ? '25%' :
                         update.progressStage === 'Fabrication' ? '50%' :
                         update.progressStage === 'Testing' ? '75%' : '100%'
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
