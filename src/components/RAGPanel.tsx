import { FileText, Clock } from 'lucide-react';
import { Document } from '@/types';

interface RAGPanelProps {
  answer: string;
  retrievedDocs: Document[];
  confidence: number;
  showReasoning: boolean;
  isLoading?: boolean;
}

export function RAGPanel({ answer, retrievedDocs, confidence, showReasoning, isLoading }: RAGPanelProps) {
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
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-xl border border-rag/30 bg-rag-muted/50 p-6 glow-rag animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rag" />
          <h3 className="font-semibold text-rag">RAG (Document Retrieval)</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-rag/20 text-rag font-mono">
          {Math.round(confidence * 100)}% confidence
        </span>
      </div>

      <div className="bg-card/50 rounded-lg p-4 mb-4 border border-border/50">
        <p className="text-foreground leading-relaxed">{answer}</p>
      </div>

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
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{doc.title}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {doc.date}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs font-mono">"{doc.content}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
