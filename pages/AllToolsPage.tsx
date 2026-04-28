import React, { useState, useMemo } from 'react';
import { AITool, ToolCategory, Difficulty, Pricing } from '../types';
import ToolCard from '../components/ToolCard';
import ToolDetailModal from '../components/ToolDetailModal';

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
          <h2 className="text-4xl font-bold text-foreground tracking-tight">
            The AI Navigator <span className="text-gradient-subtle">Library</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive list of AI tools, platforms, and frameworks. Filter by difficulty to find tools that match your current skillset.
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-30 glass border-y border-border py-6 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-none">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="w-full lg:w-96 relative">
            <input
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border">
                {['All', ...Object.values(Difficulty)].map(d => (
                  <button
                    key={d}
                    onClick={() => setDiffFilter(d as any)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${diffFilter === d ? 'bg-primary text-primary-foreground glow-accent-soft' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {d}
                  </button>
                ))}
             </div>

             <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border">
                {['All', ...Object.values(Pricing)].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p as any)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${priceFilter === p ? 'bg-emerald-500 text-background' : 'text-muted-foreground hover:text-foreground'}`}
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
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-full border transition-all duration-200 ${selectedCategories.has(category) ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
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
         <div className="text-center py-32 border-2 border-dashed border-border rounded-3xl">
            <h3 className="text-2xl font-bold text-muted-foreground">Zero matches found</h3>
            <p className="text-muted-foreground/60 mt-2">Try broadening your criteria.</p>
        </div>
      )}

      {selectedTool && (
        <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  );
};

export default AllToolsPage;
