import { AlertTriangle } from 'lucide-react';

interface ConflictBannerProps {
  reason: string;
}

export function ConflictBanner({ reason }: ConflictBannerProps) {
  return (
    <div className="rounded-xl border border-conflict/50 bg-conflict-muted p-4 glow-conflict animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-conflict/20">
          <AlertTriangle className="w-5 h-5 text-conflict" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-conflict mb-1">⚠️ Conflict Detected</h4>
          <p className="text-sm text-conflict/80">{reason}</p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            RAG retrieves relevant text, not current truth.
          </p>
        </div>
      </div>
    </div>
  );
}
