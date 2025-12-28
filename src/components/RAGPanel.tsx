import { FileText, Clock, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { RetrievedDocument, FailureMode } from '@/types';
import { useState } from 'react';
import { failureModeExplanations } from '@/data/mockData';

interface RAGPanelProps {
  answer: string;
  retrievedDocs: RetrievedDocument[];
  confidence: number;
  showReasoning: boolean;
  isLoading?: boolean;
  failureMode?: FailureMode;
  onRerun?: () => void;
  runCount?: number;
}

export function RAGPanel({ 
  answer, 
  retrievedDocs, 
  confidence, 
  showReasoning, 
  isLoading,
  failureMode = 'stale_docs',
  onRerun,
  runCount = 1,
}: RAGPanelProps) {
  const [showWhyExpanded, setShowWhyExpanded] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex-1 rounded-xl border border-rag/30 bg-rag-muted/50 p-6 glow-rag">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-rag animate-pulse" />
          <h3 className="font-semibold text-rag">RAG (Document Retrieval)</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-rag/20 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-rag/20 rounded animate-pulse w-full" />
          <div className="h-4 bg-rag/20 rounded animate-pulse w-2/3" />
        </div>
        <div className="mt-4 pt-4 border-t border-rag/20">
          <p className="text-xs text-rag/60 font-mono">Generating embeddings...</p>
          <p className="text-xs text-rag/60 font-mono">Calculating similarity scores...</p>
          <p className="text-xs text-rag/60 font-mono">Retrieving top-K documents...</p>
        </div>
      </div>
    );
  }

  const failureInfo = failureModeExplanations[failureMode];

  return (
    <div className="flex-1 rounded-xl border border-rag/30 bg-rag-muted/50 p-6 glow-rag animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rag" />
          <h3 className="font-semibold text-rag">RAG (Document Retrieval)</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-rag/20 text-rag font-mono">
            {Math.round(confidence * 100)}% confidence
          </span>
          {onRerun && (
            <button
              onClick={onRerun}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-rag/10 text-rag hover:bg-rag/20 transition-colors"
              title="Run again to see variation"
            >
              <RefreshCw className="w-3 h-3" />
              Run #{runCount}
            </button>
          )}
        </div>
      </div>

      <div className="bg-card/50 rounded-lg p-4 mb-4 border border-border/50">
        <p className="text-foreground leading-relaxed">{answer}</p>
      </div>

      {/* Failure Mode Badge */}
      {failureMode && failureMode !== 'correct' && (
        <div className="mb-4">
          <button
            onClick={() => setShowWhyExpanded(!showWhyExpanded)}
            className="flex items-center gap-2 w-full text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-conflict/10 text-conflict text-xs font-medium border border-conflict/20">
              <AlertTriangle className="w-3 h-3" />
              {failureInfo.title}
            </span>
            <span className="text-xs text-muted-foreground">Why this happened</span>
            {showWhyExpanded ? (
              <ChevronUp className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
          
          {showWhyExpanded && (
            <div className="mt-2 p-3 rounded-lg bg-conflict/5 border border-conflict/10 animate-fade-in">
              <p className="text-sm text-muted-foreground">{failureInfo.description}</p>
            </div>
          )}
        </div>
      )}

      {showReasoning && retrievedDocs.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Retrieved Documents ({retrievedDocs.length})
          </h4>
          <div className="space-y-2">
            {retrievedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-card/30 border border-border/30 rounded-lg p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{doc.title}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {doc.date}
                  </span>
                </div>
                
                {/* Similarity Score Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Similarity</span>
                    <span className="font-mono text-rag">{(doc.similarityScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rag/60 to-rag rounded-full transition-all duration-500"
                      style={{ width: `${doc.similarityScore * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Matched Chunk */}
                <p className="text-muted-foreground text-xs font-mono bg-background/50 p-2 rounded border border-border/20">
                  "{doc.matchedChunk || doc.content}"
                </p>
                
                {/* Embedding Visualization */}
                {doc.embedding && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Embedding:</span>
                    <div className="flex gap-0.5">
                      {doc.embedding.map((val, i) => (
                        <div
                          key={i}
                          className="w-2 rounded-sm bg-rag/60"
                          style={{ height: `${val * 16 + 4}px` }}
                          title={`dim${i}: ${val.toFixed(2)}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Pipeline Steps */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground mb-2">RAG Pipeline Steps:</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-rag/10 text-rag">1. Embed Query</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2 py-0.5 rounded bg-rag/10 text-rag">2. Vector Search</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2 py-0.5 rounded bg-rag/10 text-rag">3. Top-K Retrieval</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2 py-0.5 rounded bg-rag/10 text-rag">4. Generate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
