import React, { useState } from 'react';
import { Sun, Moon, Palette, RotateCcw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  const restoreOriginalTheme = () => {
    // This would restore the original orange theme
    // For now, we'll just show a notification
    alert('Original theme restoration feature coming soon! The current soft theme is the new default.');
  };

  return (
    <div className="relative">
      {/* Main Theme Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isDark
              ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Theme Options Button */}
        <button
          onClick={() => setShowThemeOptions(!showThemeOptions)}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isDark
              ? 'bg-slate-700 text-primary-400 hover:bg-slate-600'
              : 'bg-slate-100 text-primary-600 hover:bg-slate-200'
          }`}
          title="Theme Options"
        >
          <Palette size={20} />
        </button>
      </div>

      {/* Theme Options Dropdown */}
      {showThemeOptions && (
        <div className={`absolute top-full right-0 mt-2 w-64 rounded-xl shadow-lg border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        } z-50`}>
          <div className="p-4">
            <h3 className={`text-lg font-semibold mb-3 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Theme Options
            </h3>
            
            <div className="space-y-3">
              {/* Current Theme Info */}
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-slate-700' : 'bg-slate-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-400 to-accent-400"></div>
                  <div>
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Soft Elegant Theme
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Current active theme
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Features */}
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-slate-700' : 'bg-slate-50'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Features:
                </h4>
                <ul className={`text-sm space-y-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <li>• Soft blue and purple gradients</li>
                  <li>• Elegant glass morphism effects</li>
                  <li>• Reduced visual noise</li>
                  <li>• Professional appearance</li>
                </ul>
              </div>

              {/* Restore Original Button */}
              <button
                onClick={restoreOriginalTheme}
                className={`w-full p-3 rounded-lg border-2 border-dashed transition-all duration-300 ${
                  isDark
                    ? 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <RotateCcw size={16} />
                  <span>Restore Original Theme</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showThemeOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowThemeOptions(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;
