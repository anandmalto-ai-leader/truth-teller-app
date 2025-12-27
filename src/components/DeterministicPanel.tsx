import { Database, Clock, ExternalLink } from 'lucide-react';
import { SystemRecord } from '@/types';

interface DeterministicPanelProps {
  answer: string;
  record: SystemRecord;
  showReasoning: boolean;
  isLoading?: boolean;
}

export function DeterministicPanel({ answer, record, showReasoning, isLoading }: DeterministicPanelProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 rounded-xl border border-deterministic/30 bg-deterministic-muted/50 p-6 glow-deterministic">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-deterministic animate-pulse" />
          <h3 className="font-semibold text-deterministic">Deterministic (System of Record)</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-deterministic/20 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-deterministic/20 rounded animate-pulse w-full" />
          <div className="h-4 bg-deterministic/20 rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-xl border border-deterministic/30 bg-deterministic-muted/50 p-6 glow-deterministic animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-deterministic" />
          <h3 className="font-semibold text-deterministic">Deterministic (System of Record)</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-deterministic/20 text-deterministic font-medium flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          {record.source}
        </span>
      </div>

      <div className="bg-card/50 rounded-lg p-4 mb-4 border border-border/50">
        <p className="text-foreground leading-relaxed">{answer}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Clock className="w-3 h-3" />
        Last updated: {formatDate(record.last_updated)}
      </div>

      {showReasoning && (
        <div className="space-y-3 animate-fade-in">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Database className="w-4 h-4" />
            Source Data (JSON)
          </h4>
          <div className="bg-card/30 border border-border/30 rounded-lg p-3 overflow-x-auto">
            <pre className="text-xs font-mono text-foreground">
              {JSON.stringify(record.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
