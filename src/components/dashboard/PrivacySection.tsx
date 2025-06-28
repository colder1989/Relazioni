
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Shield } from 'lucide-react';
import { Privacy } from '@/hooks/useInvestigationData';

interface PrivacySectionProps {
  data: Privacy;
  onUpdate: (data: Privacy) => void;
}

export const PrivacySection = ({ data, onUpdate }: PrivacySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof Privacy, value: string) => {
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
                  <Shield className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Privacy e Riservatezza</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-2">
              <Label htmlFor="standard-message">Messaggio Standard</Label>
              <Textarea
                id="standard-message"
                value={data.standardMessage}
                onChange={(e) => handleChange('standardMessage', e.target.value)}
                className="professional-input min-h-[120px]"
                readOnly
              />
              <p className="text-sm text-slate-600">
                Messaggio standard automatico riguardo la riservatezza e conformità privacy
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-notes">Note Aggiuntive Privacy</Label>
              <Textarea
                id="custom-notes"
                placeholder="Aggiungi eventuali note specifiche sulla privacy per questa indagine..."
                value={data.customNotes}
                onChange={(e) => handleChange('customNotes', e.target.value)}
                className="professional-input min-h-[100px]"
              />
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Conformità Normativa:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• GDPR 679/2016 - Regolamento Generale sulla Protezione dei Dati</li>
                <li>• Codice Deontologico degli Investigatori Privati</li>
                <li>• Legge 397/2000 - Disciplina dell'attività investigativa privata</li>
                <li>• D.Lgs. 196/2003 - Codice in materia di protezione dei dati personali</li>
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
