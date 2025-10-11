import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Schedule a Call",
  message = "Let's connect to discuss your startup idea, answer your questions, or help you get started on your journey!"
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className={`w-full max-w-md mx-4 rounded-2xl shadow-2xl border-2 ${isDark ? 'bg-slate-900 border-orange-500' : 'bg-white border-orange-500'} p-8 relative animate-fadeIn`}>
        <button
          className="absolute top-4 right-4 text-orange-500 hover:text-orange-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-2xl font-bold text-orange-500 text-center">{title}</h3>
          <p className="text-center text-base text-gray-400 mb-4">{message}</p>
          <div className="flex gap-8 mt-2">
            <a 
              href="tel:+917780754541" 
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110" 
              title="Call"
            >
              <Phone size={28} />
            </a>
            <a 
              href="mailto:guidebazaar2@gmail.com" 
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110" 
              title="Mail"
            >
              <Mail size={28} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
