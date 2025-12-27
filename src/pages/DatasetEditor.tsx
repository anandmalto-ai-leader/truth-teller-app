import { useState } from 'react';
import { ArrowLeft, FileText, Database, Plus, Trash2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataStore } from '@/store/dataStore';
import { Document, SystemRecord } from '@/types';
import { demoScenarios } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

export default function DatasetEditor() {
  const { documents, systemRecords, updateDocument, updateSystemRecord, addDocument, deleteDocument } = useDataStore();
  const [activeTab, setActiveTab] = useState('docs');

  const handleAddDocument = () => {
    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      scenarioId: 'subscription',
      title: 'New Document',
      date: new Date().toISOString().split('T')[0],
      content: 'Enter content here...',
    };
    addDocument(newDoc);
    toast({ title: 'Document added' });
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    toast({ title: 'Document deleted' });
  };

  const handleSaveChanges = () => {
    toast({ title: 'Changes saved!', description: 'Your dataset changes have been saved.' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Dataset Editor</h1>
                <p className="text-sm text-muted-foreground">
                  Edit documents and system records
                </p>
              </div>
            </div>
            <Button onClick={handleSaveChanges} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="docs" className="gap-2">
              <FileText className="w-4 h-4" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="records" className="gap-2">
              <Database className="w-4 h-4" />
              System of Record
            </TabsTrigger>
          </TabsList>

          <TabsContent value="docs" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Edit document snippets that the RAG system retrieves from.
              </p>
              <Button variant="outline" size="sm" onClick={handleAddDocument} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Document
              </Button>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => (
                <DocumentEditor
                  key={doc.id}
                  document={doc}
                  onUpdate={(updates) => updateDocument(doc.id, updates)}
                  onDelete={() => handleDeleteDocument(doc.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Edit structured system-of-record data (the source of truth).
            </p>

            <div className="space-y-4">
              {systemRecords.map((record) => (
                <RecordEditor
                  key={record.id}
                  record={record}
                  onUpdate={(updates) => updateSystemRecord(record.id, updates)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

interface DocumentEditorProps {
  document: Document;
  onUpdate: (updates: Partial<Document>) => void;
  onDelete: () => void;
}

function DocumentEditor({ document, onUpdate, onDelete }: DocumentEditorProps) {
  const scenario = demoScenarios.find((s) => s.id === document.scenarioId);

  return (
    <div className="rounded-xl border border-rag/30 bg-rag-muted/30 p-5">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs px-2 py-1 rounded-full bg-rag/20 text-rag font-medium">
          {scenario?.icon} {scenario?.name || document.scenarioId}
        </span>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
          <Input
            value={document.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="bg-card/50 border-border"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
          <Input
            type="date"
            value={document.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="bg-card/50 border-border"
          />
        </div>
      </div>
      
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Content</label>
        <Textarea
          value={document.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="bg-card/50 border-border min-h-[80px] font-mono text-sm"
        />
      </div>
    </div>
  );
}

interface RecordEditorProps {
  record: SystemRecord;
  onUpdate: (updates: Partial<SystemRecord>) => void;
}

function RecordEditor({ record, onUpdate }: RecordEditorProps) {
  const scenario = demoScenarios.find((s) => s.id === record.scenarioId);
  const [jsonStr, setJsonStr] = useState(JSON.stringify(record.data, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleJsonChange = (value: string) => {
    setJsonStr(value);
    try {
      const parsed = JSON.parse(value);
      setJsonError(null);
      onUpdate({ data: parsed });
    } catch (e) {
      setJsonError('Invalid JSON');
    }
  };

  return (
    <div className="rounded-xl border border-deterministic/30 bg-deterministic-muted/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs px-2 py-1 rounded-full bg-deterministic/20 text-deterministic font-medium">
          {scenario?.icon} {scenario?.name || record.scenarioId}
        </span>
        <span className="text-xs text-muted-foreground">
          Source: {record.source}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Source API</label>
          <Input
            value={record.source}
            onChange={(e) => onUpdate({ source: e.target.value })}
            className="bg-card/50 border-border"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Updated</label>
          <Input
            type="datetime-local"
            value={record.last_updated.slice(0, 16)}
            onChange={(e) => onUpdate({ last_updated: new Date(e.target.value).toISOString() })}
            className="bg-card/50 border-border"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Data (JSON)
          {jsonError && <span className="text-destructive ml-2">{jsonError}</span>}
        </label>
        <Textarea
          value={jsonStr}
          onChange={(e) => handleJsonChange(e.target.value)}
          className={`bg-card/50 border-border min-h-[150px] font-mono text-sm ${
            jsonError ? 'border-destructive' : ''
          }`}
        />
      </div>
    </div>
  );
}
