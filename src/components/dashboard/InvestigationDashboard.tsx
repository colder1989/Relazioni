import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Loader2 } from 'lucide-react';
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
import { useInvestigationData } from '@/hooks/useInvestigationData';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

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
      description: "Preparazione del report...",
      duration: 3000,
    });

    let tempDiv: HTMLDivElement | null = null;
    let root: ReactDOM.Root | null = null;

    try {
      // Creiamo un contenitore temporaneo semplificato
      tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-99999px';
      tempDiv.style.left = '-99999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Times New Roman, serif';
      tempDiv.style.overflow = 'visible';
      document.body.appendChild(tempDiv);

      root = ReactDOM.createRoot(tempDiv);
      
      // Renderizziamo il template esistente
      root.render(
        <FalcoPDFTemplate data={data} agencyProfile={agencyProfile} />
      );

      // Aspettiamo il rendering
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Troviamo l'elemento
      const element = document.getElementById('falco-pdf-template');
      if (!element) {
        throw new Error('Elemento PDF template non trovato');
      }

      // Rendiamo visibile l'elemento
      element.style.display = 'block';
      element.style.visibility = 'visible';

      console.log('Elemento trovato per export PDF:', {
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      // Opzioni PDF semplificate ma efficaci
      const options = {
        margin: [15, 15, 15, 15], // Margini in mm: top, left, bottom, right
        filename: `Report_Investigativo_${data.investigatedInfo?.fullName?.replace(/\s/g, '_') || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.95 
        },
        html2canvas: { 
          scale: 1.5, // Buona qualità senza essere troppo pesante
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          windowWidth: 794, // A4 width in pixels
          windowHeight: 1123, // A4 height in pixels
          onclone: (clonedDoc: Document) => {
            // Piccole ottimizzazioni nel clone
            const clonedElement = clonedDoc.getElementById('falco-pdf-template');
            if (clonedElement) {
              // Assicuriamoci che il contenitore sia ben centrato
              clonedElement.style.margin = '0 auto';
              clonedElement.style.maxWidth = '180mm';
              
              // Nascondi immagini non caricate
              const images = clonedElement.querySelectorAll('img');
              images.forEach(img => {
                if (!img.complete || img.naturalWidth === 0) {
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
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css'],
          before: ['.page-break'],
          avoid: ['.no-break', '.signature-section', '.header-info']
        }
      };

      console.log('Avvio generazione PDF...');

      // Generiamo il PDF
      await html2pdf().set(options).from(element).save();

      toast({
        title: "Successo!",
        description: "Report PDF esportato con successo",
        duration: 5000,
      });

    } catch (error) {
      console.error('Errore esportazione PDF:', error);
      toast({
        title: "Errore",
        description: `Errore durante l'esportazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsExporting(false);
      
      // Pulizia
      try {
        if (root && tempDiv && tempDiv.parentNode) {
          root.unmount();
          document.body.removeChild(tempDiv);
        }
      } catch (cleanupError) {
        console.warn('Errore pulizia:', cleanupError);
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
      <DashboardHeader
        agencyName={agencyProfile?.agency_name || "Falco Investigation"}
        stats={stats}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        handleExportPDF={handleDirectExportPDF}
        isExporting={isExporting}
        handleSignOut={handleSignOut}
        onProfileClick={() => navigate('/profile')}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showPreview ? (
          <div className="fade-in">
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
            <DashboardSidebar 
              stats={stats} 
              resetData={resetData} 
              data={data} // Pass the full data object
            />
          </div>
        )}
      </div>
    </div>
  );
};