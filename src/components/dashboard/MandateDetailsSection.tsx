
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, FileText } from 'lucide-react';
import { MandateDetails } from '@/hooks/useInvestigationData';

interface MandateDetailsSectionProps {
  data: MandateDetails;
  onUpdate: (data: MandateDetails) => void;
}

export const MandateDetailsSection = ({ data, onUpdate }: MandateDetailsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field: keyof MandateDetails, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const investigationTypes = [
    'Infedeltà coniugale',
    'Controllo patrimonio',
    'Pedinamento',
    'Verifica comportamenti',
    'Indagini aziendali',
    'Controllo dipendenti',
    'Ricerca persone',
    'Altro'
  ];

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
                <CardTitle className="text-xl">Dettagli Mandato</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assignment-date">Data Conferimento Incarico *</Label>
                <Input
                  id="assignment-date"
                  type="date"
                  value={data.assignmentDate}
                  onChange={(e) => handleChange('assignmentDate', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investigation-type">Tipo di Indagine *</Label>
                <Select value={data.investigationType} onValueChange={(value) => handleChange('investigationType', value)}>
                  <SelectTrigger className="professional-input">
                    <SelectValue placeholder="Seleziona tipo indagine" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 z-50">
                    {investigationTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Finalità dell'Indagine *</Label>
              <Textarea
                id="purpose"
                placeholder="Descrivi la finalità e gli obiettivi dell'indagine..."
                value={data.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                className="professional-input min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="protected-rights">Diritti Tutelati</Label>
              <Textarea
                id="protected-rights"
                placeholder="Specifica i diritti che si intendono tutelare con l'indagine..."
                value={data.protectedRights}
                onChange={(e) => handleChange('protectedRights', e.target.value)}
                className="professional-input min-h-[100px]"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
