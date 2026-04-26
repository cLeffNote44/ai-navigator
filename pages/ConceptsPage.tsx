import React from 'react';
import { AITool, ToolCategory } from '../types';
import SkillTree from '../components/SkillTree';

interface ConceptsPageProps {
  tools: AITool[];
  onToolSelect?: (tool: AITool) => void;
}

const ConceptsPage: React.FC<ConceptsPageProps> = ({ tools, onToolSelect }) => {
  const concepts = tools.filter(t => t.category === ToolCategory.CONCEPT);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic">
          AI Navigator <span className="text-primary">Skill Tree</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Master core concepts and unlock advanced capabilities. Track your learning journey with interactive paths and AI recommendations.
        </p>
      </div>

      {/* Integrated Skill Tree (Feature 2) */}
      <SkillTree tools={tools} onToolSelect={onToolSelect} />

      <div className="bg-card border border-border p-12 rounded-3xl flex flex-col lg:flex-row items-center gap-12">
         <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-black italic">Why learn the concepts first?</h3>
            <p className="text-muted-foreground leading-relaxed">
               Most developers jump straight into APIs, but the most successful AI engineers understand the underlying theory. 
               Understanding things like **Embeddings** and **Context Windows** will save you weeks of debugging later.
            </p>
            <ul className="space-y-3">
               <li className="flex items-center text-sm text-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                  Better debugging of non-deterministic outputs
               </li>
               <li className="flex items-center text-sm text-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                  Optimization of cost and latency
               </li>
               <li className="flex items-center text-sm text-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                  Knowledge of which model to use for which task
               </li>
            </ul>
         </div>
         <div className="lg:w-1/3 aspect-square bg-primary/10 rounded-2xl flex items-center justify-center p-8 border border-primary/20">
            <div className="text-center space-y-4">
               <svg className="w-24 h-24 text-primary mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
               </svg>
               <p className="text-primary font-black uppercase text-xs tracking-widest">Knowledge is Power</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConceptsPage;
