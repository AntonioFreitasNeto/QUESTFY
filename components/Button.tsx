import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'gold';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Game Style: Thick bottom border for 3D effect, rounded-xl, uppercase font
  const baseStyles = "py-3 px-6 rounded-xl font-extrabold tracking-wide transition-all duration-100 uppercase transform active:translate-y-1";
  
  const variants = {
    primary: "bg-indigo-600 text-white border-b-4 border-indigo-900 hover:bg-indigo-500 hover:border-indigo-800 shadow-lg shadow-indigo-500/30",
    secondary: "bg-slate-700 text-slate-200 border-b-4 border-slate-900 hover:bg-slate-600",
    outline: "bg-transparent border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10",
    danger: "bg-red-500 text-white border-b-4 border-red-800 hover:bg-red-400",
    gold: "bg-yellow-400 text-yellow-900 border-b-4 border-yellow-700 hover:bg-yellow-300 shadow-lg shadow-yellow-500/30"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = props.disabled ? "opacity-50 cursor-not-allowed active:translate-y-0 border-b-4" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};