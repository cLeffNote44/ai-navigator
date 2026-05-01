import React, { useState, useEffect } from 'react';
import { AI_TOOLS } from '../constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Trophy, Target, BookOpen } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#f472b6', '#22c55e'];

const DashboardPage: React.FC = () => {
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  const [savedStacks, setSavedStacks] = useState<any[]>([]);

  // Load from localStorage for demo persistence
  useEffect(() => {
    const savedCompleted = localStorage.getItem('completedTools');
    if (savedCompleted) setCompletedTools(JSON.parse(savedCompleted));

    const saved = localStorage.getItem('savedStacks');
    if (saved) setSavedStacks(JSON.parse(saved));
  }, []);

  const saveProgress = (tools: string[]) => {
    setCompletedTools(tools);
    localStorage.setItem('completedTools', JSON.stringify(tools));
  };

  const progress = Math.round((completedTools.length / AI_TOOLS.length) * 100);

  // Mock data for charts
  const categoryData = [
    { name: 'LLM', value: 35, fill: COLORS[0] },
    { name: 'RAG', value: 25, fill: COLORS[1] },
    { name: 'Agents', value: 20, fill: COLORS[2] },
    { name: 'Tools', value: 20, fill: COLORS[3] },
  ];

  const difficultyData = [
    { difficulty: 'Beginner', completed: 12, total: 15 },
    { difficulty: 'Intermediate', completed: 8, total: 25 },
    { difficulty: 'Advanced', completed: 3, total: 18 },
  ];

  const recommendedNext = AI_TOOLS
    .filter(t => !completedTools.includes(t.id))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">AI Navigator Dashboard</h1>
          <p className="text-muted-foreground text-xl mt-2">Track progress, review saved stacks, and get personalized recommendations.</p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black text-primary tabular-nums">{progress}<span className="text-2xl align-super">%</span></div>
          <div className="text-sm text-muted-foreground -mt-2">OVERALL MASTERY</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress Overview */}
        <div className="lg:col-span-7 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-primary" /> Skill Mastery
              </CardTitle>
              <CardDescription>Progress across difficulty levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {difficultyData.map((item, index) => {
                  const pct = Math.round((item.completed / item.total) * 100);
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{item.difficulty}</span>
                        <span className="font-mono text-muted-foreground">{item.completed}/{item.total}</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.value}% of focus</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recommendations & Saved */}
        <div className="lg:col-span-5 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" /> Next Recommended
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedNext.map(tool => (
                <div key={tool.id} className="flex gap-4 items-center p-4 border rounded-2xl hover:border-primary/50 cursor-pointer" onClick={() => { /* open modal */ }}>
                  <div className="shrink-0">
                    <Badge variant="outline">{tool.difficulty}</Badge>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{tool.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{tool.description}</div>
                  </div>
                  <Button variant="ghost" size="sm">Add to Path</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Saved Stacks ({savedStacks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedStacks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Your saved stacks will appear here. Generate one in the Stack Builder.
                </div>
              ) : (
                <div className="space-y-3">
                  {savedStacks.map((stack, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-medium">{stack.stackName}</div>
                        <div className="text-xs text-muted-foreground">{stack.tools.length} tools • {stack.difficulty}</div>
                      </div>
                      <Button variant="outline" size="sm">Load</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pt-8 border-t">
        Data is persisted in browser localStorage for this demo. Connect to Supabase in production for cloud sync.
      </div>
    </div>
  );
};

export default DashboardPage;
