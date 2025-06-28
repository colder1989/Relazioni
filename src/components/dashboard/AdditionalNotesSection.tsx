
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, FileText } from 'lucide-react';

interface AdditionalNotesData {
  notes: string;
}

interface AdditionalNotesSectionProps {
  data: AdditionalNotesData;
  onUpdate: (data: AdditionalNotesData) => void;
}

export const AdditionalNotesSection = ({ data, onUpdate }: AdditionalNotesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateNotes = (notes: string) => {
    onUpdate({ notes });
  };

  return (
    <Card className="section-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-falco-navy/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Note Aggiuntive</CardTitle>
                <span className="text-sm text-slate-500">(Opzionale)</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <p className="text-sm text-slate-600">
              Spazio per eventuali note aggiuntive, osservazioni particolari o dettagli specifici dell'indagine
            </p>

            <div className="space-y-2">
              <Label>Note e Osservazioni</Label>
              <Textarea
                placeholder="Inserisci qui eventuali note aggiuntive, osservazioni particolari, dettagli specifici dell'indagine o altre informazioni rilevanti..."
                value={data.notes}
                onChange={(e) => updateNotes(e.target.value)}
                className="professional-input min-h-[150px]"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
