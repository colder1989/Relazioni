
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Camera, Settings } from 'lucide-react';

interface PhotoManagementData {
  photoStrategy: 'per-day' | 'separate-dossier';
}

interface PhotoManagementSectionProps {
  data: PhotoManagementData;
  onUpdate: (data: PhotoManagementData) => void;
}

export const PhotoManagementSection = ({ data, onUpdate }: PhotoManagementSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updatePhotoStrategy = (strategy: 'per-day' | 'separate-dossier') => {
    onUpdate({ photoStrategy: strategy });
  };

  return (
    <Card className="section-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-falco-navy/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Gestione Foto</CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <p className="text-sm text-slate-600">
              Scegli come organizzare le foto nella relazione
            </p>

            <div className="space-y-4">
              <Label className="text-base font-medium">Strategia Fotografica</Label>
              <RadioGroup 
                value={data.photoStrategy} 
                onValueChange={(value: 'per-day' | 'separate-dossier') => updatePhotoStrategy(value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="per-day" id="per-day" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="per-day" className="font-medium cursor-pointer">
                      Foto per ogni giorno di osservazione
                    </Label>
                    <p className="text-sm text-slate-600">
                      Le foto vengono associate a ciascun giorno di osservazione specifico
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="separate-dossier" id="separate-dossier" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="separate-dossier" className="font-medium cursor-pointer">
                      Fascicolo fotografico separato
                    </Label>
                    <p className="text-sm text-slate-600">
                      Tutte le foto vengono raccolte in una sezione dedicata alla fine della relazione
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-800 mb-2">
                <Camera className="w-4 h-4" />
                <span className="font-medium">Suggerimento</span>
              </div>
              <p className="text-sm text-blue-700">
                La scelta dipende dal tipo di indagine: per osservazioni dettagliate giorno per giorno, 
                scegli "Foto per ogni giorno". Per relazioni più sintetiche con documentazione fotografica 
                complessiva, scegli "Fascicolo separato".
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
