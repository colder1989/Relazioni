import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { ReportContent } from './ReportContent';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';

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

  // Funzione per ottenere l'URL proxy dell'immagine
  const getProxyImageUrl = (originalUrl: string) => {
    if (!originalUrl) return ''; // Gestisci il caso di URL vuoto
    const supabaseProjectId = "pdufmdtcuwbedrkzoeko"; // Il tuo Project ID Supabase
    return `https://${supabaseProjectId}.supabase.co/functions/v1/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  };

  useEffect(() => {
    const preparePreview = async () => {
      setIsPreparingPreview(true);
      let tempAgencyProfile = agencyProfile;
      let tempPhotos: Photo[] = [];

      // Pre-process agency logo URL
      if (agencyProfile?.agency_logo_url) {
        tempAgencyProfile = { ...agencyProfile, agency_logo_url: getProxyImageUrl(agencyProfile.agency_logo_url) };
      }

      // Pre-process report photos URLs
      if (data.photos && data.photos.length > 0) {
        tempPhotos = data.photos.map(photo => ({
          ...photo,
          url: photo.url ? getProxyImageUrl(photo.url) : ''
        }));
      }

      setPreviewAgencyProfile(tempAgencyProfile);
      setPreviewData({ ...data, photos: tempPhotos });
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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Increased additional delay

      console.log("Content of reportRef.current before PDF generation:", reportRef.current.innerHTML); // Debugging log

      try {
        await html2pdf().set({ 
          html2canvas: { useCORS: true, scale: 2 }, // Added useCORS and increased scale for better quality
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(reportRef.current).save('Relazione_Investigativa_Anteprima.pdf');

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
              <ReportContent data={previewData} agencyProfile={previewAgencyProfile} className="p-8 font-inter text-sm leading-relaxed bg-falco-cream text-steel-900" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};