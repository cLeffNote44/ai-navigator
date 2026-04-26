import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sparkles, Sun, Moon } from 'lucide-react';

export type ActiveTab = 'pathfinder' | 'explorer' | 'tools' | 'concepts' | 'dashboard';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onToolSelect?: (tool: any) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isDark, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 py-6 px-4 sm:px-8 max-w-7xl mx-auto border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 group p-0 hover:bg-transparent"
          onClick={() => setActiveTab('pathfinder')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tighter text-foreground">AI Navigator</h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest -mt-0.5">Beginner Resource</p>
          </div>
        </Button>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="w-full md:w-auto">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto">
            <TabsTrigger 
              value="pathfinder" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
            >
              Pathfinder
            </TabsTrigger>
            <TabsTrigger 
              value="explorer" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
            >
              Ecosystem
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
            >
              Library
            </TabsTrigger>
            <TabsTrigger 
              value="concepts" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
            >
              Concepts
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
            >
              Dashboard
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="ml-2"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
