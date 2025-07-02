import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Plus, CheckCircle, Clock, AlertCircle, Shield, Search, LogOut, UserCircle, Loader2 } from 'lucide-react';
import { ClientInfoSection } from './ClientInfoSection';
import { InvestigatedInfoSection } from './InvestigatedInfoSection';
import { MandateDetailsSection } from './MandateDetailsSection';
import { ObservationDaysSection } from './ObservationDaysSection';
import { PhotosSection } from './PhotosSection';
import { AdditionalNotesSection } from './AdditionalNotesSection';
import { PhotoManagementSection } from './PhotoManagementSection';
import { ConclusionsSection } from './ConclusionsSection';
import { PrivacySection } from './PrivacySection';
import { ReportPreview } from './ReportPreview';
import { FalcoPDFTemplate } from './FalcoPDFTemplate';
import { useInvestigationData, Photo } from '@/hooks/useInvestigationData';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getProxyImageUrl } from '@/lib/utils';

interface AgencyProfile {
  first_name: string;
  last_name: string;
  agency_name: string;
  agency_address: string;
  agency_phone: string;
  agency_email: string;
  agency_website: string;
  agency_logo_url: string;
}

export const InvestigationDashboard = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile | null>(null);
  const { data, updateData, resetData, isLoadingReport } = useInvestigationData();
  const { session, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const fetchAgencyProfile = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, agency_name, agency_address, agency_phone, agency_email, agency_website, agency_logo_url')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error fetching agency profile:', error);
        } else if (data) {
          setAgencyProfile(data);
        } else {
          setAgencyProfile(null); // Ensure profile is null if not found
        }
      } else {
        setAgencyProfile(null); // Clear profile if no session
      }
    };

    if (!isSessionLoading) {
      fetchAgencyProfile();
    }
  }, [session, isSessionLoading]);

  const handleDirectExportPDF = async () => {
    if (!data || !agencyProfile) {
      toast({
        title: "Errore",
        description: "Dati non disponibili per l'esportazione.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Esportazione PDF",
      description: "Generazione del report in corso...",
      duration: 3000,
    });

    let tempDiv: HTMLDivElement | null = null;
    let root: ReactDOM.Root | null = null;

    try {
      // Creiamo un contenitore temporaneo ottimizzato
      tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-99999px';
      tempDiv.style.left = '-99999px';
      tempDiv.style.width = '794px'; // Larghezza A4 in pixel (210mm)
      tempDiv.style.height = 'auto';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Times New Roman, serif';
      tempDiv.style.fontSize = '11pt';
      tempDiv.style.overflow = 'visible';
      document.body.appendChild(tempDiv);

      root = ReactDOM.createRoot(tempDiv);
      
      // Renderizziamo il nuovo template
      root.render(
        <FalcoPDFTemplate data={data} agencyProfile={agencyProfile} />
      );

      // Tempo di attesa per il rendering e caricamento immagini
      await new Promise(resolve => setTimeout(resolve, 8000)); // 8 secondi per sicurezza

      // Troviamo l'elemento da convertire
      const element = document.getElementById('falco-pdf-template');
      if (!element) {
        throw new Error('Elemento PDF template non trovato');
      }

      // Assicuriamoci che l'elemento sia completamente visibile
      element.style.display = 'block';
      element.style.visibility = 'visible';
      element.style.opacity = '1';

      console.log('Elemento trovato, dimensioni:', {
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight
      });

      // Opzioni ottimizzate per la nuova struttura
      const options = {
        margin: 0, // Margini gestiti dal CSS
        filename: `Report_Investigativo_${data.investigatedInfo.fullName?.replace(/\s/g, '_') || 'Sconosciuto'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2, // Alta risoluzione
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          width: element.scrollWidth,
          height: element.scrollHeight,
          windowWidth: 794, // A4 width in pixels
          windowHeight: 1123, // A4 height in pixels
          logging: false, // Disabilita i log per performance
          onclone: (clonedDoc: Document) => {
            // Ottimizzazioni nel documento clonato
            const clonedElement = clonedDoc.getElementById('falco-pdf-template');
            if (clonedElement) {
              clonedElement.style.width = '794px';
              clonedElement.style.margin = '0';
              clonedElement.style.padding = '0';
              clonedElement.style.transform = 'none';
              
              // Assicuriamoci che tutte le immagini siano caricate
              const images = clonedElement.querySelectorAll('img');
              images.forEach(img => {
                if (img.complete && img.naturalWidth === 0) {
                  img.style.display = 'none';
                }
              });
            }
          }
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          precision: 16
        },
        pagebreak: { 
          mode: ['avoid-all', 'css'],
          before: ['.page-break'],
          avoid: ['.section', '.photo-grid', '.photo-row', '.signature-section', '.privacy-notes']
        }
      };

      console.log('Avvio generazione PDF con opzioni:', options);

      // Generiamo il PDF
      await html2pdf().set(options).from(element).save();

      toast({
        title: "Successo",
        description: "Report PDF esportato con successo!",
        duration: 5000,
      });

    } catch (error) {
      console.error('Errore durante l\'esportazione PDF:', error);
      toast({
        title: "Errore",
        description: `Errore durante l'esportazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsExporting(false);
      
      // Pulizia accurata
      try {
        if (root && tempDiv && tempDiv.parentNode) {
          root.unmount();
          document.body.removeChild(tempDiv);
        }
      } catch (cleanupError) {
        console.warn('Errore durante la pulizia:', cleanupError);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getCompletionStats = () => {
    const sections = [
      data.clientInfo.fullName,
      data.investigatedInfo.fullName,
      data.mandateDetails.assignmentDate,
      data.observationDays.length > 0,
      data.conclusions.text
    ];
    const completed = sections.filter(Boolean).length;
    return { completed, total: sections.length, percentage: Math.round((completed / sections.length) * 100) };
  };

  const stats = getCompletionStats();

  const getStatusIcon = () => {
    if (stats.percentage === 100) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (stats.percentage >= 50) return <Clock className="w-5 h-5 text-blue-400" />;
    return <AlertCircle className="w-5 h-5 text-amber-400" />;
  };

  const getStatusText = () => {
    if (stats.percentage === 100) return "Relazione Completa";
    if (stats.percentage >= 50) return "In Corso";
    return "Da Iniziare";
  };

  const getStatusClass = () => {
    if (stats.percentage === 100) return "status-complete";
    if (stats.percentage >= 50) return "status-progress";
    return "status-pending";
  };

  if (isLoadingReport || isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-900 text-slate-300">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Caricamento report...
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>
      {/* Professional Investigative Header */}
      <header className="glass-effect border-b shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 slide-in-up">
              <div className="w-12 h-12 falco-gradient rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">{agencyProfile?.agency_name || "Falco Investigation"}</h1>
                <p className="text-slate-300 flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Dashboard Relazioni Investigative</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getStatusClass()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium text-white">{getStatusText()}</span>
              </div>
              <Badge className="professional-badge">
                {stats.percentage}% Completato
              </Badge>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="floating-button flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Anteprima</span>
              </Button>
              <Button
                onClick={handleDirectExportPDF}
                className="falco-gradient text-white hover:opacity-90 flex items-center space-x-2 floating-button"
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isExporting ? 'Esporta PDF' : 'Esporta PDF'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="floating-button flex items-center space-x-2"
              >
                <UserCircle className="w-4 h-4" />
                <span>Profilo</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="floating-button flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Esci</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showPreview ? (
          <div className="fade-in">
            {/* La preview ora usa FalcoPDFTemplate per una rappresentazione fedele del PDF */}
            <ReportPreview data={data} agencyProfile={agencyProfile} onClose={() => setShowPreview(false)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content with staggered animations */}
            <div className="lg:col-span-2 space-y-6">
              <div className="stagger-item">
                <ClientInfoSection 
                  data={data.clientInfo} 
                  onUpdate={(clientInfo) => updateData({ clientInfo })} 
                />
              </div>
              
              <div className="stagger-item">
                <InvestigatedInfoSection 
                  data={data.investigatedInfo} 
                  onUpdate={(investigatedInfo) => updateData({ investigatedInfo })} 
                />
              </div>
              
              <div className="stagger-item">
                <MandateDetailsSection 
                  data={data.mandateDetails} 
                  onUpdate={(mandateDetails) => updateData({ mandateDetails })} 
                />
              </div>

              <div className="stagger-item">
                <PhotoManagementSection 
                  data={data.photoManagement} 
                  onUpdate={(photoManagement) => updateData({ photoManagement })} 
                />
              </div>
              
              <div className="stagger-item">
                <ObservationDaysSection 
                  data={data.observationDays} 
                  onUpdate={(observationDays) => updateData({ observationDays })} 
                />
              </div>
              
              <div className="stagger-item">
                <PhotosSection 
                  data={data.photos} 
                  onUpdate={(photos) => updateData({ photos })} 
                />
              </div>
              
              <div className="stagger-item">
                <AdditionalNotesSection 
                  data={data.additionalNotes} 
                  onUpdate={(additionalNotes) => updateData({ additionalNotes })} 
                />
              </div>
              
              <div className="stagger-item">
                <ConclusionsSection 
                  data={data.conclusions} 
                  onUpdate={(conclusions) => updateData({ conclusions })} 
                />
              </div>
              
              <div className="stagger-item">
                <PrivacySection 
                  data={data.privacy} 
                  onUpdate={(privacy) => updateData({ privacy })} 
                />
              </div>
            </div>

            {/* Enhanced Professional Sidebar */}
            <div className="space-y-6">
              <Card className="section-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2 text-slate-100">
                    {getStatusIcon()}
                    <span>Stato Relazione</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Progresso Compilazione</span>
                    <span className="text-sm font-medium text-blue-400">{stats.completed}/{stats.total}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetData}
                      className="w-full floating-button"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuova Relazione
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="section-card">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-100">Guida Professionale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-3">
                    {[
                      "Compila le informazioni cliente",
                      "Inserisci dati dell'investigato", 
                      "Specifica dettagli del mandato",
                      "Configura gestione foto",
                      "Aggiungi giorni di osservazione",
                      "Carica foto e documenti",
                      "Aggiungi note extra se necessario",
                      "Scrivi le conclusioni",
                      "Esporta la relazione finale"
                    ].map((step, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-3 p-3 rounded-lg professional-hover"
                      >
                        <div className={`step-indicator ${index < stats.completed ? 'active' : ''}`}>
                          {index + 1}
                        </div>
                        <p className="text-slate-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Stats Card */}
              <Card className="section-card">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-100">Statistiche Investigative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 professional-accent rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{data.observationDays.length}</div>
                      <div className="text-xs text-slate-300">Giorni Osservazione</div>
                    </div>
                    <div className="text-center p-4 professional-accent rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">{data.photos.length}</div>
                      <div className="text-xs text-slate-300">Foto Caricate</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 professional-accent rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">{data.investigatedInfo.vehicles.length}</div>
                      <div className="text-xs text-slate-300">Veicoli Monitorati</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};