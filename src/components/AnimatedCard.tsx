import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: boolean;
  glowOnHover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'modern' | 'floating';
  padding?: 'sm' | 'md' | 'lg';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  hoverScale = true, 
  glowOnHover = true,
  onClick,
  variant = 'default',
  padding = 'md'
}) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'modern':
        return 'modern-card';
      case 'floating':
        return 'floating-card';
      default:
        return `
          transition-all duration-300 cursor-pointer
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
          border rounded-xl
        `;
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getHoverClasses = () => {
    if (variant === 'modern' || variant === 'floating') {
      return '';
    }
    return `
      ${hoverScale ? 'hover:scale-105' : ''}
      ${glowOnHover && isHovered ? 'shadow-2xl shadow-orange-500/20' : ''}
    `;
  };

  return (
    <div
      className={`
        ${getVariantClasses()}
        ${getPaddingClasses()}
        ${getHoverClasses()}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;