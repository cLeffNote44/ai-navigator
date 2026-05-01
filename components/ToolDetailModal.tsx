import React, { useState, useEffect } from 'react';
import { AITool, Difficulty } from '../types';
import { getToolDetails } from '../services/aiService';
import LoadingSpinner from './LoadingSpinner';
import { AI_TOOLS, CATEGORY_COLORS } from '../constants';

interface ToolDetailModalProps {
  tool: AITool;
  onClose: () => void;
}

const CACHE_PREFIX = 'tool-details:';
const CACHE_VERSION = 'v1';

const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  const [details, setDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const cacheKey = `${CACHE_PREFIX}${CACHE_VERSION}:${tool.id}`;

    let cancelled = false;

    // Cache hit -> render instantly, no Workers AI request.
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setDetails(cached);
        setIsLoading(false);
        return;
      }
    } catch {
      // localStorage may be unavailable (private mode, quota); fall through to fetch.
    }

    setIsLoading(true);
    getToolDetails(tool.name).then((text) => {
      if (cancelled) return;
      setDetails(text);
      setIsLoading(false);
      // Only cache successful responses.
      if (text && !text.startsWith('Failed')) {
        try {
          localStorage.setItem(cacheKey, text);
        } catch {
          // Quota exceeded etc. - not fatal.
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [tool]);

  const findToolById = (id: string) => AI_TOOLS.find(t => t.id === id);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'text-emerald-400';
      case Difficulty.INTERMEDIATE: return 'text-amber-400';
      case Difficulty.ADVANCED: return 'text-rose-400';
      default: return 'text-muted-foreground';
    }
  };

  // Inline formatter: handles **bold**, *italic*, and `code` within a line.
  // Returns an array of React nodes safe to drop into a parent element.
  const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];
    // Order matters: ** before *, and we use a single combined regex so the
    // matches don't overlap.
    const pattern = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;
    let last = 0;
    let i = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) {
        tokens.push(text.slice(last, m.index));
      }
      const tok = m[0];
      if (tok.startsWith('**')) {
        tokens.push(
          <strong key={`${keyPrefix}-b-${i++}`} className="text-foreground font-semibold">
            {tok.slice(2, -2)}
          </strong>
        );
      } else if (tok.startsWith('`')) {
        tokens.push(
          <code key={`${keyPrefix}-c-${i++}`} className="font-mono text-sm bg-secondary/60 text-foreground px-1.5 py-0.5 rounded">
            {tok.slice(1, -1)}
          </code>
        );
      } else {
        tokens.push(
          <em key={`${keyPrefix}-i-${i++}`} className="italic text-foreground">
            {tok.slice(1, -1)}
          </em>
        );
      }
      last = m.index + tok.length;
    }
    if (last < text.length) tokens.push(text.slice(last));
    return tokens;
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('#')) {
        const level = (line.match(/^#+/) || ['#'])[0].length;
        const content = line.replace(/^#+\s*/, '');
        return React.createElement(
          `h${level + 2}`,
          { key: index, className: 'font-bold text-foreground mt-8 mb-4 tracking-tight border-l-4 border-primary pl-4' },
          renderInline(content, `h${index}`)
        );
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={index} className="ml-5 list-disc text-muted-foreground mb-2 leading-relaxed">
            {renderInline(line.substring(2), `li${index}`)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }
      return (
        <p key={index} className="mb-4 text-muted-foreground leading-relaxed text-lg font-medium">
          {renderInline(line, `p${index}`)}
        </p>
      );
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl px-4 py-8"
      onClick={onClose}
    >
      <div
        className="glass rounded-3xl shadow-2xl glow-accent-soft w-full max-w-5xl max-h-full flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-500 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-8 border-b border-border">
          <div className="flex items-center gap-6">
             <div className={`w-2 h-16 rounded-full ${CATEGORY_COLORS[tool.category].split(' ')[0].replace('/10', '')}`}></div>
             <div>
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-1 block">{tool.category}</span>
                <h2 className="text-4xl font-bold text-foreground tracking-tight">{tool.name}</h2>
             </div>
          </div>
          <div className="flex items-center gap-8">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Learning Curve</p>
                <p className={`font-bold uppercase tracking-tighter ${getDifficultyColor(tool.difficulty)}`}>{tool.difficulty}</p>
             </div>
             <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-all bg-secondary hover:bg-secondary/70 rounded-2xl p-3 active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 p-10 lg:p-12">
            <div className="flex items-center gap-2 mb-10">
               <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest rounded leading-none">AI Intelligence</span>
               <div className="h-px flex-1 bg-border"></div>
            </div>

            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-80 space-y-6">
                <LoadingSpinner />
                <div className="text-center">
                   <p className="text-foreground font-bold tracking-tight">Synthesizing Educational Content...</p>
                   <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-mono">Powered by Cloudflare Workers AI</p>
                </div>
              </div>
            ) : (
              <article className="animate-in fade-in duration-1000">
                {renderMarkdown(details)}
              </article>
            )}
          </div>

          <div className="p-10 lg:p-12 bg-background/50 border-t lg:border-t-0 lg:border-l border-border">
            <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-8">Ecosystem Map</h3>
            <div className="space-y-4">
              {tool.relations && tool.relations.length > 0 ? (
                tool.relations.map((rel, idx) => {
                  const targetTool = findToolById(rel.targetId);
                  return (
                    <div key={idx} className="group p-5 glass glass-hover rounded-2xl cursor-pointer">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-primary/20">{rel.type}</span>
                      </div>
                      <h4 className="text-xl font-bold text-foreground group-hover:text-gradient-subtle transition-colors">{targetTool?.name || rel.targetId}</h4>
                      {rel.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">{rel.description}</p>}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-3xl">
                   <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Isolated System</p>
                   <p className="text-muted-foreground/60 text-[10px] mt-1 px-4 leading-none font-mono">NO DOCUMENTED RELATIONS</p>
                </div>
              )}
            </div>

            <div className="mt-16 space-y-4">
               <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">Launch Site</h3>
               <a
                href={tool.website || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full p-5 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl glow-accent-soft hover:glow-accent"
               >
                  Official Site
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
               </a>
               <p className="text-[10px] text-center text-muted-foreground font-mono uppercase tracking-widest mt-4">Pricing Tier: <span className="text-foreground">{tool.pricing}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailModal;
