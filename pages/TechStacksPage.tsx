
import React, { useState, useMemo } from 'react';
import { AITool, ToolCategory, TechStack, TechStackTool } from '../types';
import { generateTechStack } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORY_COLORS, AI_TOOLS } from '../constants';

interface TechStacksPageProps {
  tools: AITool[];
}

const CategoryCheckbox: React.FC<{
  category: ToolCategory;
  isChecked: boolean;
  onChange: (category: ToolCategory, isChecked: boolean) => void;
}> = ({ category, isChecked, onChange }) => (
  <label
    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
      isChecked ? 'bg-sky-500/20 border-sky-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
    }`}
  >
    <input
      type="checkbox"
      checked={isChecked}
      onChange={e => onChange(category, e.target.checked)}
      className="h-5 w-5 rounded bg-slate-700 border-slate-600 text-sky-600 focus:ring-sky-500"
    />
    <span className="font-medium text-slate-200">{category}</span>
  </label>
);

const StackResultCard: React.FC<{ stack: TechStack }> = ({ stack }) => {
    const findToolById = (id: string) => AI_TOOLS.find(tool => tool.id === id);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-2xl font-black text-white italic truncate">{stack.stackName}</h3>
            <p className="mt-2 text-slate-400">{stack.description}</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {stack.tools.map(tool => {
                    const fullTool = findToolById(tool.id);
                    return (
                        <div key={tool.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                               <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/></svg>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-bold text-slate-100">{tool.name}</h4>
                                {fullTool && <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[fullTool.category]}`}>{fullTool.category}</span>}
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">{tool.justification}</p>
                        </div>
                    )
                })}
            </div>

            {stack.connections && stack.connections.length > 0 && (
                <div className="mt-12 bg-slate-950/50 rounded-xl p-6 border border-slate-800">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                       <span className="w-1 h-1 bg-sky-500 rounded-full mr-2"></span>
                       Architectural Flow & Integration
                    </h4>
                    <div className="space-y-3">
                        {stack.connections.map((conn, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                                <span className="text-sky-400 font-bold">{findToolById(conn.from)?.name || conn.from}</span>
                                <div className="flex-1 mx-4 border-t border-dashed border-slate-700 relative">
                                   <div className="absolute left-1/2 -top-3 px-2 bg-slate-900 text-[10px] font-medium text-slate-500 border border-slate-800 rounded whitespace-nowrap">
                                      {conn.label}
                                   </div>
                                </div>
                                <span className="text-sky-400 font-bold">{findToolById(conn.to)?.name || conn.to}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const TechStacksPage: React.FC<TechStacksPageProps> = ({ tools }) => {
  const [selectedCategories, setSelectedCategories] = useState<Set<ToolCategory>>(new Set());
  const [generatedStack, setGeneratedStack] = useState<TechStack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allCategories = useMemo(() =>
    Object.values(ToolCategory).sort()
  , []);

  const handleCategoryChange = (category: ToolCategory, isChecked: boolean) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(category);
      } else {
        newSet.delete(category);
      }
      return newSet;
    });
  };

  const handleGenerateStack = async () => {
    if (selectedCategories.size === 0) {
      setError("Please select at least one category.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedStack(null);
    try {
      const stack = await generateTechStack(Array.from(selectedCategories), tools);
      setGeneratedStack(stack);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Generate a Tech Stack</h2>
        <p className="mt-2 text-lg text-slate-400">
          Select the capabilities your project needs, and our AI architect will propose a powerful, modern tech stack for you.
        </p>
      </div>

      <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg">
        <h3 className="text-xl font-bold text-slate-200 mb-4">1. Select Project Capabilities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.map(category => (
            <CategoryCheckbox
              key={category}
              category={category}
              isChecked={selectedCategories.has(category)}
              onChange={handleCategoryChange}
            />
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleGenerateStack}
          disabled={isLoading || selectedCategories.size === 0}
          className="bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-sky-500 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-3">Generating Stack...</span>
            </>
          ) : (
            '✨ Generate Stack with AI'
          )}
        </button>
      </div>

      {error && <div className="mt-4 text-center p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">{error}</div>}
      
      {generatedStack && <StackResultCard stack={generatedStack} />}
    </div>
  );
};

export default TechStacksPage;
