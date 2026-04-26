import React, { useState } from 'react';
import { AITool } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface SkillTreeProps {
  tools: AITool[];
  onToolSelect?: (tool: AITool) => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ tools, onToolSelect }) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const concepts = tools.filter(t => t.category === 'Core Concept');
  const advancedTools = tools.filter(t => t.difficulty === 'Advanced');

  const toggleCompleted = (id: string) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight">AI Skill Tree</h2>
        <p className="text-muted-foreground">Master core concepts and unlock advanced tools. Track your progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Concepts Tree */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Core Concepts <Badge variant="secondary">Foundation</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {concepts.map((concept) => (
              <div key={concept.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer" onClick={() => onToolSelect?.(concept)}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompleted(concept.id);
                  }}
                >
                  {completed.has(concept.id) ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                  <div className="font-semibold">{concept.name}</div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{concept.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {concept.difficulty}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Advanced Path */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Advanced Paths <Badge variant="destructive">Unlock After Basics</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {advancedTools.slice(0, 6).map((tool) => (
                <div key={tool.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer" onClick={() => onToolSelect?.(tool)}>
                  <div className="flex-1">
                    <div className="font-semibold">{tool.name}</div>
                    <p className="text-xs text-muted-foreground">{tool.category}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onToolSelect?.(tool)}>
                    Explore
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">Complete core concepts to unlock more advanced recommendations.</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Progress: {Math.round((completed.size / concepts.length) * 100)}% complete • Use the global Cmd+K search for instant recommendations
      </div>
    </div>
  );
};

export default SkillTree;
