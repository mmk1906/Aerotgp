import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { createContactMessage } from '../services/databaseService';
import { toast } from 'sonner';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in name, email, and message fields');
      return;
    }
    
    try {
      setSubmitting(true);

      // Save message to Firebase
      await createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        date: new Date().toISOString(),
        status: 'new',
      });

      // Show success message
      setSubmitted(true);
      toast.success('Message sent successfully! We will get back to you soon.');

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

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
            Contact Us
          </h1>
          <p className="text-xl text-gray-400">
            Get in touch with us for any inquiries or information
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="text-sm text-gray-400">
                      <p className="font-semibold text-white mb-1">Address</p>
                      <p>Department of Aeronautical Engineering</p>
                      <p>Tulsiramji Gaikwad-Patil College of Engineering and Technology. Mohagaon, Wardha Road</p>
                      <p>Nagpur, 441108 Maharashtra, INDIA.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="text-sm text-gray-400">
                      <p className="font-semibold text-white mb-1">Phone</p>
                      <p>+91 8788350038</p>
                      <p>+91 9922966176</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="text-sm text-gray-400">
                      <p className="font-semibold text-white mb-1">Email</p>
                      <p>hod.aeronautical@tgpcet.com</p>
                      <p>principal@tgpcet.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="text-sm text-gray-400">
                      <p className="font-semibold text-white mb-1">Office Hours</p>
                      <p>Monday - Friday: 10:00 AM - 5:00 PM</p>
                      <p>Saturday: 10:00 AM - 1:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=100066140423759"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/aeronautical.tgpcet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                    <p className="text-gray-400">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm mb-2">Name *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Your name"
                          required
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="your.email@example.com"
                          required
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm mb-2">Phone *</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+91 1234567890"
                          required
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Subject *</label>
                        <Input
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          placeholder="What is this about?"
                          required
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Message *</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Your message..."
                        rows={6}
                        required
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden">
            <div className="h-96 bg-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4007.1713125829597!2d79.01209487555653!3d20.96070248067169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd497d972e508c9%3A0x3bef2f11476a08b9!2sTulsiramji%20Gaikwad%20Patil%20College%20of%20Engineering%20and%20Technology!5e1!3m2!1sen!2sin!4v1772643608666!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}