import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { ReportContent } from './ReportContent';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';
import { getProxyImageUrl } from '@/lib/utils'; // Importa getProxyImageUrl

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
        title: "Attenzione",
        description: "L'anteprima non è ancora pronta per l'esportazione.",
        variant: "destructive",
      });
      return;
    }

    if (reportRef.current) {
      toast({
        title: "Esportazione PDF",
        description: "Preparazione del report per l'esportazione...",
        duration: 3000,
      });

      // Wait for all images within the preview to load before exporting
      const images = reportRef.current.querySelectorAll('img');
      const imageLoadPromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to not block
        });
      });
      await Promise.all(imageLoadPromises);

      // Add a small additional delay to ensure all rendering is complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Content of reportRef.current before PDF generation:", reportRef.current.innerHTML);

      try {
        await html2pdf().set({ 
          margin: [20, 15, 20, 15], // Margini per il PDF (top, left, bottom, right)
          filename: 'Relazione_Investigativa_Anteprima.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false }, // Mantieni per le immagini
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] }, // Migliora la gestione dei salti pagina
          // Imposta la modalità 'html' per rendere il testo selezionabile
          // Attenzione: potrebbe causare piccole differenze di layout con CSS complessi
          mode: 'html' 
        }).from(reportRef.current).save();

        toast({
          title: "Successo",
          description: "Report PDF esportato con successo!",
        });
      } catch (error) {
        console.error('Error exporting PDF:', error);
        toast({
          title: "Errore",
          description: "Impossibile esportare il report PDF.",
          variant: "destructive",
        });
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
              disabled={isPreparingPreview}
            >
              {isPreparingPreview ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isPreparingPreview ? 'Caricamento...' : 'Esporta PDF'}</span>
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
              <>
                {/* Render cover page */}
                <ReportContent data={previewData} agencyProfile={previewAgencyProfile} isCoverPage={true} className="print-page-break" />
                {/* Render subsequent pages content */}
                <ReportContent data={previewData} agencyProfile={previewAgencyProfile} isCoverPage={false} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};