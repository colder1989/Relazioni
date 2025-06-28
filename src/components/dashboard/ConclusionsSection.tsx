
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, FileCheck } from 'lucide-react';
import { Conclusions } from '@/hooks/useInvestigationData';

interface ConclusionsSectionProps {
  data: Conclusions;
  onUpdate: (data: Conclusions) => void;
}

export const ConclusionsSection = ({ data, onUpdate }: ConclusionsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field: keyof Conclusions, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <Card className="section-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-falco-navy/10 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Conclusioni Investigative</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-2">
              <Label htmlFor="conclusions-text">Relazione Finale *</Label>
              <Textarea
                id="conclusions-text"
                placeholder="Scrivi qui le conclusioni dettagliate dell'indagine, includendo:
- Sintesi delle attività svolte
- Risultati ottenuti
- Valutazioni professionali
- Eventuali raccomandazioni
- Conformità agli obiettivi del mandato"
                value={data.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="professional-input min-h-[300px]"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Suggerimenti per una relazione completa:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Riassumi cronologicamente le attività svolte</li>
                <li>• Presenta i fatti in modo obiettivo e professionale</li>
                <li>• Collega i risultati agli obiettivi del mandato</li>
                <li>• Mantieni un linguaggio tecnico e professionale</li>
                <li>• Evita interpretazioni personali non supportate da fatti</li>
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
