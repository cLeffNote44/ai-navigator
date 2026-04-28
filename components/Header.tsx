import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export type ActiveTab = 'pathfinder' | 'explorer' | 'tools' | 'concepts' | 'dashboard';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onToolSelect?: (tool: any) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
        <a
          href="https://leffel.io/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          leffel.io / projects
        </a>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Button
            variant="ghost"
            className="flex items-center gap-3 group p-0 hover:bg-transparent"
            onClick={() => setActiveTab('pathfinder')}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glass glow-accent-soft group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Navigator</h1>
              <p className="text-[10px] font-mono text-primary uppercase tracking-widest -mt-0.5">Beginner Resource</p>
            </div>
          </Button>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="w-full md:w-auto">
            <TabsList className="glass p-1 rounded-2xl h-auto">
              <TabsTrigger
                value="pathfinder"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
              >
                Pathfinder
              </TabsTrigger>
              <TabsTrigger
                value="explorer"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
              >
                Ecosystem
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
              >
                Library
              </TabsTrigger>
              <TabsTrigger
                value="concepts"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
              >
                Concepts
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
              >
                Dashboard
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
};

export default Header;
