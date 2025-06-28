import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { ReportContent } from '@/components/dashboard/ReportContent'; // Corretto: da ReportTemplate a ReportContent
import { FalcoPDFTemplate } from './FalcoPDFTemplate';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';
import { getProxyImageUrl } from '@/lib/utils';

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
        title: "Attenzione",
        description: "L'anteprima non è ancora pronta per l'esportazione.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Esportazione PDF",
      description: "Preparazione del report per l'esportazione...",
      duration: 3000,
    });

    let tempDiv: HTMLDivElement | null = null;
    let root: ReactDOM.Root | null = null;

    try {
      tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);

      root = ReactDOM.createRoot(tempDiv);
      // Render the FalcoPDFTemplate into the temporary div for export
      root.render(
        <FalcoPDFTemplate data={previewData} agencyProfile={previewAgencyProfile} />
      );

      // Give React time to render and images to load
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      // Ensure the element is visible for html2pdf.js to capture it correctly
      const element = document.getElementById('falco-pdf-template');
      if (element) {
        element.style.display = 'block';
      }

      console.log("Content of tempDiv before PDF generation:", tempDiv.innerHTML);

      const options = {
        margin: [10, 10, 15, 10], // Margini in mm
        filename: `Report_Investigativo_${previewData.investigatedInfo.fullName.replace(/\s/g, '_') || 'Sconosciuto'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break',
          avoid: ['.no-break', '.signature-section', '.header-info']
        },
        mode: 'html' 
      };

      await html2pdf().set(options).from(element).save();

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
    } finally {
      setIsExporting(false);
      if (root && tempDiv && tempDiv.parentNode) {
        root.unmount();
        document.body.removeChild(tempDiv);
      }
      // Ensure the element is hidden again
      const element = document.getElementById('falco-pdf-template');
      if (element) {
        element.style.display = 'none';
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
              )}
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
              <>
                <ReportContent data={previewData} agencyProfile={previewAgencyProfile} isCoverPage={true} className="print-page-break" />
                <ReportContent data={previewData} agencyProfile={previewAgencyProfile} isCoverPage={false} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};