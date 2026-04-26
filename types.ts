
export enum ToolCategory {
  LANGUAGE_MODEL = 'Language Model',
  CODE_ASSISTANT = 'Code Assistant',
  IMAGE_GENERATION = 'Image Generation',
  VIDEO_GENERATION = 'Video Generation',
  DATA_SCIENCE = 'Data Science',
  VECTOR_DATABASE = 'Vector Database',
  FRAMEWORK = 'Framework',
  DATABASE = 'Database',
  API_DEVELOPMENT = 'API Development',
  VERSION_CONTROL = 'Version Control',
  CONTAINERIZATION = 'Containerization',
  CI_CD = 'CI/CD',
  CLOUD_PLATFORM = 'Cloud Platform',
  DEPLOYMENT = 'Deployment',
  MONITORING = 'Monitoring',
  PROJECT_MANAGEMENT = 'Project Management',
  AUTOMATION = 'Automation',
  CONCEPT = 'Core Concept',
  AI_OBSERVABILITY = 'AI Observability',
  AI_INFERENCE = 'AI Inference',
  AGENT_ORCHESTRATION = 'Agent Orchestration',
  DATA_INGESTION = 'Data Ingestion',
}

export enum RelationType {
  INTEGRATES_WITH = 'Integrates with',
  DEPENDS_ON = 'Depends on',
  ALTERNATIVE_TO = 'Alternative to',
  WORKS_BEST_WITH = 'Works best with',
  IMPLEMENTS = 'Implements',
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum Pricing {
  FREE = 'Free',
  FREEMIUM = 'Freemium',
  PAID = 'Paid',
}

export interface ToolRelation {
  targetId: string;
  type: RelationType;
  description?: string;
}

export interface AITool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  difficulty: Difficulty;
  pricing: Pricing;
  relations?: ToolRelation[];
  website?: string;
  concepts?: string[];
}

export interface TechStackTool {
  id: string;
  name: string;
  justification: string;
}

export interface TechStack {
  id: string;
  stackName: string;
  description: string;
  tools: TechStackTool[];
  difficulty: Difficulty;
  estimatedCost: string;
  connections?: {
    from: string;
    to: string;
    label: string;
  }[];
}
