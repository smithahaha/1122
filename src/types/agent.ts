// 智能体框架核心类型定义

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  version: string;
  capabilities: Capability[];
  memory: AgentMemory;
  tools: Tool[];
  workflows: Workflow[];
  config: AgentConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  type: 'reasoning' | 'planning' | 'execution' | 'communication' | 'learning';
  enabled: boolean;
}

export interface AgentMemory {
  shortTerm: MemoryItem[];
  longTerm: MemoryItem[];
  episodic: EpisodicMemory[];
  semantic: SemanticMemory[];
}

export interface MemoryItem {
  id: string;
  content: string;
  type: 'conversation' | 'task' | 'knowledge' | 'experience';
  importance: number; // 0-1
  timestamp: Date;
  tags: string[];
  embedding?: number[];
}

export interface EpisodicMemory {
  id: string;
  event: string;
  context: any;
  outcome: string;
  learned: string;
  timestamp: Date;
}

export interface SemanticMemory {
  id: string;
  concept: string;
  definition: string;
  relationships: string[];
  examples: string[];
  confidence: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'function' | 'service' | 'plugin';
  endpoint?: string;
  schema: ToolSchema;
  enabled: boolean;
  rateLimits?: RateLimit;
}

export interface ToolSchema {
  parameters: Record<string, ParameterDef>;
  required: string[];
  returns: ReturnDef;
}

export interface ParameterDef {
  type: string;
  description: string;
  default?: any;
  validation?: any;
}

export interface ReturnDef {
  type: string;
  description: string;
  schema?: any;
}

export interface RateLimit {
  maxCalls: number;
  windowMs: number;
  cooldownMs?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  enabled: boolean;
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event' | 'condition';
  config: any;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'tool_call' | 'reasoning' | 'decision' | 'parallel' | 'loop';
  config: any;
  nextSteps: string[];
  fallback?: string;
}

export interface WorkflowCondition {
  id: string;
  expression: string;
  action: 'continue' | 'skip' | 'stop' | 'retry';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'simple' | 'complex' | 'workflow';
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  steps: TaskStep[];
  result?: TaskResult;
  metadata: TaskMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  toolId?: string;
  input?: any;
  output?: any;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface TaskResult {
  success: boolean;
  data?: any;
  error?: string;
  metrics: {
    duration: number;
    tokensUsed: number;
    toolsCalled: number;
    steps: number;
  };
}

export interface TaskMetadata {
  userId: string;
  agentId: string;
  parentTaskId?: string;
  tags: string[];
  context: any;
}

export interface AgentConfig {
  maxMemoryItems: number;
  memoryRetentionDays: number;
  defaultModel: string;
  maxConcurrentTasks: number;
  enableLearning: boolean;
  enablePlanning: boolean;
  responseFormat: 'natural' | 'structured' | 'mixed';
  personalityTraits: Record<string, number>;
}

export interface PlanningRequest {
  goal: string;
  constraints?: string[];
  resources?: string[];
  deadline?: Date;
  context?: any;
}

export interface Plan {
  id: string;
  goal: string;
  strategy: string;
  steps: PlanStep[];
  estimatedDuration: number;
  confidence: number;
  alternatives: Plan[];
}

export interface PlanStep {
  id: string;
  action: string;
  description: string;
  toolRequired?: string;
  dependencies: string[];
  estimatedTime: number;
  resources: string[];
}

// 事件系统
export interface AgentEvent {
  id: string;
  type: string;
  agentId: string;
  payload: any;
  timestamp: Date;
}

// 学习系统
export interface LearningData {
  input: any;
  expectedOutput: any;
  actualOutput: any;
  feedback: number; // -1 to 1
  context: any;
  timestamp: Date;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface KnowledgeNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
  embedding?: number[];
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  weight: number;
  properties: Record<string, any>;
} 