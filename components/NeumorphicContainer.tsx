
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}

const NeumorphicContainer: React.FC<Props> = ({ children, className = '', inset = false }) => {
  const baseClass = inset ? 'neumorphic-inset' : 'neumorphic-flat';
  return (
    <div className={`${baseClass} rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export default NeumorphicContainer;
