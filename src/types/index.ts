export interface Document {
  id: string;
  title: string;
  date: string;
  content: string;
  scenarioId: string;
  // Enhanced for RAG simulation
  chunks?: string[];
  embedding?: number[];
}

export interface RetrievedDocument extends Document {
  similarityScore: number;
  matchedChunk?: string;
}

export interface SystemRecord {
  id: string;
  scenarioId: string;
  data: Record<string, string | number>;
  source: string;
  last_updated: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  question: string;
  icon: string;
}

export type FailureMode = 'stale_docs' | 'missing_context' | 'conflicting_sources' | 'correct' | 'hallucination';

export interface RAGResult {
  answer: string;
  retrievedDocs: RetrievedDocument[];
  confidence: number;
  failureMode?: FailureMode;
}

export interface DeterministicResult {
  answer: string;
  record: SystemRecord;
  source: string;
}

export interface ComparisonResult {
  rag: RAGResult;
  deterministic: DeterministicResult;
  hasConflict: boolean;
  conflictReason?: string;
}
