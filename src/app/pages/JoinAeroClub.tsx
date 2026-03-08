import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Rocket, User, Mail, Phone, Building2, GraduationCap, Hash, Target, Code, Briefcase, Link as LinkIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  yearOfStudy: string;
  prn: string;
  areasOfInterest: string[];
  technicalSkills: string;
  projectExperience: string;
  motivation: string;
  portfolio: string;
}

export function JoinAeroClub() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();

  const areasOfInterest = [
    'RC Aircraft',
    'UAVs',
    'Aerodynamics',
    'Structures',
    'Avionics',
    'CAD Design'
  ];

  const selectedAreas = watch('areasOfInterest') || [];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Save to Firebase instead of localStorage
      const { createClubApplication } = await import('../services/databaseService');
      
      await createClubApplication({
        clubId: 'aero-club',
        clubName: 'Aero Club',
        userId: 'guest',
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        department: data.department || '',
        year: data.yearOfStudy || '',
        skills: data.technicalSkills || '',
        experience: data.projectExperience || '',
        motivation: data.motivation,
        portfolio: data.portfolio || '',
        status: 'pending',
      });
      
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Application submitted successfully! We will contact you soon.');
      
      setTimeout(() => {
        navigate('/clubs');
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitting(false);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto px-4"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-center">
            <CardContent className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Application Submitted!
              </h2>
              <p className="text-gray-400 mb-6">
                Thank you for your interest in joining the Aero Club. We'll review your application and get back to you soon.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to Clubs page...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Rocket className="w-16 h-16 text-blue-500" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Join Aero Club
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Take your passion for aerospace to new heights. Fill out the form below to become a part of our dynamic team.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">Application Form</CardTitle>
              <CardDescription>
                Please provide accurate information. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        {...register('fullName', { required: 'Full name is required' })}
                        placeholder="Enter your full name"
                        className="bg-slate-800/50 border-slate-600"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        placeholder="your.email@example.com"
                        className="bg-slate-800/50 border-slate-600"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="1234567890"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prn">
                        PRN/Enrollment Number (Optional)
                      </Label>
                      <Input
                        id="prn"
                        {...register('prn')}
                        placeholder="Enter your PRN"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Academic Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="department"
                        {...register('department', { required: 'Department is required' })}
                        placeholder="e.g., Aeronautical Engineering"
                        className="bg-slate-800/50 border-slate-600"
                      />
                      {errors.department && (
                        <p className="text-red-500 text-sm">{errors.department.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">
                        Year of Study <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => setValue('yearOfStudy', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.yearOfStudy && (
                        <p className="text-red-500 text-sm">{errors.yearOfStudy.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Areas of Interest <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-sm text-gray-400">Select all that apply</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {areasOfInterest.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          onCheckedChange={(checked) => {
                            const current = selectedAreas || [];
                            if (checked) {
                              setValue('areasOfInterest', [...current, area]);
                            } else {
                              setValue('areasOfInterest', current.filter(a => a !== area));
                            }
                          }}
                          className="border-slate-600"
                        />
                        <Label htmlFor={area} className="cursor-pointer font-normal">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Background */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Technical Background
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="technicalSkills">
                      Technical Skills (Optional)
                    </Label>
                    <Textarea
                      id="technicalSkills"
                      {...register('technicalSkills')}
                      placeholder="e.g., CATIA, ANSYS, Python, Arduino, etc."
                      className="bg-slate-800/50 border-slate-600 min-h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectExperience">
                      Previous Project Experience <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="projectExperience"
                      {...register('projectExperience', { required: 'Please describe your project experience' })}
                      placeholder="Describe any relevant projects you've worked on (or write 'None' if you're a beginner)"
                      className="bg-slate-800/50 border-slate-600 min-h-32"
                    />
                    {errors.projectExperience && (
                      <p className="text-red-500 text-sm">{errors.projectExperience.message}</p>
                    )}
                  </div>
                </div>

                {/* Motivation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Motivation
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="motivation">
                      Why do you want to join the Aero Club? <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="motivation"
                      {...register('motivation', {
                        required: 'Please tell us why you want to join',
                        minLength: {
                          value: 50,
                          message: 'Please provide at least 50 characters'
                        }
                      })}
                      placeholder="Tell us about your passion for aerospace and what you hope to achieve by joining the club..."
                      className="bg-slate-800/50 border-slate-600 min-h-40"
                    />
                    {errors.motivation && (
                      <p className="text-red-500 text-sm">{errors.motivation.message}</p>
                    )}
                  </div>
                </div>

                {/* Portfolio */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Portfolio & Links (Optional)
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">
                      Portfolio/GitHub/LinkedIn
                    </Label>
                    <Input
                      id="portfolio"
                      type="url"
                      {...register('portfolio')}
                      placeholder="https://your-portfolio.com"
                      className="bg-slate-800/50 border-slate-600"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Expert Mentorship</h3>
              <p className="text-sm text-gray-400">Learn from experienced seniors and faculty members</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Hands-on Projects</h3>
              <p className="text-sm text-gray-400">Work on real aerospace projects and competitions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Skill Development</h3>
              <p className="text-sm text-gray-400">Enhance your technical and teamwork abilities</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}