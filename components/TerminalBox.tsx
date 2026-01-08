import React from 'react';

interface TerminalBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const TerminalBox: React.FC<TerminalBoxProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`border-4 border-black bg-white relative hover:bg-zinc-50 transition-colors duration-300 ${className}`}>
      {/* Title Bar */}
      <div className="flex justify-between items-center border-b-4 border-black h-12 px-4 bg-black text-white">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black">
          [{title}]
        </span>
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-zinc-600 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-zinc-400 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Decorative corners - only on hover for more clean look */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-black"></div>
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-black"></div>
    </div>
  );
};

export default TerminalBox;
