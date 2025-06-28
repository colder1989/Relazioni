
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Dice6, Plus, Trash2 } from 'lucide-react';
import { GamblingActivity } from '@/hooks/useInvestigationData';

interface GamblingActivitiesSectionProps {
  data: GamblingActivity[];
  onUpdate: (data: GamblingActivity[]) => void;
}

export const GamblingActivitiesSection = ({ data, onUpdate }: GamblingActivitiesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const addActivity = () => {
    const newActivity: GamblingActivity = {
      id: Date.now().toString(),
      location: '',
      address: '',
      startTime: '',
      endTime: '',
      description: '',
    };
    onUpdate([...data, newActivity]);
  };

  const removeActivity = (id: string) => {
    onUpdate(data.filter(activity => activity.id !== id));
  };

  const updateActivity = (id: string, field: keyof GamblingActivity, value: string) => {
    onUpdate(data.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
  };

  return (
    <Card className="section-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-falco-navy/10 rounded-lg flex items-center justify-center">
                  <Dice6 className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Attività di Gioco e Scommesse</CardTitle>
                <span className="text-sm text-slate-500">(Opzionale)</span>
                {data.length > 0 && (
                  <span className="text-sm text-slate-500">({data.length} attività)</span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600">Documenta eventuali attività di gioco o scommesse osservate</p>
              <Button
                type="button"
                onClick={addActivity}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Attività</span>
              </Button>
            </div>

            {data.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Dice6 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nessuna attività di gioco registrata</p>
                <p className="text-sm">Aggiungi solo se rilevante per l'indagine</p>
              </div>
            )}

            {data.map((activity, index) => (
              <div key={activity.id} className="border border-slate-200 rounded-lg p-6 space-y-4 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Attività {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeActivity(activity.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome Locale</Label>
                      <Input
                        placeholder="Es. Casino, Sala Slot, Tabaccheria"
                        value={activity.location}
                        onChange={(e) => updateActivity(activity.id, 'location', e.target.value)}
                        className="professional-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Indirizzo</Label>
                      <Input
                        placeholder="Via, numero civico, città"
                        value={activity.address}
                        onChange={(e) => updateActivity(activity.id, 'address', e.target.value)}
                        className="professional-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ora Arrivo</Label>
                        <Input
                          type="time"
                          value={activity.startTime}
                          onChange={(e) => updateActivity(activity.id, 'startTime', e.target.value)}
                          className="professional-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ora Uscita</Label>
                        <Input
                          type="time"
                          value={activity.endTime}
                          onChange={(e) => updateActivity(activity.id, 'endTime', e.target.value)}
                          className="professional-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrizione Dettagliata</Label>
                  <Textarea
                    placeholder="Descrivi le attività osservate, comportamenti, durata della permanenza, etc..."
                    value={activity.description}
                    onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                    className="professional-input min-h-[100px]"
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
