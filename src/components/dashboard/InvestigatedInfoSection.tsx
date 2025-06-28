
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, UserSearch, Plus, Trash2 } from 'lucide-react';
import { InvestigatedInfo } from '@/hooks/useInvestigationData';

interface InvestigatedInfoSectionProps {
  data: InvestigatedInfo;
  onUpdate: (data: InvestigatedInfo) => void;
}

export const InvestigatedInfoSection = ({ data, onUpdate }: InvestigatedInfoSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field: keyof Omit<InvestigatedInfo, 'vehicles'>, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const addVehicle = () => {
    const newVehicle = { model: '', color: '', licensePlate: '' };
    onUpdate({ ...data, vehicles: [...data.vehicles, newVehicle] });
  };

  const removeVehicle = (index: number) => {
    const newVehicles = data.vehicles.filter((_, i) => i !== index);
    onUpdate({ ...data, vehicles: newVehicles });
  };

  const updateVehicle = (index: number, field: string, value: string) => {
    const newVehicles = data.vehicles.map((vehicle, i) => 
      i === index ? { ...vehicle, [field]: value } : vehicle
    );
    onUpdate({ ...data, vehicles: newVehicles });
  };

  return (
    <Card className="section-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-falco-navy/10 rounded-lg flex items-center justify-center">
                  <UserSearch className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Informazioni Investigato</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="investigated-name">Nome Completo *</Label>
                <Input
                  id="investigated-name"
                  placeholder="Nome e cognome dell'investigato"
                  value={data.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investigated-address">Indirizzo Completo</Label>
                <Input
                  id="investigated-address"
                  placeholder="Via, numero civico, città, CAP"
                  value={data.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investigated-birth-date">Data di Nascita</Label>
                <Input
                  id="investigated-birth-date"
                  type="date"
                  value={data.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="professional-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investigated-birth-place">Luogo di Nascita</Label>
                <Input
                  id="investigated-birth-place"
                  placeholder="Città di nascita"
                  value={data.birthPlace}
                  onChange={(e) => handleChange('birthPlace', e.target.value)}
                  className="professional-input"
                />
              </div>
            </div>
            
            {/* Vehicles Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Veicoli Utilizzati</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVehicle}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Aggiungi Veicolo</span>
                </Button>
              </div>
              
              {data.vehicles.map((vehicle, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`vehicle-model-${index}`}>Modello</Label>
                    <Input
                      id={`vehicle-model-${index}`}
                      placeholder="Es. Fiat Panda"
                      value={vehicle.model}
                      onChange={(e) => updateVehicle(index, 'model', e.target.value)}
                      className="professional-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`vehicle-color-${index}`}>Colore</Label>
                    <Input
                      id={`vehicle-color-${index}`}
                      placeholder="Es. Bianco"
                      value={vehicle.color}
                      onChange={(e) => updateVehicle(index, 'color', e.target.value)}
                      className="professional-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`vehicle-plate-${index}`}>Targa</Label>
                    <Input
                      id={`vehicle-plate-${index}`}
                      placeholder="Es. AB123CD"
                      value={vehicle.licensePlate}
                      onChange={(e) => updateVehicle(index, 'licensePlate', e.target.value)}
                      className="professional-input"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeVehicle(index)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
