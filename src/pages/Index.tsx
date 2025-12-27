import { useState } from 'react';
import { Search, Send, Link2, Eye, EyeOff, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RAGPanel } from '@/components/RAGPanel';
import { DeterministicPanel } from '@/components/DeterministicPanel';
import { ConflictBanner } from '@/components/ConflictBanner';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { PollWidget } from '@/components/PollWidget';
import { useDataStore } from '@/store/dataStore';
import { 
  demoScenarios, 
  ragAnswers, 
  deterministicAnswers, 
  conflicts 
} from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Index() {
  const [query, setQuery] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const { documents, systemRecords } = useDataStore();

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = demoScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setQuery(scenario.question);
    }
    setHasResult(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScenario || !query.trim()) {
      toast({
        title: 'Select a scenario',
        description: 'Please select a demo scenario to compare results.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setHasResult(false);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setHasResult(true);
    }, 1200);
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('scenario', selectedScenario || '');
    url.searchParams.set('q', query);
    navigator.clipboard.writeText(url.toString());
    toast({
      title: 'Link copied!',
      description: 'Share link copied to clipboard.',
    });
  };

  const currentRag = selectedScenario ? ragAnswers[selectedScenario] : null;
  const currentDeterministic = selectedScenario ? deterministicAnswers[selectedScenario] : null;
  const currentConflict = selectedScenario ? conflicts[selectedScenario] : null;
  const currentRecord = selectedScenario 
    ? systemRecords.find((r) => r.scenarioId === selectedScenario) 
    : null;
  const retrievedDocs = selectedScenario 
    ? documents.filter((d) => d.scenarioId === selectedScenario) 
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Docs vs Truth
              </h1>
              <p className="text-sm text-muted-foreground">
                RAG vs Deterministic Data Comparison
              </p>
            </div>
            <Link to="/editor">
              <Button variant="outline" size="sm" className="gap-2">
                <Database className="w-4 h-4" />
                Edit Datasets
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Query Section */}
        <div className="mb-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <ScenarioSelector
              scenarios={demoScenarios}
              selectedId={selectedScenario}
              onSelect={handleScenarioSelect}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyShareLink}
                disabled={!selectedScenario}
                className="gap-2"
              >
                <Link2 className="w-4 h-4" />
                Copy Share Link
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card border border-border">
                <span className="text-sm text-muted-foreground">
                  {showReasoning ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </span>
                <span className="text-sm text-muted-foreground">Show reasoning</span>
                <Switch
                  checked={showReasoning}
                  onCheckedChange={setShowReasoning}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about customer/account state..."
                className="pl-12 pr-24 py-6 text-lg bg-card border-border focus:border-primary"
              />
              <Button
                type="submit"
                disabled={!selectedScenario || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 gap-2"
              >
                <Send className="w-4 h-4" />
                Compare
              </Button>
            </div>
          </form>
        </div>

        {/* Conflict Banner */}
        {hasResult && currentConflict?.hasConflict && (
          <div className="mb-6">
            <ConflictBanner reason={currentConflict.reason} />
          </div>
        )}

        {/* Comparison Panels */}
        {(isLoading || hasResult) && currentRag && currentDeterministic && currentRecord && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <RAGPanel
              answer={currentRag.answer}
              retrievedDocs={retrievedDocs}
              confidence={currentRag.confidence}
              showReasoning={showReasoning}
              isLoading={isLoading}
            />
            <DeterministicPanel
              answer={currentDeterministic}
              record={currentRecord}
              showReasoning={showReasoning}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Poll Widget */}
        {hasResult && (
          <div className="max-w-md mx-auto">
            <PollWidget />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasResult && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Compare RAG vs Deterministic Answers
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select a demo scenario above to see how document-based retrieval compares 
              to authoritative system-of-record data.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
