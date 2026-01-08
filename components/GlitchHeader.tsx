import React from 'react';

interface GlitchHeaderProps {
  text: string;
  subtext?: string;
  className?: string;
}

const GlitchHeader: React.FC<GlitchHeaderProps> = ({ text, subtext, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="inline-block relative">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black border-b-[10px] border-black pb-3 leading-none">
          {text}
          <span className="animate-pulse ml-2 text-zinc-300">|</span>
        </h2>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-black opacity-5"></div>
      </div>
      {subtext && (
        <p className="mt-6 text-zinc-500 font-black font-mono text-sm md:text-lg tracking-[0.4em] uppercase">
          {'>'} {subtext}
        </p>
      )}
    </div>
  );
};

export default GlitchHeader;
