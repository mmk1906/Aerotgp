import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router';
import { Rocket, Home, ArrowRight } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  estimatedDate?: string;
  showHomeButton?: boolean;
}

export function ComingSoon({
  title = 'Coming Soon',
  description = 'This section is currently under development. We are working on bringing this feature to you soon.',
  estimatedDate,
  showHomeButton = true,
}: ComingSoonProps) {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-12">
              {/* Rocket Icon with Animation */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                  <Rocket className="w-12 h-12 text-blue-400" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              >
                {title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-400 mb-8 max-w-xl mx-auto"
              >
                {description}
              </motion.p>

              {/* Estimated Date */}
              {estimatedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                    <span className="text-sm text-blue-400">
                      Expected: {estimatedDate}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <p className="text-sm text-gray-500 mb-4">Stay tuned for updates</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Enhanced UI', 'New Features', 'Improved Performance'].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="inline-flex items-center px-3 py-1 bg-slate-800 rounded-full text-xs text-gray-400">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Home Button */}
              {showHomeButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link to="/">
                    <Button size="lg" className="group">
                      <Home className="w-5 h-5 mr-2" />
                      Back to Home
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              )}

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute -bottom-10 -right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
