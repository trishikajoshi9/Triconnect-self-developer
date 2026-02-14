
import React from 'react';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const NeumorphicButton: React.FC<Props> = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button',
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`neumorphic-button rounded-xl px-4 py-2 font-medium text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default NeumorphicButton;
