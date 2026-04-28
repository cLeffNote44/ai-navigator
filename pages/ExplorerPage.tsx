
import React, { useState } from 'react';
import { AITool } from '../types';
import RelationMap from '../components/RelationMap';
import ToolDetailModal from '../components/ToolDetailModal';
import ToolCard from '../components/ToolCard';

interface ExplorerPageProps {
  tools: AITool[];
  onToolSelect?: (tool: AITool) => void;
}

const ExplorerPage: React.FC<ExplorerPageProps> = ({ tools, onToolSelect }) => {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  const handleToolClick = (tool: AITool) => {
    setSelectedTool(tool);
    onToolSelect?.(tool);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">AI Navigator <span className="text-gradient-subtle">Explorer</span></h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
            Visualize the relations between AI models, frameworks, and infrastructure.
            See how technologies interconnect to form complete tech stacks. Press <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-xs">⌘K</span> for global search.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <RelationMap tools={tools} onToolClick={handleToolClick} />
        </div>

        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              Discovery Panel
            </h3>
            {selectedTool ? (
              <div className="space-y-4">
                <ToolCard tool={selectedTool} onClick={() => handleToolClick(selectedTool)} />
                <button
                  onClick={() => setSelectedTool(null)}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
                <p className="text-muted-foreground text-sm italic">
                  Click on a node in the map to see its details and connections.
                </p>
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-6">
            <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Legend</h4>
            <div className="space-y-4">
               <div className="flex items-center text-[10px] font-mono text-foreground uppercase tracking-widest">
                  <span className="w-3 h-3 rounded-full mr-3 shadow-[0_0_8px_rgba(167,139,250,0.6)]" style={{ background: '#a78bfa' }}></span>
                  Core Concepts
               </div>
               <div className="flex items-center text-[10px] font-mono uppercase tracking-widest" style={{ color: '#8b5cf6' }}>
                  <span className="w-3 h-3 rounded-full mr-3" style={{ background: '#8b5cf6' }}></span>
                  Language Models
               </div>
               <div className="flex items-center text-[10px] font-mono uppercase tracking-widest" style={{ color: '#06b6d4' }}>
                  <span className="w-3 h-3 rounded-full mr-3" style={{ background: '#06b6d4' }}></span>
                  Infrastructure
               </div>
               <div className="flex items-center text-[10px] font-mono uppercase tracking-widest" style={{ color: '#f472b6' }}>
                  <span className="w-3 h-3 rounded-full mr-3" style={{ background: '#f472b6' }}></span>
                  Frameworks
               </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTool && (
        <ToolDetailModal 
          tool={selectedTool} 
          onClose={() => setSelectedTool(null)} 
        />
      )}
    </div>
  );
};

export default ExplorerPage;
