import React from 'react';
import { AITool, Difficulty, Pricing } from '../types';

interface ToolCardProps {
  tool: AITool;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'text-emerald-400 bg-emerald-400/10';
      case Difficulty.INTERMEDIATE: return 'text-amber-400 bg-amber-400/10';
      case Difficulty.ADVANCED: return 'text-rose-400 bg-rose-400/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPricingColor = (price: Pricing) => {
    switch (price) {
      case Pricing.FREE: return 'text-emerald-400 border-emerald-400/40';
      case Pricing.FREEMIUM: return 'text-cyan-400 border-cyan-400/40';
      case Pricing.PAID: return 'text-pink-400 border-pink-400/40';
      default: return 'text-muted-foreground border-border';
    }
  };

  return (
    <div
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <svg className="w-12 h-12 text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/></svg>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
               {tool.category}
             </span>
             <h3 className="text-xl font-semibold text-foreground group-hover:text-gradient-subtle transition-colors">{tool.name}</h3>
          </div>
          <div className={`text-[9px] font-mono border uppercase px-2 py-1 rounded-md tracking-tighter ${getPricingColor(tool.pricing)}`}>
             {tool.pricing}
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        <div className="flex items-center gap-3">
           <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold ${getDifficultyColor(tool.difficulty)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {tool.difficulty}
           </div>
           {tool.relations && (
             <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
               {tool.relations.length} Connections
             </div>
           )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs font-mono text-primary uppercase tracking-widest group-hover:tracking-[0.1em] transition-all">
          Deep Dive
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  );
};

export default ToolCard;
