
import React, { useState, useEffect } from 'react';
import { AITool, Difficulty, Pricing } from '../types';
import { getToolDetails } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { AI_TOOLS, CATEGORY_COLORS } from '../constants';

interface ToolDetailModalProps {
  tool: AITool;
  onClose: () => void;
}

const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  const [details, setDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      const fetchedDetails = await getToolDetails(tool.name);
      setDetails(fetchedDetails);
      setIsLoading(false);
    };

    fetchDetails();
  }, [tool]);

  const findToolById = (id: string) => AI_TOOLS.find(t => t.id === id);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'text-emerald-400';
      case Difficulty.INTERMEDIATE: return 'text-amber-400';
      case Difficulty.ADVANCED: return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('#')) {
        const level = (line.match(/^#+/) || ['#'])[0].length;
        const content = line.replace(/^#+\s*/, '');
        return React.createElement(`h${level+2}`, { key: index, className: 'font-black text-white mt-8 mb-4 uppercase tracking-tighter italic border-l-4 border-sky-600 pl-4' }, content);
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={index} className="ml-5 list-disc text-slate-400 mb-2 leading-relaxed">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }
      return <p key={index} className="mb-4 text-slate-400 leading-relaxed text-lg font-medium">{line}</p>;
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl px-4 py-8"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-5xl max-h-full flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-500 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-6">
             <div className={`w-2 h-16 rounded-full ${CATEGORY_COLORS[tool.category].split(' ')[0].replace('/10', '')}`}></div>
             <div>
                <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mb-1 block">{tool.category}</span>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{tool.name}</h2>
             </div>
          </div>
          <div className="flex items-center gap-8">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Learning Curve</p>
                <p className={`font-black uppercase tracking-tighter ${getDifficultyColor(tool.difficulty)}`}>{tool.difficulty}</p>
             </div>
             <button onClick={onClose} className="text-slate-500 hover:text-white transition-all bg-slate-800 hover:bg-slate-700 rounded-2xl p-3 active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 p-10 lg:p-12">
            <div className="flex items-center gap-2 mb-10">
               <span className="px-2 py-1 bg-sky-500/10 text-sky-500 text-[10px] font-black uppercase tracking-widest rounded leading-none">AI Intelligence</span>
               <div className="h-px flex-1 bg-slate-800"></div>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-80 space-y-6">
                <LoadingSpinner />
                <div className="text-center">
                   <p className="text-white font-bold tracking-tight">Synthesizing Educational Content...</p>
                   <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Powered by Gemini Large Language Models</p>
                </div>
              </div>
            ) : (
              <article className="animate-in fade-in duration-1000">
                {renderMarkdown(details)}
              </article>
            )}
          </div>

          <div className="p-10 lg:p-12 bg-slate-950/50 border-t lg:border-t-0 lg:border-l border-slate-800">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Ecosystem Map</h3>
            <div className="space-y-4">
              {tool.relations && tool.relations.length > 0 ? (
                tool.relations.map((rel, idx) => {
                  const targetTool = findToolById(rel.targetId);
                  return (
                    <div key={idx} className="group p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-sky-500/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-[9px] font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-sky-500/20">{rel.type}</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-200 group-hover:text-white transition-colors italic">{targetTool?.name || rel.targetId}</h4>
                      {rel.description && <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{rel.description}</p>}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">
                   <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Isolated System</p>
                   <p className="text-slate-700 text-[10px] mt-1 px-4 leading-none">NO DOCUMENTED RELATIONS</p>
                </div>
              )}
            </div>

            <div className="mt-16 space-y-4">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Launch Site</h3>
               <a 
                href={tool.website || "#"} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between w-full p-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
               >
                  Official Site
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
               </a>
               <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest mt-4">Pricing Tier: <span className="text-slate-400">{tool.pricing}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailModal;
