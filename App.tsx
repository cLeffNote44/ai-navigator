import React, { useState } from 'react';
import Header, { ActiveTab } from './components/Header';
import AllToolsPage from './pages/AllToolsPage';
import ExplorerPage from './pages/ExplorerPage';
import ConceptsPage from './pages/ConceptsPage';
import Pathfinder from './components/Pathfinder';
import DashboardPage from './pages/DashboardPage';
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pathfinder');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [openCommand, setOpenCommand] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage or system preference
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Global Cmd/Ctrl + K for semantic search
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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onToolSelect={handleToolSelect} isDark={isDark} toggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {activeTab === 'pathfinder' && <Pathfinder tools={AI_TOOLS} />}
        {activeTab === 'explorer' && <ExplorerPage tools={AI_TOOLS} onToolSelect={handleToolSelect} />}
        {activeTab === 'tools' && <AllToolsPage tools={AI_TOOLS} onToolSelect={handleToolSelect} />}
        {activeTab === 'concepts' && <ConceptsPage tools={AI_TOOLS} onToolSelect={handleToolSelect} />}
        {activeTab === 'dashboard' && <DashboardPage />}
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
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                 <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
              <span className="font-black text-muted-foreground uppercase tracking-widest text-xs">AI Navigator</span>
           </div>
           <div className="flex gap-8 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">Community</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
