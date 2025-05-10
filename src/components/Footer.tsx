import React from 'react';
import { PlusCircle, Mail, Phone, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="text-blue-400 h-6 w-6" />
              <span className="font-semibold text-xl text-white">MedExchange</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              A secure platform for hospitals to exchange medications efficiently,
              reducing waste and ensuring critical drugs reach those in need.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="/account-setup" className="hover:text-blue-400 transition-colors">Register</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href="mailto:support@medexchange.org" className="hover:text-blue-400 transition-colors">
                  support@medexchange.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href="tel:+11234567890" className="hover:text-blue-400 transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <a href="#" className="hover:text-blue-400 transition-colors">
                  FAQs & Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MedExchange. All rights reserved.
        </div>
      </div>
    </footer>
  );
};