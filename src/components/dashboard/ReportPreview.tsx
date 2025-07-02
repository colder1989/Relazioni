import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { FalcoPDFTemplate } from './FalcoPDFTemplate';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';
import { getProxyImageUrl } from '@/lib/utils';
import ReactDOM from 'react-dom/client'; // Import ReactDOM

interface ReportPreviewProps {
  data: InvestigationData;
  agencyProfile: {
    agency_name: string;
    agency_address: string;
    agency_phone: string;
    agency_email: string;
    agency_website: string;
    agency_logo_url: string;
  } | null;
  onClose: () => void;
}

export const ReportPreview = ({ data, agencyProfile, onClose }: ReportPreviewProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isPreparingPreview, setIsPreparingPreview] = useState(true);
  const [previewData, setPreviewData] = useState<InvestigationData | null>(null);
  const [previewAgencyProfile, setPreviewAgencyProfile] = useState<typeof agencyProfile | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const preparePreview = async () => {
      setIsPreparingPreview(true);
      setPreviewAgencyProfile(agencyProfile);
      setPreviewData(data);
      setIsPreparingPreview(false);
    };

    preparePreview();
  }, [data, agencyProfile]);

  const handleExportPDF = async () => {
    if (!previewData || !previewAgencyProfile) {
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
        <FalcoPDFTemplate data={previewData} agencyProfile={previewAgencyProfile} />
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
        filename: `Report_Investigativo_${previewData.investigatedInfo.fullName?.replace(/\s/g, '_') || 'Sconosciuto'}_${new Date().toISOString().split('T')[0]}.pdf`,
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-falco-cream text-steel-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 falco-gradient rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-steel-900">Anteprima Report Investigativo</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="floating-button flex items-center space-x-2"
              disabled={isPreparingPreview || isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )
              }
              <span>{isExporting ? 'Esportazione...' : 'Esporta PDF'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="text-steel-700 hover:text-steel-900">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isPreparingPreview ? (
          <div className="flex-grow flex items-center justify-center text-steel-700">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            Preparazione anteprima...
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow" ref={reportRef}>
            {previewData && previewAgencyProfile && (
              <FalcoPDFTemplate data={previewData} agencyProfile={previewAgencyProfile} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};