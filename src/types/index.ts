export interface Document {
  id: string;
  title: string;
  date: string;
  content: string;
  scenarioId: string;
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

export interface RAGResult {
  answer: string;
  retrievedDocs: Document[];
  confidence: number;
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
