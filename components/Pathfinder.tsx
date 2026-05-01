import React, { useState } from 'react';
import { AITool, TechStack } from '../types';
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
  const [isSaved, setIsSaved] = useState(false);

  const saveStack = () => {
    if (!result) return;
    try {
      const existing = JSON.parse(localStorage.getItem('savedStacks') || '[]') as TechStack[];
      // Don't double-save the same id.
      if (existing.some((s) => s.id === result.id)) {
        setIsSaved(true);
        return;
      }
      const next = [...existing, result];
      localStorage.setItem('savedStacks', JSON.stringify(next));
      setIsSaved(true);
    } catch {
      // localStorage unavailable; degrade silently.
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const stack = await generateGuidedStack(goal, tools);
      setResult(stack);
      setIsSaved(false);
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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 gradient-mesh">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">
          AI Architecture <span className="text-gradient-subtle">Pathfinder</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Not sure where to start? Tell us your goal, and we'll architect the perfect beginner-friendly tech stack for you.
        </p>
      </div>

      <div className="glass rounded-2xl p-8 relative overflow-hidden group glass-hover">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
           <svg className="w-32 h-32 text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/></svg>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest ml-1">What are you building?</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. A system that summarizes my physical mail using AI"
              className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
             {presetGoals.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGoal(g)}
                  className="px-3 py-1 bg-secondary/50 hover:bg-secondary border border-border rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  {g}
                </button>
             ))}
          </div>

          <button
            type="submit"
            disabled={isGenerating || !goal.trim()}
            className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-secondary disabled:text-muted-foreground text-primary-foreground font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg glow-accent-soft hover:glow-accent active:scale-[0.98]"
          >
            {isGenerating ? 'Architecting your path...' : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-6 bg-destructive/10 border-2 border-destructive/40 rounded-2xl text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <p className="text-destructive font-semibold text-base">Couldn't generate a roadmap</p>
          </div>
          <p className="text-destructive/90 text-sm max-w-md mx-auto">{error}</p>
          <button
            onClick={() => {
              setError(null);
              handleGenerate({ preventDefault: () => {} } as React.FormEvent);
            }}
            disabled={isGenerating || !goal.trim()}
            className="px-5 py-2 bg-destructive/20 hover:bg-destructive/30 border border-destructive/40 text-destructive font-bold uppercase tracking-widest rounded-lg text-xs transition-colors disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
           <LoadingSpinner />
           <div className="text-center animate-pulse">
              <p className="text-foreground font-bold">Consulting LLM Experts...</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-mono">Optimizing for Beginner Clarity</p>
           </div>
        </div>
      )}

      {result && !isGenerating && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
          <div className="glass rounded-3xl p-8 relative overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                   <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-mono text-primary-foreground uppercase tracking-tighter mb-2 inline-block">Architecture Blueprint</span>
                   <h3 className="text-4xl font-bold">{result.stackName}</h3>
                </div>
                <div className="flex gap-4">
                   <div className="text-right">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">Difficulty</p>
                      <p className="text-primary font-bold">{result.difficulty}</p>
                   </div>
                   <div className="text-right border-l border-border pl-4">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">Est. Cost</p>
                      <p className="text-emerald-400 font-bold">{result.estimatedCost}</p>
                   </div>
                </div>
             </div>

             <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl border-l-2 border-primary pl-6 my-8">
                {result.description}
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.tools.map((t, i) => (
                  <div key={i} className="p-6 bg-background/50 border border-border rounded-2xl group hover:border-primary/50 transition-all">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                           {i + 1}
                        </div>
                        <h4 className="text-xl font-bold text-foreground">{t.name}</h4>
                     </div>
                     <p className="text-sm text-muted-foreground leading-relaxed">{t.justification}</p>
                  </div>
                ))}
             </div>

             {result.connections && (
               <div className="mt-12 pt-8 border-t border-border">
                  <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-6">Execution Flow</h4>
                  <div className="space-y-4">
                    {result.connections.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <span className="text-foreground font-bold">{c.from}</span>
                        <div className="flex-1 h-px bg-border relative">
                           <div className="absolute inset-0 flex items-center justify-center">
                              <span className="px-2 bg-card border border-border rounded text-[9px] text-muted-foreground font-mono uppercase tracking-tighter translate-y-[-1px]">
                                 {c.label}
                              </span>
                           </div>
                        </div>
                        <span className="text-foreground font-bold">{c.to}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>

          <div className="bg-primary p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 glow-accent">
             <div>
                <h4 className="text-2xl font-bold text-primary-foreground">Ready to start building?</h4>
                <p className="text-primary-foreground/80">Save this stack to your dashboard or check the tool docs to keep going.</p>
             </div>
             <button
               onClick={saveStack}
               disabled={isSaved}
               className="px-8 py-4 bg-background text-primary font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform whitespace-nowrap shadow-xl disabled:opacity-70 disabled:hover:scale-100"
             >
                {isSaved ? '✓ Saved to Dashboard' : 'Save This Stack'}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pathfinder;
