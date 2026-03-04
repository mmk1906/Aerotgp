import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="relative bg-[#0f172a] border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Plane className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">AeroTGP</span>
            </div>
            <p className="text-sm text-gray-400">
              Shaping the future of flight through innovation and excellence in aerospace engineering.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Faculty
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/academics" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Academics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  Department of Aeronautical Engineering
                  <br />
                 Tulsiramji Gaikwad-Patil College of Engineering and Technology. Mohagaon, Wardha Road, Nagpur, 441108 Maharashtra, INDIA.
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">+91 8788350038</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">hod.aeronautical@tgpcet.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Department of Aeronautical Engineering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
