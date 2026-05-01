import React, { useState, lazy, Suspense } from 'react';
import Header, { ActiveTab } from './components/Header';
import AllToolsPage from './pages/AllToolsPage';
import ConceptsPage from './pages/ConceptsPage';
import Pathfinder from './components/Pathfinder';
import LoadingSpinner from './components/LoadingSpinner';
import ToolDetailModal from './components/ToolDetailModal';
import { AI_TOOLS } from './constants';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './components/ui/command';
import { AITool } from './types';

// Code-split heavy pages: Explorer pulls in d3, Dashboard pulls in recharts.
// Keeps the initial bundle ~150 kB lighter.
const ExplorerPage = lazy(() => import('./pages/ExplorerPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const PageFallback = () => (
  <div className="flex items-center justify-center py-32">
    <LoadingSpinner />
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pathfinder');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [openCommand, setOpenCommand] = useState(false);

  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleToolSelect = (tool: AITool) => {
    setSelectedTool(tool);
    setOpenCommand(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 bg-grid">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onToolSelect={handleToolSelect} />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {activeTab === 'pathfinder' && <Pathfinder tools={AI_TOOLS} />}
        {activeTab === 'explorer' && (
          <Suspense fallback={<PageFallback />}>
            <ExplorerPage tools={AI_TOOLS} onToolSelect={handleToolSelect} />
          </Suspense>
        )}
        {activeTab === 'tools' && <AllToolsPage tools={AI_TOOLS} onToolSelect={handleToolSelect} />}
        {activeTab === 'concepts' && <ConceptsPage tools={AI_TOOLS} onToolSelect={handleToolSelect} />}
        {activeTab === 'dashboard' && (
          <Suspense fallback={<PageFallback />}>
            <DashboardPage />
          </Suspense>
        )}
      </main>

      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}

      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder="Search tools, concepts, or ask for recommendations..." />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          <CommandGroup heading="All Tools">
            {AI_TOOLS.map((tool) => (
              <CommandItem
                key={tool.id}
                onSelect={() => handleToolSelect(tool)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-mono text-xs text-muted-foreground">{tool.category}</span>
                  <span>{tool.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">{tool.difficulty}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <footer className="mt-20 border-t border-border py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-mono text-muted-foreground uppercase tracking-widest text-xs">AI Navigator</span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            <a href="https://leffel.io" className="hover:text-primary transition-colors">leffel.io</a>
            <a href="https://leffel.io/projects" className="hover:text-primary transition-colors">More Projects</a>
            <a href="https://github.com/cLeffNote44/ai-navigator" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
