import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, X } from 'lucide-react';

interface ReportDownloadNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
}

const ReportDownloadNotification: React.FC<ReportDownloadNotificationProps> = ({
  isVisible,
  onClose,
  message = "Your report is being downloaded..."
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      setIsComplete(false);
      
      // Simulate download progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsComplete(true);
            clearInterval(interval);
            // Auto close after 2 seconds when complete
            setTimeout(() => {
              onClose();
            }, 2000);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    rotate: isComplete ? 0 : 360,
                    scale: isComplete ? 1.2 : 1
                  }}
                  transition={{ 
                    rotate: { duration: 1, repeat: isComplete ? 0 : Infinity, ease: "linear" },
                    scale: { duration: 0.3 }
                  }}
                  className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                >
                  {isComplete ? (
                    <CheckCircle size={20} className="text-white" />
                  ) : (
                    <Download size={20} className="text-white" />
                  )}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {isComplete ? "Download Complete!" : "Downloading Report"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isComplete ? "Your report is ready!" : message}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Status Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {isComplete ? (
                <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <CheckCircle size={12} />
                  <span>Report saved to your downloads</span>
                </span>
              ) : (
                <span>Preparing your comprehensive analysis...</span>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportDownloadNotification;

