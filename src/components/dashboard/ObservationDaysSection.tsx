
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Calendar, Plus, Trash2, MapPin } from 'lucide-react';
import { ObservationDay } from '@/hooks/useInvestigationData';

interface ObservationDaysSectionProps {
  data: ObservationDay[];
  onUpdate: (data: ObservationDay[]) => void;
}

export const ObservationDaysSection = ({ data, onUpdate }: ObservationDaysSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const addObservationDay = () => {
    const newDay: ObservationDay = {
      id: Date.now().toString(),
      type: 'single',
      date: '',
      startTime: '',
      endTime: '',
      locations: [],
      description: '',
    };
    onUpdate([...data, newDay]);
  };

  const removeObservationDay = (id: string) => {
    onUpdate(data.filter(day => day.id !== id));
  };

  const updateObservationDay = (id: string, field: keyof ObservationDay, value: any) => {
    onUpdate(data.map(day => 
      day.id === id ? { ...day, [field]: value } : day
    ));
  };

  const addLocation = (dayId: string) => {
    const newLocation = { address: '', placeName: '' };
    const day = data.find(d => d.id === dayId);
    if (day) {
      updateObservationDay(dayId, 'locations', [...day.locations, newLocation]);
    }
  };

  const removeLocation = (dayId: string, index: number) => {
    const day = data.find(d => d.id === dayId);
    if (day) {
      const newLocations = day.locations.filter((_, i) => i !== index);
      updateObservationDay(dayId, 'locations', newLocations);
    }
  };

  const updateLocation = (dayId: string, locationIndex: number, field: string, value: string) => {
    const day = data.find(d => d.id === dayId);
    if (day) {
      const newLocations = day.locations.map((location, i) => 
        i === locationIndex ? { ...location, [field]: value } : location
      );
      updateObservationDay(dayId, 'locations', newLocations);
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
                  <Calendar className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Giorni di Osservazione</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600">Aggiungi i giorni di osservazione e le attività svolte</p>
              <Button
                type="button"
                onClick={addObservationDay}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Giorno</span>
              </Button>
            </div>

            {data.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nessun giorno di osservazione aggiunto</p>
                <p className="text-sm">Clicca "Aggiungi Giorno" per iniziare</p>
              </div>
            )}

            {data.map((day, index) => (
              <div key={day.id} className="border border-slate-200 rounded-lg p-6 space-y-4 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Giorno {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeObservationDay(day.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo Osservazione</Label>
                    <Select 
                      value={day.type} 
                      onValueChange={(value: 'single' | 'multiple' | 'general') => 
                        updateObservationDay(day.id, 'type', value)
                      }
                    >
                      <SelectTrigger className="professional-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-200 z-50">
                        <SelectItem value="single">Singolo giorno</SelectItem>
                        <SelectItem value="multiple">Più giorni</SelectItem>
                        <SelectItem value="general">Generale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={day.date}
                      onChange={(e) => updateObservationDay(day.id, 'date', e.target.value)}
                      className="professional-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Inizio</Label>
                      <Input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => updateObservationDay(day.id, 'startTime', e.target.value)}
                        className="professional-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fine</Label>
                      <Input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => updateObservationDay(day.id, 'endTime', e.target.value)}
                        className="professional-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Luoghi Visitati</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLocation(day.id)}
                      className="flex items-center space-x-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Aggiungi Luogo</span>
                    </Button>
                  </div>

                  {day.locations.map((location, locationIndex) => (
                    <div key={locationIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
                      <div className="space-y-2">
                        <Label>Nome Luogo</Label>
                        <Input
                          placeholder="Es. Ufficio, Bar Central, etc."
                          value={location.placeName}
                          onChange={(e) => updateLocation(day.id, locationIndex, 'placeName', e.target.value)}
                          className="professional-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Indirizzo</Label>
                        <Input
                          placeholder="Via, numero civico, città"
                          value={location.address}
                          onChange={(e) => updateLocation(day.id, locationIndex, 'address', e.target.value)}
                          className="professional-input"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLocation(day.id, locationIndex)}
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Descrizione Attività</Label>
                  <Textarea
                    placeholder="Descrivi dettagliatamente le attività osservate durante questo giorno..."
                    value={day.description}
                    onChange={(e) => updateObservationDay(day.id, 'description', e.target.value)}
                    className="professional-input min-h-[120px]"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
