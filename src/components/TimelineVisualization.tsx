import { RetrievedDocument, SystemRecord } from '@/types';
import { FileText, Database, AlertTriangle, CheckCircle } from 'lucide-react';

interface TimelineVisualizationProps {
  documents: RetrievedDocument[];
  systemRecord: SystemRecord;
}

export function TimelineVisualization({ documents, systemRecord }: TimelineVisualizationProps) {
  // Parse dates and create timeline items
  const systemDate = new Date(systemRecord.last_updated);
  
  const timelineItems = [
    ...documents.map(doc => ({
      id: doc.id,
      date: new Date(doc.date),
      label: doc.title,
      type: 'document' as const,
      isStale: new Date(doc.date) < systemDate,
    })),
    {
      id: 'system',
      date: systemDate,
      label: `${systemRecord.source} Updated`,
      type: 'system' as const,
      isStale: false,
    },
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const minDate = timelineItems[0]?.date;
  const maxDate = timelineItems[timelineItems.length - 1]?.date;
  const range = maxDate && minDate ? maxDate.getTime() - minDate.getTime() : 1;

  const getPosition = (date: Date) => {
    if (!minDate) return 0;
    return ((date.getTime() - minDate.getTime()) / range) * 100;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const staleDocs = documents.filter(d => new Date(d.date) < systemDate);
  const hasStaleness = staleDocs.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <span>📅</span>
          Document Timeline vs System Update
        </h4>
        {hasStaleness ? (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-conflict/10 text-conflict">
            <AlertTriangle className="w-3 h-3" />
            {staleDocs.length} stale doc{staleDocs.length > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-deterministic/10 text-deterministic">
            <CheckCircle className="w-3 h-3" />
            All docs current
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="relative h-24 mb-2">
        {/* Timeline line */}
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-border" />
        
        {/* Stale zone indicator */}
        {hasStaleness && (
          <div 
            className="absolute top-8 h-4 bg-conflict/10 border-l border-r border-conflict/30 rounded"
            style={{ 
              left: '0%',
              width: `${getPosition(systemDate)}%`,
            }}
          >
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-conflict/60 whitespace-nowrap">
              Stale Zone
            </span>
          </div>
        )}

        {/* Items */}
        {timelineItems.map((item, index) => (
          <div
            key={item.id}
            className="absolute flex flex-col items-center"
            style={{ 
              left: `${Math.min(95, Math.max(5, getPosition(item.date)))}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Connector */}
            <div 
              className={`w-0.5 ${index % 2 === 0 ? 'h-6 mb-0' : 'h-3 mt-3'} ${
                item.type === 'system' 
                  ? 'bg-deterministic' 
                  : item.isStale 
                    ? 'bg-conflict/60' 
                    : 'bg-rag'
              }`}
            />
            
            {/* Node */}
            <div 
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                item.type === 'system' 
                  ? 'bg-deterministic text-deterministic-foreground' 
                  : item.isStale 
                    ? 'bg-conflict/80 text-white' 
                    : 'bg-rag text-white'
              }`}
              style={{ marginTop: index % 2 === 0 ? 0 : '-2px' }}
            >
              {item.type === 'system' ? (
                <Database className="w-2.5 h-2.5" />
              ) : (
                <FileText className="w-2.5 h-2.5" />
              )}
            </div>
            
            {/* Label */}
            <div 
              className={`mt-1 text-center ${index % 2 === 0 ? '' : 'mt-0 absolute top-0 -translate-y-full pb-1'}`}
            >
              <p className={`text-[10px] font-medium truncate max-w-[80px] ${
                item.type === 'system' 
                  ? 'text-deterministic' 
                  : item.isStale 
                    ? 'text-conflict/80' 
                    : 'text-rag'
              }`}>
                {item.label}
              </p>
              <p className="text-[9px] text-muted-foreground">
                {formatDate(item.date)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full bg-rag" />
          <span>Current Doc</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full bg-conflict/80" />
          <span>Stale Doc</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full bg-deterministic" />
          <span>System Update</span>
        </div>
      </div>
    </div>
  );
}
