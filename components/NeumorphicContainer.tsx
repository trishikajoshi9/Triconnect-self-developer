
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
  onClick?: () => void;
}

const NeumorphicContainer: React.FC<Props> = ({ children, className = '', inset = false, onClick }) => {
  const baseClass = inset ? 'neumorphic-inset' : 'neumorphic-flat';
  return (
    <div 
      className={`${baseClass} rounded-2xl p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default NeumorphicContainer;
