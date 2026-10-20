import React from 'react';
import { MapPin, Phone, Mail, Globe, Heart, Share2, Rss } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-slate-300">
    <div className="container py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">R</span>
            </div>
            <span className="text-xl font-black text-white">Roamify</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Discover extraordinary stays around the world. Book hotels and rooms with ease and travel with confidence.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[Globe, Heart, Share2, Rss].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-slate-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-colors">
                <Icon size={16} className="text-slate-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            {['About Us', 'Careers', 'Press', 'Blog', 'Trust & Safety'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            {['Help Centre', 'Cancellation Policy', 'Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <MapPin size={15} className="text-rose-400 shrink-0" />
              123 Travel Street, Mumbai, India
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <Phone size={15} className="text-rose-400 shrink-0" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <Mail size={15} className="text-rose-400 shrink-0" />
              support@roamify.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500">© 2025 Roamify. All rights reserved.</p>
        <p className="text-xs text-slate-500">Built with ❤️ using Spring Boot & React</p>
      </div>
    </div>
  </footer>
);

export default Footer;
