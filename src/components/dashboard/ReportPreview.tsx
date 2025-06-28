import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, FileText } from 'lucide-react';
import { InvestigationData } from '@/hooks/useInvestigationData';
import { ReportContent } from './ReportContent';
import html2pdf from 'html2pdf.js';

interface ReportPreviewProps {
  data: InvestigationData;
  onClose: () => void;
}

export const ReportPreview = ({ data, onClose }: ReportPreviewProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      html2pdf().from(element).save('Relazione_Investigativa.pdf');
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
            <Button size="sm" className="falco-gradient text-white" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Esporta PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="text-steel-700 hover:text-steel-900">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow" ref={reportRef}>
          <ReportContent data={data} />
        </div>
      </div>
    </div>
  );
};