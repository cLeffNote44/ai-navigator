import React, { useState, useMemo } from 'react';
import { AITool, TechStack } from '../types';
import { generateGuidedStack } from '../services/geminiService';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Plus, Trash2, Play, Download } from 'lucide-react';
import { AI_TOOLS } from '../constants';

interface SortableToolProps {
  tool: AITool;
  onRemove: (id: string) => void;
}

const SortableTool = ({ tool, onRemove }: SortableToolProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between bg-card border border-border p-4 rounded-xl cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono text-xs">
          {tool.category}
        </Badge>
        <div>
          <div className="font-semibold">{tool.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-1">{tool.description}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(tool.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

const StackBuilder: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [stackTools, setStackTools] = useState<AITool[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<TechStack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const availableTools = useMemo(() => {
    return AI_TOOLS.filter(tool => !stackTools.some(t => t.id === tool.id));
  }, [stackTools]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeTool = AI_TOOLS.find(t => t.id === active.id);
      if (activeTool && !stackTools.some(t => t.id === activeTool.id)) {
        setStackTools((items) => [...items, activeTool]);
      }
    }
  };

  const removeTool = (id: string) => {
    setStackTools(stackTools.filter(tool => tool.id !== id));
  };

  const generateStack = async () => {
    if (!goal.trim() || stackTools.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const generated = await generateGuidedStack(goal, stackTools);
      setResult(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate stack');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setStackTools([]);
    setGoal('');
    setResult(null);
    setError(null);
  };

  const exportStack = () => {
    if (!result) return;
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `stack-${result.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-5xl font-black tracking-tighter text-foreground">AI Navigator Stack Builder</h2>
        <p className="mt-3 text-xl text-muted-foreground max-w-2xl mx-auto">
          Drag tools into your stack. Get AI-powered compatibility scoring, simulation, and export.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Available Tools Palette */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Tool Palette <Badge variant="secondary">{availableTools.length} available</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
              {availableTools.map(tool => (
                <div
                  key={tool.id}
                  className="p-3 bg-muted/50 rounded-xl border border-border flex items-center gap-3 cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', tool.id);
                  }}
                >
                  <Badge variant="outline" className="text-xs font-mono shrink-0">
                    {tool.category.slice(0, 4)}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tool.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{tool.description}</div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {tool.difficulty}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Builder Area */}
        <div className="lg:col-span-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Stack</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={reset}>
                      Reset
                    </Button>
                    <Button onClick={generateStack} disabled={stackTools.length === 0 || isGenerating || !goal.trim()}>
                      {isGenerating ? 'Simulating...' : 'AI Simulate & Score'}
                    </Button>
                  </div>
                </div>
                <Input
                  placeholder="What are you trying to build? (e.g. RAG chatbot with memory)"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="mt-2"
                />
              </CardHeader>
              <CardContent>
                <SortableContext items={stackTools.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="min-h-[400px] border-2 border-dashed border-border rounded-2xl p-6 space-y-3">
                    {stackTools.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                        <Plus className="w-12 h-12 mb-4 opacity-40" />
                        <p className="font-medium">Drag tools here from the palette</p>
                        <p className="text-xs mt-1">Build your perfect stack</p>
                      </div>
                    ) : (
                      stackTools.map(tool => (
                        <SortableTool key={tool.id} tool={tool} onRemove={removeTool} />
                      ))
                    )}
                  </div>
                </SortableContext>
              </CardContent>
            </Card>
          </DndContext>
        </div>

        {/* Results / Simulator */}
        <div className="lg:col-span-3">
          {result && (
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Simulation Results
                  <Button variant="outline" size="sm" onClick={exportStack}>
                    <Download className="w-4 h-4 mr-1" /> Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <div>
                  <div className="font-semibold text-lg">{result.stackName}</div>
                  <div className="flex gap-4 text-xs mt-2">
                    <Badge>{result.difficulty}</Badge>
                    <Badge variant="secondary">{result.estimatedCost}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{result.description}</p>

                <Separator />

                <div>
                  <div className="uppercase text-xs font-mono tracking-widest text-muted-foreground mb-3">Selected Tools</div>
                  <div className="space-y-4">
                    {result.tools.map((t, i) => (
                      <div key={i} className="border-l-2 border-primary pl-4">
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t.justification}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {result.connections && result.connections.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="uppercase text-xs font-mono tracking-widest text-muted-foreground mb-3">Execution Flow</div>
                      <div className="space-y-3 text-xs">
                        {result.connections.map((conn, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="font-mono bg-muted px-2 py-0.5 rounded">{conn.from}</div>
                            <div className="flex-1 h-px bg-border relative">
                              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-background px-3 text-[10px] text-muted-foreground">
                                {conn.label}
                              </div>
                            </div>
                            <div className="font-mono bg-muted px-2 py-0.5 rounded">{conn.to}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackBuilder;
