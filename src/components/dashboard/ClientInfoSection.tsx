
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, User } from 'lucide-react';
import { ClientInfo } from '@/hooks/useInvestigationData';

interface ClientInfoSectionProps {
  data: ClientInfo;
  onUpdate: (data: ClientInfo) => void;
}

export const ClientInfoSection = ({ data, onUpdate }: ClientInfoSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field: keyof ClientInfo, value: string) => {
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
                  <User className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Informazioni Cliente</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nome Completo *</Label>
                <Input
                  id="client-name"
                  placeholder="Nome e cognome del cliente"
                  value={data.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-address">Indirizzo Completo *</Label>
                <Input
                  id="client-address"
                  placeholder="Via, numero civico, città, CAP"
                  value={data.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-birth-date">Data di Nascita</Label>
                <Input
                  id="client-birth-date"
                  type="date"
                  value={data.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-birth-place">Luogo di Nascita</Label>
                <Input
                  id="client-birth-place"
                  placeholder="Città di nascita"
                  value={data.birthPlace}
                  onChange={(e) => handleChange('birthPlace', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-doc-type">Tipo Documento</Label>
                <Select value={data.documentType} onValueChange={(value) => handleChange('documentType', value)}>
                  <SelectTrigger className="professional-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 z-50">
                    <SelectItem value="Carta d'Identità">Carta d'Identità</SelectItem>
                    <SelectItem value="Patente di Guida">Patente di Guida</SelectItem>
                    <SelectItem value="Passaporto">Passaporto</SelectItem>
                    <SelectItem value="Permesso di Soggiorno">Permesso di Soggiorno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-doc-number">Numero Documento</Label>
                <Input
                  id="client-doc-number"
                  placeholder="Numero del documento"
                  value={data.documentNumber}
                  onChange={(e) => handleChange('documentNumber', e.target.value)}
                  className="professional-input"
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
