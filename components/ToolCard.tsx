
import React from 'react';
import { AITool, ToolCategory, Difficulty, Pricing } from '../types';
import { CATEGORY_COLORS } from '../constants';

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
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getPricingColor = (price: Pricing) => {
    switch (price) {
      case Pricing.FREE: return 'text-green-400 border-green-400/50';
      case Pricing.FREEMIUM: return 'text-sky-400 border-sky-400/50';
      case Pricing.PAID: return 'text-purple-400 border-purple-400/50';
      default: return 'text-slate-400 border-slate-400/50';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between cursor-pointer group hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/></svg>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_COLORS[tool.category].split(' ')[0]}`}>
               {tool.category}
             </span>
             <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">{tool.name}</h3>
          </div>
          <div className={`text-[9px] font-black border uppercase px-2 py-1 rounded-md tracking-tighter ${getPricingColor(tool.pricing)}`}>
             {tool.pricing}
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 italic font-serif">
          {tool.description}
        </p>

        <div className="flex items-center gap-3">
           <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold ${getDifficultyColor(tool.difficulty)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {tool.difficulty}
           </div>
           {tool.relations && (
             <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
               {tool.relations.length} Connections
             </div>
           )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs font-black text-sky-500 uppercase tracking-widest group-hover:tracking-[0.1em] transition-all">
          Deep Dive 
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700 group-hover:text-sky-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  );
};

export default ToolCard;
