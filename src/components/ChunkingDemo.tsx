import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Scissors, FileText } from 'lucide-react';

interface ChunkingDemoProps {
  document: {
    title: string;
    content: string;
  };
}

export function ChunkingDemo({ document }: ChunkingDemoProps) {
  const [chunkSize, setChunkSize] = useState(50);
  const [expanded, setExpanded] = useState(false);

  const chunks = useMemo(() => {
    const words = document.content.split(/\s+/);
    const result: string[] = [];
    
    for (let i = 0; i < words.length; i += Math.max(1, Math.floor(chunkSize / 5))) {
      const chunk = words.slice(i, i + Math.max(1, Math.floor(chunkSize / 5))).join(' ');
      if (chunk.trim()) result.push(chunk);
    }
    
    return result;
  }, [document.content, chunkSize]);

  // Simulate mock similarity scores for each chunk
  const chunkScores = useMemo(() => {
    return chunks.map((chunk, i) => {
      // Create varied scores based on chunk index and content
      const hash = chunk.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const base = (Math.sin(hash * 0.01) + 1) / 2;
      // Add some randomness
      return Math.min(0.95, Math.max(0.3, base + (Math.random() - 0.5) * 0.2));
    });
  }, [chunks]);

  const colors = [
    'bg-rag/20 border-rag/40 text-rag',
    'bg-deterministic/20 border-deterministic/40 text-deterministic',
    'bg-primary/20 border-primary/40 text-primary',
    'bg-purple-500/20 border-purple-500/40 text-purple-400',
    'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
  ];

  return (
    <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Interactive Chunking Demo</span>
          <Badge variant="outline" className="text-xs">
            {chunks.length} chunks
          </Badge>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Document Header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span className="font-medium">{document.title}</span>
          </div>

          {/* Chunk Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chunk Size</span>
              <span className="text-foreground font-mono">{chunkSize} chars</span>
            </div>
            <Slider
              value={[chunkSize]}
              onValueChange={([v]) => setChunkSize(v)}
              min={20}
              max={150}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller (more chunks)</span>
              <span>Larger (fewer chunks)</span>
            </div>
          </div>

          {/* Chunks Visualization */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Each chunk is independently embedded and scored for retrieval:
            </p>
            <div className="flex flex-wrap gap-2">
              {chunks.map((chunk, i) => (
                <div
                  key={i}
                  className={`relative px-2 py-1 rounded border text-xs ${colors[i % colors.length]}`}
                >
                  <span className="line-clamp-1 max-w-[200px]">{chunk}</span>
                  <div 
                    className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-background border border-border text-[10px] font-mono"
                    title={`Similarity: ${(chunkScores[i] * 100).toFixed(0)}%`}
                  >
                    {(chunkScores[i] * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Insight: </span>
              {chunkSize < 50 ? (
                <>Small chunks = more granular retrieval, but may lose context. The query might match a fragment that's misleading without surrounding text.</>
              ) : chunkSize > 100 ? (
                <>Large chunks = better context preservation, but may include irrelevant information that dilutes the similarity score.</>
              ) : (
                <>Medium chunks balance context and precision. Optimal size depends on your document structure and query patterns.</>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
