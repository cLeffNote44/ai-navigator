import React, { useState } from 'react';
import { AITool, TechStack, Difficulty } from '../types';
import { generateGuidedStack } from '../services/aiService';
import LoadingSpinner from './LoadingSpinner';

interface PathfinderProps {
  tools: AITool[];
}

const Pathfinder: React.FC<PathfinderProps> = ({ tools }) => {
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<TechStack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const stack = await generateGuidedStack(goal, tools);
      setResult(stack);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const presetGoals = [
    "Build an AI customer service chatbot",
    "Analyze sentiment of social media posts",
    "Create an AI personal assistant for my emails",
    "Generate personalized product descriptions for an e-commerce site"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">
          AI Architecture <span className="text-sky-500">Pathfinder</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Not sure where to start? Tell us your goal, and we'll architect the perfect beginner-friendly tech stack for you.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
           <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/></svg>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">What are you building?</label>
            <input 
              type="text" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. A system that summarizes my physical mail using AI"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium text-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
             {presetGoals.map((g, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => setGoal(g)}
                  className="px-3 py-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-400 hover:text-slate-200 transition-all"
                >
                  {g}
                </button>
             ))}
          </div>

          <button 
            type="submit" 
            disabled={isGenerating || !goal.trim()}
            className="w-full py-4 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-sky-900/20 active:scale-[0.98]"
          >
            {isGenerating ? 'Architecting your path...' : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
           <LoadingSpinner />
           <div className="text-center animate-pulse">
              <p className="text-slate-200 font-bold">Consulting LLM Experts...</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Optimizing for Beginner Clarity</p>
           </div>
        </div>
      )}

      {result && !isGenerating && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                   <span className="bg-sky-500 px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-2 inline-block">Architecture Blueprint</span>
                   <h3 className="text-4xl font-black text-white italic">{result.stackName}</h3>
                </div>
                <div className="flex gap-4">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Difficulty</p>
                      <p className="text-sky-400 font-bold">{result.difficulty}</p>
                   </div>
                   <div className="text-right border-l border-slate-800 pl-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Est. Cost</p>
                      <p className="text-emerald-400 font-bold">{result.estimatedCost}</p>
                   </div>
                </div>
             </div>
             
             <p className="text-lg text-slate-400 leading-relaxed max-w-3xl border-l-2 border-sky-500 pl-6 my-8">
                {result.description}
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.tools.map((t, i) => (
                  <div key={i} className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-sky-500/50 transition-all">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 font-black">
                           {i + 1}
                        </div>
                        <h4 className="text-xl font-bold text-white">{t.name}</h4>
                     </div>
                     <p className="text-sm text-slate-500 leading-relaxed">{t.justification}</p>
                  </div>
                ))}
             </div>

             {result.connections && (
               <div className="mt-12 pt-8 border-t border-slate-800/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Execution Flow</h4>
                  <div className="space-y-4">
                    {result.connections.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <span className="text-slate-300 font-bold">{c.from}</span>
                        <div className="flex-1 h-px bg-slate-800 relative">
                           <div className="absolute inset-0 flex items-center justify-center">
                              <span className="px-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-600 font-black uppercase tracking-tighter translate-y-[-1px]">
                                 {c.label}
                              </span>
                           </div>
                        </div>
                        <span className="text-slate-300 font-bold">{c.to}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>
          
          <div className="bg-sky-600 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
                <h4 className="text-2xl font-black text-white italic">Ready to start building?</h4>
                <p className="text-sky-100 opacity-80">We've selected these tools because they have the best documentation for beginners.</p>
             </div>
             <button className="px-8 py-4 bg-white text-sky-600 font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform whitespace-nowrap shadow-xl">
                Get Documentation Pack
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pathfinder;
