import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Camera, Upload, Trash2, Image, Loader2 } from 'lucide-react';
import { Photo } from '@/hooks/useInvestigationData';
// import { supabase } from '@/integrations/supabase/client'; // No longer needed for photo upload
import { useToast } from '@/components/ui/use-toast';

interface PhotosSectionProps {
  data: Photo[];
  onUpdate: (data: Photo[]) => void;
}

export const PhotosSection = ({ data, onUpdate }: PhotosSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadingPhotoId, setUploadingPhotoId] = useState<string | null>(null);
  const { toast } = useToast();

  const addPhoto = () => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      description: '',
      time: '',
      location: '',
      date: '',
      url: '', // Initialize url for new photo
    };
    onUpdate([...data, newPhoto]);
  };

  const removePhoto = (id: string, url?: string) => {
    // Revoke the Blob URL to free up memory if it exists
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    onUpdate(data.filter(photo => photo.id !== id));
  };

  const updatePhoto = (id: string, field: keyof Photo, value: any) => {
    onUpdate(data.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  };

  const handleFileChange = async (photoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingPhotoId(photoId);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Devi selezionare un\'immagine da caricare.');
      }

      const file = event.target.files[0];
      
      // Create a local URL for the image (Blob URL)
      const localUrl = URL.createObjectURL(file);

      updatePhoto(photoId, 'url', localUrl);
      toast({
        title: "Successo",
        description: "Foto caricata localmente per l'anteprima.",
      });
    } catch (error) {
      console.error('Error processing photo:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare la foto localmente.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhotoId(null);
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
                  <Camera className="w-4 h-4 text-falco-navy" />
                </div>
                <CardTitle className="text-xl">Documentazione Fotografica</CardTitle>
                {data.length > 0 && (
                  <span className="text-sm text-slate-500">({data.length} foto caricate)</span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600">Carica foto e documenti relativi all'indagine</p>
              <Button
                type="button"
                onClick={addPhoto}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Aggiungi Foto</span>
              </Button>
            </div>

            {data.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nessuna foto caricata</p>
                <p className="text-sm">Clicca "Aggiungi Foto" per caricare documenti</p>
              </div>
            )}

            {data.map((photo, index) => (
              <div key={photo.id} className="border border-slate-200 rounded-lg p-6 space-y-4 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Foto {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePhoto(photo.id, photo.url)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={uploadingPhotoId === photo.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Carica File</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(photo.id, e)}
                        className="professional-input"
                        disabled={uploadingPhotoId === photo.id}
                      />
                      {uploadingPhotoId === photo.id && (
                        <div className="flex items-center text-sm text-blue-500 mt-2">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Caricamento...
                        </div>
                      )}
                    </div>

                    {photo.url && (
                      <div className="space-y-2">
                        <Label>Anteprima</Label>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <img 
                            src={photo.url} 
                            alt={`Foto ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={photo.date}
                        onChange={(e) => updatePhoto(photo.id, 'date', e.target.value)}
                        className="professional-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ora</Label>
                      <Input
                        type="time"
                        value={photo.time}
                        onChange={(e) => updatePhoto(photo.id, 'time', e.target.value)}
                        className="professional-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Luogo</Label>
                      <Input
                        placeholder="Dove è stata scattata la foto"
                        value={photo.location}
                        onChange={(e) => updatePhoto(photo.id, 'location', e.target.value)}
                        className="professional-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrizione</Label>
                      <Textarea
                        placeholder="Descrivi cosa mostra la foto e il contesto..."
                        value={photo.description}
                        onChange={(e) => updatePhoto(photo.id, 'description', e.target.value)}
                        className="professional-input min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};