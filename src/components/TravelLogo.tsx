import React from 'react';
import wanderlyIcon from '../assets/icons/wanderly-icon-v2.png';

interface TravelLogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const TravelLogoIcon: React.FC<TravelLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  alt = "Wanderly Icon" 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img 
      src={wanderlyIcon} 
      alt={alt}
      style={style}
      className={`rounded-full object-cover flex-shrink-0 shadow-sm ${className}`}
    />
  );
};

export default TravelLogoIcon;
