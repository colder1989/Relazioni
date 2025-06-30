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

  const investigationTypeDetails: { [key: string]: { purpose: string; protectedRights: string } } = {
    'Infedeltà coniugale': {
      purpose: 'Esecuzione di accertamenti volti a verificare l’esistenza di una relazione sentimentale e la condotta economico-finanziaria del soggetto, anche in relazione agli obblighi di mantenimento nei confronti del figlio minore.',
      protectedRights: 'L’agenzia viene quindi incaricata, su esplicito mandato da parte del mandante, di svolgere ogni utile indagine investigativa finalizzata ad appurare se l’osservato intrattenga un’eventuale relazione sentimentale e se le condizioni economiche non permettano realmente di provvedere ad un sostegno economico da parte dell’osservato, come descritto dal mandante.'
    },
    'Controllo patrimonio': {
      purpose: 'Verifica della situazione patrimoniale e finanziaria del soggetto, inclusi beni immobili, partecipazioni societarie e flussi di reddito.',
      protectedRights: 'Tutela degli interessi economici e patrimoniali del mandante, prevenzione di frodi o recupero crediti.'
    },
    'Pedinamento': {
      purpose: 'Monitoraggio degli spostamenti e delle attività del soggetto per documentarne la routine o specifici comportamenti.',
      protectedRights: 'Acquisizione di prove documentali a tutela di diritti legali o personali.'
    },
    'Verifica comportamenti': {
      purpose: 'Accertamento di comportamenti specifici del soggetto in relazione a sospetti o esigenze del mandante.',
      protectedRights: 'Protezione della reputazione, della sicurezza o degli interessi legittimi del mandante.'
    },
    'Indagini aziendali': {
      purpose: 'Raccolta di informazioni su dipendenti, soci o concorrenti per tutelare gli interessi aziendali.',
      protectedRights: 'Protezione del patrimonio aziendale, della proprietà intellettuale e prevenzione di atti illeciti.'
    },
    'Controllo dipendenti': {
      purpose: 'Monitoraggio della condotta dei dipendenti per verificare la fedeltà, il rispetto degli orari o l’uso improprio di risorse aziendali.',
      protectedRights: 'Tutela degli interessi aziendali, prevenzione di furti, frodi o concorrenza sleale.'
    },
    'Ricerca persone': {
      purpose: 'Localizzazione di persone scomparse o irreperibili per motivi legali o personali.',
      protectedRights: 'Tutela del diritto alla conoscenza e alla protezione di persone vulnerabili.'
    },
    'Altro': {
      purpose: '',
      protectedRights: ''
    }
  };

  const handleChange = (field: keyof MandateDetails, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleInvestigationTypeChange = (value: string) => {
    const details = investigationTypeDetails[value];
    if (details) {
      onUpdate({ 
        ...data, 
        investigationType: value, 
        purpose: details.purpose, 
        protectedRights: details.protectedRights 
      });
    } else {
      onUpdate({ ...data, investigationType: value, purpose: '', protectedRights: '' });
    }
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
                <Select value={data.investigationType} onValueChange={handleInvestigationTypeChange}>
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