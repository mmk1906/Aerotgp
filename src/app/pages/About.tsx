import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Target, Eye, Award, Beaker } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            About Our Department
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4"></p>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Department Overview</h2>
              <p className="text-gray-400 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                The Department of Aeronautical Engineering was established in 2020 with an intake of 90 students in the UG course. The department has also started a PG program in Aeronautical Engineering with an intake of 12 in the year 2023. Aeronautical engineering involves researching, designing, constructing, testing, and manufacturing of the aircraft within Earth's atmosphere. It also covers the investigation into aerodynamic elements of aircraft, including behaviors and related factors such as control surfaces, lift, airfoil, and drag. The Department aims to cultivate expertise in specialized fields within aeronautical engineering, including aircraft structural design, aerodynamics, propulsion systems, and guidance and control systems, with an emphasis on research and innovation.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
               The Aeronautical engineering department features several specialized labs: Aero-Thermodynamics Lab, Fluid Mechanics and Machinery Lab, Aerodynamics Lab, Aircraft Structures Lab, Propulsion Lab, and CAD/CAE Lab, offering students hands-on experience in advanced research and practical applications. The department has well qualified and experienced faculties from IITs, NITs and Government institutes having excellent academic as well as research contribution. The aeronautical engineering department offers a vibrant and enriching environment for students. The student-run Aerocious forum hosts guest lectures and workshops, while the drone club organizes competitions and projects, providing opportunities for practical experience and fostering innovation in drone technology and applications. The department encourages students to engage in research and publish papers. They are also motivated to participate in international and national conferences, providing them with valuable opportunities to present their work, network with industry professionals, and stay informed about the latest advancements in the field.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 h-full">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-gray-400 leading-relaxed">To foster technically skilled Aeronautical Engineers of the utmost academic principles, to convene the needs of academia, industry and society.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 h-full">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 sm:mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-400 leading-relaxed">
                  Impart quality technical education and unique interdisciplinary experiences.

 Develop the analytical, computational and design capabilities to provide sustainable solutions.

 Expose the students to the current trends and opportunities in the Aerospace industry.

 Inculcate professional responsibility based on an innate ethical value system.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Labs and Infrastructure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Labs & Infrastructure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: 'Aero-Thermodynamics Lab',
                description: 'Study of Heat',
                icon: Beaker,
              },
              {
                title: 'Fluid Mechanics and Machinery Lab',
                description: 'Advance Study of Fluid for Aeronautics',
                icon: Target,
              },
              {
                title: 'Propulsion Lab',
                description: 'Study of Solid and liquid Fuels',
                icon: Award,
              },
              {
                title: 'Aircraft Structures Lab',
                description: 'Testing facilities for aircraft materials and structures',
                icon: Beaker,
              },
              {
                title: 'Aerodynamics Lab',
                description: 'Subsonic and supersonic wind tunnels for aerodynamic testing',
                icon: Target,
              },
              {
                title: 'Design Studio',
                description: 'CAD/CAM facilities with advanced software',
                icon: Award,
              },
            ].map((lab, index) => (
              <motion.div
                key={lab.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 h-full hover:border-blue-500 transition-all duration-300">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <lab.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{lab.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{lab.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Key Achievements</h2>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start space-x-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">National Award for Excellence</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Received the National Education Award for outstanding contributions to aerospace
                      engineering education (2024)
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Industrial Vist to ISRO</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Student's had a Industrial Vist to ISRO Banglore
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Student Achievement</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Our students have won multiple national  UAV design competitions
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}