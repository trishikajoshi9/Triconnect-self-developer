import React from 'react';

export interface NeumorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
  onClick?: () => void;
}

const NeumorphicContainer: React.FC<NeumorphicContainerProps> = ({ 
  children, 
  className = '', 
  inset = false, 
  onClick 
}) => {
  const baseClass = inset ? 'neumorphic-inset' : 'neumorphic-flat';
  return (
    <div 
      className={`${baseClass} rounded-2xl p-6 ${className} cursor-pointer transition-all active:scale-[0.99]`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default NeumorphicContainer;