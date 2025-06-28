import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, FileText } from 'lucide-react';
import { InvestigationData } from '@/hooks/useInvestigationData';
import { ReportContent } from './ReportContent';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast'; // Import useToast

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
  const { toast } = useToast(); // Initialize useToast

  const handleExportPDF = async () => {
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
            >
              <Download className="w-4 h-4" />
              <span>Esporta PDF</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="text-steel-700 hover:text-steel-900">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow" ref={reportRef}>
          <ReportContent data={data} agencyProfile={agencyProfile} className="p-8 font-inter text-sm leading-relaxed bg-falco-cream text-steel-900" /> {/* Pass className to ReportContent */}
        </div>
      </div>
    </div>
  );
};