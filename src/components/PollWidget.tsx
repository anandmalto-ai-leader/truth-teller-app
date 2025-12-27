import { useState } from 'react';
import { ThumbsUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PollWidget() {
  const [voted, setVoted] = useState<'rag' | 'deterministic' | null>(null);
  const [ragVotes, setRagVotes] = useState(12);
  const [detVotes, setDetVotes] = useState(47);

  const handleVote = (choice: 'rag' | 'deterministic') => {
    if (voted) return;
    setVoted(choice);
    if (choice === 'rag') {
      setRagVotes((v) => v + 1);
    } else {
      setDetVotes((v) => v + 1);
    }
  };

  const total = ragVotes + detVotes;
  const ragPercent = Math.round((ragVotes / total) * 100);
  const detPercent = Math.round((detVotes / total) * 100);

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 animate-fade-in">
      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <ThumbsUp className="w-4 h-4" />
        Which would you trust?
      </h4>
      
      <div className="space-y-3">
        <button
          onClick={() => handleVote('rag')}
          disabled={voted !== null}
          className={`w-full relative overflow-hidden rounded-lg border transition-all ${
            voted === 'rag'
              ? 'border-rag bg-rag/10'
              : 'border-border hover:border-rag/50 bg-card/30'
          } ${voted !== null ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-rag/20 transition-all duration-500"
            style={{ width: voted ? `${ragPercent}%` : '0%' }}
          />
          <div className="relative p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              {voted === 'rag' && <Check className="w-4 h-4 text-rag" />}
              RAG Answer
            </span>
            {voted && (
              <span className="text-sm font-mono text-rag">{ragPercent}%</span>
            )}
          </div>
        </button>

        <button
          onClick={() => handleVote('deterministic')}
          disabled={voted !== null}
          className={`w-full relative overflow-hidden rounded-lg border transition-all ${
            voted === 'deterministic'
              ? 'border-deterministic bg-deterministic/10'
              : 'border-border hover:border-deterministic/50 bg-card/30'
          } ${voted !== null ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-deterministic/20 transition-all duration-500"
            style={{ width: voted ? `${detPercent}%` : '0%' }}
          />
          <div className="relative p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              {voted === 'deterministic' && <Check className="w-4 h-4 text-deterministic" />}
              System of Record Answer
            </span>
            {voted && (
              <span className="text-sm font-mono text-deterministic">{detPercent}%</span>
            )}
          </div>
        </button>
      </div>

      {voted && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {total} people voted
        </p>
      )}
    </div>
  );
}
