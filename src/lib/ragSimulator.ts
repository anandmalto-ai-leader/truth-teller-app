import { Document, RetrievedDocument, RAGResult } from '@/types';

// Mock embeddings - simplified 5D vectors representing semantic meaning
const generateMockEmbedding = (text: string): number[] => {
  // Create a deterministic but varied embedding based on text content
  const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [
    Math.sin(hash * 0.1) * 0.5 + 0.5,
    Math.cos(hash * 0.2) * 0.5 + 0.5,
    Math.sin(hash * 0.3) * 0.5 + 0.5,
    Math.cos(hash * 0.4) * 0.5 + 0.5,
    Math.sin(hash * 0.5) * 0.5 + 0.5,
  ];
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (a: number[], b: number[]): number => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Add random variation to simulate probabilistic nature
const addNoise = (score: number, variance: number = 0.15): number => {
  const noise = (Math.random() - 0.5) * 2 * variance;
  return Math.max(0, Math.min(1, score + noise));
};

// Chunk a document into smaller pieces
export const chunkDocument = (doc: Document): string[] => {
  const content = doc.content;
  // Simple chunking by sentences or fixed length
  const chunks = content.match(/[^.!?]+[.!?]+/g) || [content];
  return chunks.map(c => c.trim()).filter(c => c.length > 0);
};

// Simulate RAG retrieval with probabilistic scoring
export const simulateRAG = (
  query: string,
  documents: Document[],
  topK: number = 3
): { retrievedDocs: RetrievedDocument[]; rawScores: Map<string, number> } => {
  const queryEmbedding = generateMockEmbedding(query);
  
  const scoredDocs: RetrievedDocument[] = documents.map(doc => {
    const docEmbedding = doc.embedding || generateMockEmbedding(doc.content);
    const chunks = doc.chunks || chunkDocument(doc);
    
    // Find best matching chunk
    let bestChunkScore = 0;
    let bestChunk = chunks[0];
    
    chunks.forEach(chunk => {
      const chunkEmbedding = generateMockEmbedding(chunk);
      const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
      if (similarity > bestChunkScore) {
        bestChunkScore = similarity;
        bestChunk = chunk;
      }
    });
    
    // Add probabilistic noise to simulate real RAG behavior
    const noisyScore = addNoise(bestChunkScore);
    
    return {
      ...doc,
      chunks,
      embedding: docEmbedding,
      similarityScore: noisyScore,
      matchedChunk: bestChunk,
    };
  });
  
  // Sort by similarity and take top K
  scoredDocs.sort((a, b) => b.similarityScore - a.similarityScore);
  
  const rawScores = new Map<string, number>();
  scoredDocs.forEach(doc => rawScores.set(doc.id, doc.similarityScore));
  
  return {
    retrievedDocs: scoredDocs.slice(0, topK),
    rawScores,
  };
};

// Generate answer templates based on retrieved docs
const answerTemplates: Record<string, string[]> = {
  subscription: [
    "Based on the documents, Acme Corp appears to be on an Enterprise trial (mentioned in Trial Email from Dec 1), though there's a note about possibly downgrading to Pro in January.",
    "The retrieved documents suggest Acme Corp is currently on an Enterprise trial. A CS note mentions considering a downgrade to Pro.",
    "According to my search, Acme Corp started with an Enterprise trial. Recent notes suggest they may be evaluating the Pro plan.",
  ],
  invoice: [
    "According to the Payment Reminder from Dec 27, invoice INV-7782 is pending. The amount due is $1249.",
    "My search indicates invoice INV-7782 is still pending payment based on the latest reminder document.",
    "The documents show INV-7782 with a pending status. Amount due: $1249 per the invoice summary.",
  ],
  appointment: [
    "The appointment was originally scheduled for 10:00 AM (per Confirmation Email), but a Reschedule Note from Dec 26 indicates it was moved to the afternoon.",
    "Based on the documents, patient p_9821's appointment was rescheduled. Originally 10:00 AM, now moved to afternoon.",
    "I found that the appointment was initially at 10:00 AM but was rescheduled to the afternoon according to recent notes.",
  ],
  hallucination: [
    "Based on the documents, TICKET-4455 was resolved by implementing a password reset fix. Mike completed this on December 24th as part of the weekly ticket resolution.",
    "The support ticket TICKET-4455 has been resolved. According to chat logs, Mike fixed the login issue by resetting the user's password and clearing their session cache.",
    "TICKET-4455 was closed after Mike identified it as a browser cookie issue. The resolution involved clearing cookies and resetting the 2FA token.",
  ],
};

// Determine failure mode based on scenario context
const getFailureMode = (
  scenarioId: string,
  retrievedDocs: RetrievedDocument[]
): 'stale_docs' | 'missing_context' | 'conflicting_sources' | 'correct' | 'hallucination' => {
  // Hallucination scenario - docs are vague, model fabricates details
  if (scenarioId === 'hallucination') {
    return 'hallucination';
  }

  // Check if docs are old (stale)
  const now = new Date();
  const hasStaleDoc = retrievedDocs.some(doc => {
    const docDate = new Date(doc.date);
    const daysDiff = (now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff > 5;
  });
  
  // Check for conflicting info in docs
  const hasConflict = retrievedDocs.length > 1 && 
    retrievedDocs.some((d, i) => 
      retrievedDocs.some((d2, j) => i !== j && d.content.length > 0 && d2.content.length > 0)
    );
  
  if (hasStaleDoc) return 'stale_docs';
  if (hasConflict) return 'conflicting_sources';
  if (retrievedDocs.length < 2) return 'missing_context';
  return 'stale_docs'; // Default for demo scenarios
};

// Generate a complete RAG result
export const generateRAGResult = (
  query: string,
  documents: Document[],
  scenarioId: string
): RAGResult => {
  const { retrievedDocs } = simulateRAG(query, documents);
  
  // Calculate confidence based on similarity score spread
  const scores = retrievedDocs.map(d => d.similarityScore);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const scoreSpread = Math.max(...scores) - Math.min(...scores);
  
  // Lower confidence if scores are spread out (uncertainty)
  const confidence = Math.max(0.45, Math.min(0.92, avgScore - scoreSpread * 0.3 + (Math.random() * 0.1)));
  
  // Pick a random answer template
  const templates = answerTemplates[scenarioId] || answerTemplates.subscription;
  const answer = templates[Math.floor(Math.random() * templates.length)];
  
  const failureMode = getFailureMode(scenarioId, retrievedDocs);
  
  return {
    answer,
    retrievedDocs,
    confidence,
    failureMode,
  };
};
