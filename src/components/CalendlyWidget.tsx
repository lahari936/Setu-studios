import React, { useEffect, useState, useRef } from 'react';
import { Calendar, ExternalLink, X, Loader2 } from 'lucide-react';

interface CalendlyWidgetProps {
  mentorName: string;
  calendlyUrl: string;
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean; // Option for embedded vs popup
}

const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  mentorName,
  calendlyUrl,
  isOpen,
  onClose,
  embedded = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const calendlyRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  // Load Calendly script dynamically for better performance
  useEffect(() => {
    if (isOpen && embedded && calendlyUrl) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setCalendlyLoaded(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error('Failed to load Calendly script');
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [isOpen, embedded, calendlyUrl]);

  // Initialize embedded Calendly widget
  useEffect(() => {
    if (calendlyLoaded && embedded && calendlyRef.current && calendlyUrl) {
      // @ts-ignore - Calendly global
      if (window.Calendly) {
        try {
          // @ts-ignore
          widgetRef.current = window.Calendly.initInlineWidget({
            url: calendlyUrl,
            parentElement: calendlyRef.current,
            prefill: {},
            utm: {}
          });
        } catch (error) {
          console.error('Failed to initialize Calendly widget:', error);
        }
      }
    }
  }, [calendlyLoaded, embedded, calendlyUrl]);

  const handlePopupOpen = async () => {
    setIsLoading(true);
    
    try {
      // Open Calendly in a popup window with better UX
      const windowFeatures = 'width=1000,height=700,scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no';
      const newWindow = window.open(calendlyUrl, 'calendly', windowFeatures);
      
      if (newWindow) {
        newWindow.focus();
        
        // Monitor window close to update loading state
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkClosed);
            setIsLoading(false);
          }
        }, 1000);
        
        // Auto-close loading after 30 seconds as fallback
        setTimeout(() => {
          clearInterval(checkClosed);
          setIsLoading(false);
        }, 30000);
      } else {
        // Fallback if popup is blocked - redirect to new tab
        window.open(calendlyUrl, '_blank');
        setIsLoading(false);
      }
      
      onClose(); // Close the modal after opening Calendly
    } catch (error) {
      console.error('Failed to open Calendly:', error);
      setIsLoading(false);
    }
  };

  // Cleanup embedded widget on close
  useEffect(() => {
    if (!isOpen && embedded && widgetRef.current) {
      try {
        // @ts-ignore
        if (window.Calendly && widgetRef.current) {
          // @ts-ignore
          window.Calendly.closePopupWidget();
        }
      } catch (error) {
        console.error('Failed to close Calendly widget:', error);
      }
      widgetRef.current = null;
    }
  }, [isOpen, embedded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
        embedded ? 'min-h-[600px]' : ''
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Schedule Meeting with {mentorName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose a time that works for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {embedded ? (
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white dark:bg-slate-800 flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading calendar...</p>
                  </div>
                </div>
              )}
              <div 
                ref={calendlyRef}
                className="calendly-inline-widget min-h-[500px] w-full"
                data-url={calendlyUrl}
                style={{ minWidth: '320px', height: '600px' }}
              />
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to schedule your session?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  We'll open Calendly in a new window where you can choose your preferred time slot with {mentorName}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handlePopupOpen}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Opening Calendar...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Open Calendar
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => window.open(calendlyUrl, '_blank')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500">
                Having trouble? Try disabling popup blockers for this site.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendlyWidget;
