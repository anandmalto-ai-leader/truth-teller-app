import { AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ConflictBannerProps {
  reason: string;
  failureMode?: 'stale_docs' | 'missing_context' | 'conflicting_sources' | 'correct';
}

const failureModeDetails: Record<string, { icon: string; tip: string }> = {
  stale_docs: {
    icon: '📅',
    tip: 'Mitigation: Implement document freshness scoring or attach timestamps to embeddings.',
  },
  missing_context: {
    icon: '🔍',
    tip: 'Mitigation: Expand document corpus or use hybrid search with structured data.',
  },
  conflicting_sources: {
    icon: '⚔️',
    tip: 'Mitigation: Add source authority ranking or conflict detection in the retrieval pipeline.',
  },
  correct: {
    icon: '✓',
    tip: 'The documents happened to contain accurate, current information.',
  },
};

export function ConflictBanner({ reason, failureMode = 'stale_docs' }: ConflictBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const details = failureModeDetails[failureMode];

  return (
    <div className="rounded-xl border border-conflict/40 bg-conflict/10 p-4 animate-shake">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-conflict/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-conflict" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-conflict">Conflict Detected</h3>
            <span className="text-lg">{details.icon}</span>
          </div>
          <p className="text-sm text-conflict/80 mb-2">{reason}</p>
          <div className="flex items-center gap-2 text-xs text-conflict/60 bg-conflict/5 rounded-lg px-3 py-2 border border-conflict/10">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>RAG retrieves relevant text, not current truth.</span>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-conflict/70 hover:text-conflict transition-colors"
          >
            <span>Learn why this happens</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          {expanded && (
            <div className="mt-3 p-3 rounded-lg bg-background/50 border border-conflict/20 animate-fade-in">
              <p className="text-sm text-muted-foreground mb-3">
                <strong className="text-foreground">Why RAG fails here:</strong> RAG systems search through 
                document embeddings to find semantically similar content. However, they have no concept of 
                "current state" — they retrieve what was written, not what is true now.
              </p>
              <p className="text-sm text-rag/80">
                <strong>💡 {details.tip}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
