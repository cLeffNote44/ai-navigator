
import { AITool, ToolCategory, RelationType, Difficulty, Pricing } from './types';
import React from 'react';

export const AI_TOOLS: AITool[] = [
  // Core Concepts
  {
    id: 'llm',
    name: 'LLM (Large Language Model)',
    category: ToolCategory.CONCEPT,
    description: 'An AI model trained on massive amounts of text data to understand and generate human-like language. The "brain" behind tools like ChatGPT.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREE,
  },
  {
    id: 'rag',
    name: 'RAG (Retrieval-Augmented Generation)',
    category: ToolCategory.CONCEPT,
    description: 'A technique that gives LLMs access to external data (like your company files) to provide more accurate and ground-in-fact answers.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'vector-db', type: RelationType.DEPENDS_ON },
      { targetId: 'llm', type: RelationType.WORKS_BEST_WITH },
      { targetId: 'embeddings', type: RelationType.DEPENDS_ON },
    ]
  },
  {
    id: 'vector-db',
    name: 'Vector Database',
    category: ToolCategory.CONCEPT,
    description: 'A special type of database that stores data as mathematical "vectors" so AI can quickly find related pieces of information.',
    difficulty: Difficulty.ADVANCED,
    pricing: Pricing.FREE,
  },
  {
    id: 'embeddings',
    name: 'Embeddings',
    category: ToolCategory.CONCEPT,
    description: 'The process of turning text or images into a list of numbers (vectors) so that a computer can understand context and similarity.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREE,
  },
  {
    id: 'agentic-ai',
    name: 'Agentic AI',
    category: ToolCategory.CONCEPT,
    description: 'AI systems that don\'t just talk, but can perform tasks by using tools, browsing the web, and making decisions independently.',
    difficulty: Difficulty.ADVANCED,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'crew-ai', type: RelationType.WORKS_BEST_WITH },
    ]
  },
  {
    id: 'tokenization',
    name: 'Tokenization',
    category: ToolCategory.CONCEPT,
    description: 'How AI "reads" text by breaking it into small chunks called tokens. Understanding tokens helps you manage costs and context limits.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREE,
  },

  // Language Models
  { 
    id: 'openai-o1', 
    name: 'OpenAI o1', 
    category: ToolCategory.LANGUAGE_MODEL, 
    description: 'A new series of reasoning models designed to spend more time thinking before they respond, excelling in complex scientific and coding tasks.',
    difficulty: Difficulty.ADVANCED,
    pricing: Pricing.PAID,
    relations: [
      { targetId: 'openai', type: RelationType.WORKS_BEST_WITH },
    ]
  },
  { 
    id: 'openai', 
    name: 'OpenAI (GPT-4o)', 
    category: ToolCategory.LANGUAGE_MODEL, 
    description: 'State-of-the-art models for text generation, understanding, and conversation. The industry standard for reliable production apps.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREEMIUM,
    relations: [
      { targetId: 'llm', type: RelationType.IMPLEMENTS },
      { targetId: 'langchain', type: RelationType.INTEGRATES_WITH },
      { targetId: 'pinecone', type: RelationType.WORKS_BEST_WITH },
    ]
  },
  { 
    id: 'claude-3-5', 
    name: 'Anthropic Claude 3.5 Sonnet', 
    category: ToolCategory.LANGUAGE_MODEL, 
    description: 'Widely considered the best model for coding and nuance. High intelligence with a very "human" writing style.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREEMIUM,
    relations: [
      { targetId: 'llm', type: RelationType.IMPLEMENTS },
    ]
  },
  { 
    id: 'gemini', 
    name: 'Google Gemini 1.5 Pro', 
    category: ToolCategory.LANGUAGE_MODEL, 
    description: 'Features a massive 2-million token context window, allowing you to process entire codebases or hours of video in one go.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREEMIUM,
    relations: [
      { targetId: 'llm', type: RelationType.IMPLEMENTS },
    ]
  },
  { 
    id: 'llama-3-1', 
    name: 'Meta Llama 3.1', 
    category: ToolCategory.LANGUAGE_MODEL, 
    description: 'The world\'s most capable open-source model. Can be run locally or hosted on various cloud providers.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'llm', type: RelationType.IMPLEMENTS },
      { targetId: 'groq', type: RelationType.WORKS_BEST_WITH },
    ]
  },
  { 
    id: 'deepseek-v3', 
    name: 'DeepSeek-V3', 
    category: ToolCategory.LANGUAGE_MODEL, 
    description: 'An extremely powerful and cost-effective model that has shaken the industry with its performance in reasoning and coding.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREEMIUM,
  },
  
  // Frameworks
  { 
    id: 'langchain', 
    name: 'LangChain', 
    category: ToolCategory.FRAMEWORK, 
    description: 'The swiss-army knife of AI development. A library that helps you "chain" models, data sources, and tools.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'openai', type: RelationType.WORKS_BEST_WITH },
      { targetId: 'pinecone', type: RelationType.INTEGRATES_WITH },
    ]
  },
  { 
    id: 'llama-index', 
    name: 'LlamaIndex', 
    category: ToolCategory.FRAMEWORK, 
    description: 'Specifically optimized for RAG. It helps you connect your custom data to LLMs with minimal code.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'rag', type: RelationType.IMPLEMENTS },
      { targetId: 'chroma', type: RelationType.WORKS_BEST_WITH },
    ]
  },
  { 
    id: 'crew-ai', 
    name: 'CrewAI', 
    category: ToolCategory.AGENT_ORCHESTRATION, 
    description: 'Lets you create a team of AI agents that work together (e.g., one researcher, one writer, one editor) to complete complex goals.',
    difficulty: Difficulty.ADVANCED,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'agentic-ai', type: RelationType.IMPLEMENTS },
    ]
  },

  // Inference & Infrastructure
  { 
    id: 'groq', 
    name: 'Groq', 
    category: ToolCategory.AI_INFERENCE, 
    description: 'The world\'s fastest inference provider. Uses LPUs to run models like Llama 3 at nearly instantaneous speeds.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREEMIUM,
    relations: [
      { targetId: 'llama-3-1', type: RelationType.INTEGRATES_WITH },
    ]
  },
  { 
    id: 'replicate', 
    name: 'Replicate', 
    category: ToolCategory.AI_INFERENCE, 
    description: 'The "GitHub for AI models." Run almost any open-source model with a single API call.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.PAID,
  },
  
  // Storage (Vector DBs)
  { 
    id: 'pinecone', 
    name: 'Pinecone', 
    category: ToolCategory.VECTOR_DATABASE, 
    description: 'The industry leader for scalable vector search. Perfect for handling millions of data points in RAG apps.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREEMIUM,
    relations: [
      { targetId: 'vector-db', type: RelationType.IMPLEMENTS },
    ]
  },
  { 
    id: 'chroma', 
    name: 'Chroma DB', 
    category: ToolCategory.VECTOR_DATABASE, 
    description: 'The most popular open-source, local-first vector database. Great for prototyping and small-to-medium scale apps.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'vector-db', type: RelationType.IMPLEMENTS },
    ]
  },

  // Observability
  { 
    id: 'langsmith', 
    name: 'LangSmith', 
    category: ToolCategory.AI_OBSERVABILITY, 
    description: 'A platform to debug, test, and monitor your LLM applications. Essential for moving from prototype to production.',
    difficulty: Difficulty.ADVANCED,
    pricing: Pricing.FREEMIUM,
    relations: [
      { targetId: 'langchain', type: RelationType.INTEGRATES_WITH },
    ]
  },
  { 
    id: 'helicone', 
    name: 'Helicone', 
    category: ToolCategory.AI_OBSERVABILITY, 
    description: 'A simple proxy that adds logging, caching, and analytics to your OpenAI or Anthropic API calls.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREEMIUM,
  },

  // Data Ingestion
  { 
    id: 'firecrawl', 
    name: 'Firecrawl', 
    category: ToolCategory.DATA_INGESTION, 
    description: 'Easily turn any website into clean, LLM-ready Markdown or JSON. Perfect for building custom knowledge bases.',
    difficulty: Difficulty.BEGINNER,
    pricing: Pricing.FREEMIUM,
    relations: [
      { targetId: 'rag', type: RelationType.INTEGRATES_WITH },
    ]
  },

  // Development
  { 
    id: 'nextjs', 
    name: 'Next.js', 
    category: ToolCategory.FRAMEWORK, 
    description: 'The most popular React framework for building fast AI-powered web applications.',
    difficulty: Difficulty.INTERMEDIATE,
    pricing: Pricing.FREE,
    relations: [
      { targetId: 'vercel', type: RelationType.INTEGRATES_WITH },
    ]
  },
  { id: 'vercel', name: 'Vercel', category: ToolCategory.DEPLOYMENT, description: 'The best place to host your AI frontend with one-click deployments.', difficulty: Difficulty.BEGINNER, pricing: Pricing.FREEMIUM },
  { id: 'supabase', name: 'Supabase', category: ToolCategory.DATABASE, description: 'An open-source Firebase alternative that includes a built-in vector database for AI apps.', difficulty: Difficulty.BEGINNER, pricing: Pricing.FREEMIUM },
];

export const CATEGORY_COLORS: { [key in ToolCategory]: string } = {
  [ToolCategory.LANGUAGE_MODEL]: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  [ToolCategory.CODE_ASSISTANT]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  [ToolCategory.IMAGE_GENERATION]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  [ToolCategory.VIDEO_GENERATION]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  [ToolCategory.DATA_SCIENCE]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  [ToolCategory.VECTOR_DATABASE]: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  [ToolCategory.FRAMEWORK]: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  [ToolCategory.DATABASE]: 'bg-green-500/10 text-green-400 border-green-500/20',
  [ToolCategory.API_DEVELOPMENT]: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
  [ToolCategory.VERSION_CONTROL]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [ToolCategory.CONTAINERIZATION]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [ToolCategory.CI_CD]: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  [ToolCategory.CLOUD_PLATFORM]: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  [ToolCategory.DEPLOYMENT]: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  [ToolCategory.MONITORING]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  [ToolCategory.PROJECT_MANAGEMENT]: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  [ToolCategory.AUTOMATION]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  [ToolCategory.CONCEPT]: 'bg-white/10 text-white border-white/20',
  [ToolCategory.AI_OBSERVABILITY]: 'bg-rose-600/10 text-rose-500 border-rose-600/20',
  [ToolCategory.AI_INFERENCE]: 'bg-orange-600/10 text-orange-500 border-orange-600/20',
  [ToolCategory.AGENT_ORCHESTRATION]: 'bg-indigo-600/10 text-indigo-500 border-indigo-600/20',
  [ToolCategory.DATA_INGESTION]: 'bg-lime-600/10 text-lime-500 border-lime-600/20',
};
