import { ChevronDown } from 'lucide-react';
import { DemoScenario } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScenarioSelectorProps {
  scenarios: DemoScenario[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ScenarioSelector({ scenarios, selectedId, onSelect }: ScenarioSelectorProps) {
  return (
    <Select value={selectedId || ''} onValueChange={onSelect}>
      <SelectTrigger className="w-full bg-card border-border hover:border-primary/50 transition-colors">
        <SelectValue placeholder="Select a demo scenario..." />
      </SelectTrigger>
      <SelectContent>
        {scenarios.map((scenario) => (
          <SelectItem key={scenario.id} value={scenario.id}>
            <span className="flex items-center gap-2">
              <span>{scenario.icon}</span>
              <span>{scenario.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
