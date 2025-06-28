import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, User, Building, Phone, Mail, Globe, Image as ImageIcon, LogOut } from 'lucide-react'; // Import LogOut
import { useToast } => '@/components/ui/use-toast';

interface ProfileData {
  first_name: string;
  last_name: string;
  agency_name: string;
  agency_address: string;
  agency_phone: string;
  agency_email: string;
  agency_website: string;
  agency_logo_url: string;
}

const Profile: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      getProfile();
    } else if (!isSessionLoading) {
      setLoading(false);
    }
  }, [session, isSessionLoading]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session!;
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name, last_name, agency_name, agency_address, agency_phone, agency_email, agency_website, agency_logo_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        console.error('Error fetching profile in getProfile:', error); // Log di errore
        throw error;
      }

      if (data) {
        console.log('Fetched profile data:', data); // Log dei dati recuperati
        setProfile(data);
      } else {
        console.log('No profile data found for user, initializing with empty.');
        setProfile({
          first_name: '',
          last_name: '',
          agency_name: '',
          agency_address: '',
          agency_phone: '',
          agency_email: '',
          agency_website: '',
          agency_logo_url: '',
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il profilo utente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user } = session!;
      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        console.error('Error updating profile in DB:', error); // Log di errore
        throw error;
      }

      toast({
        title: "Successo",
        description: "Profilo aggiornato con successo!",
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Devi selezionare un\'immagine da caricare.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session!.user.id}-${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      console.log('Attempting to upload file:', fileName, 'to path:', filePath); // Log di caricamento
      const { error: uploadError } = await supabase.storage
        .from('agency-logos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError); // Log di errore storage
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('agency-logos')
        .getPublicUrl(filePath);

      if (publicUrlData) {
        console.log('Public URL obtained:', publicUrlData.publicUrl); // Log URL pubblico
        // Update local state
        setProfile(prev => ({ ...prev!, agency_logo_url: publicUrlData.publicUrl }));
        
        // Immediately save to database
        console.log('Attempting to save logo URL to profile in DB:', publicUrlData.publicUrl); // Log salvataggio DB
        const { error: updateDbError } = await supabase
          .from('profiles')
          .update({ agency_logo_url: publicUrlData.publicUrl })
          .eq('id', session!.user.id);

        if (updateDbError) {
          console.error('Error saving logo URL to profile in DB:', updateDbError); // Log di errore DB
          throw updateDbError;
        }

        toast({
          title: "Successo",
          description: "Logo caricato e salvato con successo!",
        });
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Errore",
        description: `Impossibile caricare il logo: ${error.message || error.toString()}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // The SessionContextProvider will handle the redirect to /login
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Errore",
        description: "Impossibile effettuare il logout.",
        variant: "destructive",
      });
    }
  };

  if (loading || isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-900 text-slate-300">
        Caricamento profilo...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-900 text-slate-300">
        Accedi per visualizzare il tuo profilo.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">Gestione Profilo Agenzia</h1>

        <Card className="section-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2 text-slate-100">
              <User className="w-5 h-5" />
              <span>Informazioni Personali</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nome</Label>
                  <Input
                    id="first_name"
                    value={profile?.first_name || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev!, first_name: e.target.value }))}
                    className="professional-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Cognome</Label>
                  <Input
                    id="last_name"
                    value={profile?.last_name || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev!, last_name: e.target.value }))}
                    className="professional-input"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="falco-gradient">
                {loading ? 'Salvataggio...' : 'Salva Informazioni Personali'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="section-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2 text-slate-100">
              <Building className="w-5 h-5" />
              <span>Dettagli Agenzia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agency_name">Nome Agenzia</Label>
                <Input
                  id="agency_name"
                  value={profile?.agency_name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev!, agency_name: e.target.value }))}
                  className="professional-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency_address">Indirizzo Agenzia</Label>
                <Input
                  id="agency_address"
                  value={profile?.agency_address || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev!, agency_address: e.target.value }))}
                  className="professional-input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agency_phone">Telefono</Label>
                  <Input
                    id="agency_phone"
                    value={profile?.agency_phone || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev!, agency_phone: e.target.value }))}
                    className="professional-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency_email">Email</Label>
                  <Input
                    id="agency_email"
                    type="email"
                    value={profile?.agency_email || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev!, agency_email: e.target.value }))}
                    className="professional-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency_website">Sito Web</Label>
                <Input
                  id="agency_website"
                  value={profile?.agency_website || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev!, agency_website: e.target.value }))}
                  className="professional-input"
                />
              </div>
              <Button type="submit" disabled={loading} className="falco-gradient">
                {loading ? 'Salvataggio...' : 'Salva Dettagli Agenzia'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="section-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2 text-slate-100">
              <ImageIcon className="w-5 h-5" />
              <span>Logo Agenzia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.agency_logo_url ? (
                <div className="space-y-2">
                  <Label>Logo Attuale</Label>
                  <img src={profile.agency_logo_url} alt="Agency Logo" className="max-w-xs h-auto rounded-lg border border-slate-700 p-2 bg-steel-900" />
                </div>
              ) : (
                <p className="text-slate-400">Nessun logo caricato.</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="logo_upload">Carica Nuovo Logo</Label>
                <Input
                  id="logo_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload} // La funzione viene chiamata solo qui
                  disabled={uploading}
                  className="professional-input"
                />
                <Button type="button" disabled={uploading} className="falco-gradient">
                  {uploading ? 'Caricamento...' : 'Carica Logo'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            onClick={handleSignOut}
            className="falco-gradient text-white hover:opacity-90 flex items-center space-x-2 mx-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Esci dal tuo account</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;