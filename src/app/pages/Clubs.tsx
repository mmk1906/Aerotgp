import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plane, Users, Rocket, Trophy } from 'lucide-react';

export function Clubs() {
  const projects = [
    {
      title: 'Solid Rocket model',
      description: 'Development of Solid Rocket Model',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    },
    {
      title: 'RC Plane',
      description: 'Design and Sucessful Model of RC Plane',
      image: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800&q=80',
    },
    {
      title: 'Aircraft Design Competition',
      description: 'Winner of National Aero Design Competition 2025',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    },
  ];

  const gallery = [
    'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/48.png',
    'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/45.png',
    'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/56.png',
    'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/38.png',
    'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/39.png',
    'https://www.tgpcet.com/assets/img/Aeronautical-Engineering/Gallery/36.jpeg',
  ];

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
            Aero Club
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join us in exploring the fascinating world of aerospace through hands-on projects and competitions
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">About Aero Club</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    The Aero Club is a student-led organization dedicated to promoting aviation and
                    aerospace knowledge through practical projects, workshops, and competitions.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Our members work on cutting-edge projects including UAV design, rocket systems, RC Plane
                    and participate in national level competitions.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">25</div>
                        <div className="text-sm text-gray-400">Active Members</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-sm text-gray-400">Awards Won</div>
                      </div>
                    </div>
                  </div>
                  <Button size="lg">
                    Join Aero Club <Rocket className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
                    alt="Aero Club"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 h-full">
                  <div className="relative h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm">{project.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
