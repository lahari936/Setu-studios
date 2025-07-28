import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: boolean;
  glowOnHover?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  hoverScale = true, 
  glowOnHover = true 
}) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        transition-all duration-300 cursor-pointer
        ${hoverScale ? 'hover:scale-105' : ''}
        ${glowOnHover && isHovered ? 'shadow-2xl shadow-orange-500/20' : ''}
        ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        border rounded-xl p-6
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;