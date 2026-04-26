
import React, { useState, useMemo } from 'react';
import { AITool, ToolCategory, Difficulty, Pricing } from '../types';
import ToolCard from '../components/ToolCard';
import ToolDetailModal from '../components/ToolDetailModal';
import { CATEGORY_COLORS } from '../constants';

interface AllToolsPageProps {
  tools: AITool[];
  onToolSelect?: (tool: AITool) => void;
}

const AllToolsPage: React.FC<AllToolsPageProps> = ({ tools }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<ToolCategory>>(new Set());
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'All'>('All');
  const [priceFilter, setPriceFilter] = useState<Pricing | 'All'>('All');

  const allCategories = useMemo(() =>
    Object.values(ToolCategory).sort((a, b) => a.localeCompare(b))
  , []);

  const handleCategoryToggle = (category: ToolCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      return newSet;
    });
  };

  const filteredTools = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return tools.filter(tool => {
      const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(tool.category);
      const matchesDiff = diffFilter === 'All' || tool.difficulty === diffFilter;
      const matchesPrice = priceFilter === 'All' || tool.pricing === priceFilter;
      const matchesSearch = !searchTerm ||
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower);

      return matchesCategory && matchesDiff && matchesPrice && matchesSearch;
    });
  }, [tools, searchTerm, selectedCategories, diffFilter, priceFilter]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">
            The AI Navigator <span className="text-primary">Library</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            A comprehensive list of AI tools, platforms, and frameworks. Filter by difficulty to find tools that match your current skillset.
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-slate-900/60 backdrop-blur-xl border-y border-slate-800 py-6 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="w-full lg:w-96 relative">
            <input
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['All', ...Object.values(Difficulty)].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDiffFilter(d as any)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${diffFilter === d ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {d}
                  </button>
                ))}
             </div>
             
             <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['All', ...Object.values(Pricing)].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPriceFilter(p as any)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${priceFilter === p ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {p}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all duration-200 ${selectedCategories.has(category) ? 'bg-white text-slate-900 border-white' : 'bg-slate-950 text-slate-600 border-slate-800 hover:border-slate-600'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} onClick={() => setSelectedTool(tool)} />
        ))}
      </div>

      {filteredTools.length === 0 && (
         <div className="text-center py-32 border-2 border-dashed border-slate-800 rounded-3xl">
            <h3 className="text-2xl font-black text-slate-600 uppercase italic">Zero matches found</h3>
            <p className="text-slate-700 mt-2">The AI models couldn't find anything that fits these constraints. Try broadening your criteria.</p>
        </div>
      )}

      {selectedTool && (
        <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  );
};

export default AllToolsPage;
