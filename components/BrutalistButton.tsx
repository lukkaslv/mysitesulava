
import React from 'react';

interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  type = 'button', // Default to 'button' to avoid accidental submits
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-mono text-sm font-bold uppercase transition-all duration-100 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-2 border-black bg-white text-black hover:bg-black hover:text-white",
    secondary: "border-2 border-black bg-gray-200 text-black hover:bg-black hover:text-white",
    danger: "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
  };

  return (
    <button 
      type={type}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
