import React from 'react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { getProxyImageUrl } from '@/lib/utils';
import { FalcoPDFCoverPage } from './FalcoPDFCoverPage';
import { FalcoPDFReportContent } from './FalcoPDFReportContent';

interface FalcoPDFTemplateProps {
  data: InvestigationData;
  agencyProfile: {
    first_name: string;
    last_name: string;
    agency_name: string;
    agency_address: string;
    agency_phone: string;
    agency_email: string;
    agency_website: string;
    agency_logo_url: string;
  } | null;
}

export const FalcoPDFTemplate = ({ data, agencyProfile }: FalcoPDFTemplateProps) => {
  return (
    <div id="falco-pdf-template">
      <style>{`
        @page {
          size: A4;
          margin: 10mm; /* Margini standard per tutte le pagine */
        }
        
        body {
          -webkit-print-color-adjust: exact; /* For Chrome/Safari */
          print-color-adjust: exact; /* Standard */
        }

        /* Stili base per tutti i contenuti del PDF (copertina e report) */
        .pdf-base-styles {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
          background: white;
          width: 210mm; /* Larghezza A4 esplicita */
          box-sizing: border-box; /* Includi padding/border nella larghezza/altezza */
          padding: 10mm; /* Applica i margini della pagina come padding interno */
        }

        /* Stili specifici per la pagina di copertina */
        .pdf-cover-page-styles {
          height: 297mm; /* Altezza A4 esplicita per la copertina */
          position: relative; /* Necessario per il posizionamento assoluto del footer */
          overflow: hidden; /* Nascondi qualsiasi cosa vada oltre le dimensioni A4 */
          display: flex; /* Usa flexbox per distribuire il contenuto */
          flex-direction: column;
          justify-content: space-between; /* Spinge il contenuto in alto e il footer in basso */
        }

        /* Stili per il footer della pagina di copertina */
        .cover-page-footer {
          text-align: center;
          font-size: 9pt;
          color: #000;
          border-top: 1pt solid #000;
          padding-top: 10pt;
          width: calc(100% - 20mm); /* Larghezza del contenuto meno i margini laterali */
          position: absolute;
          bottom: 10mm; /* Posiziona a 10mm dal fondo della pagina */
          left: 10mm; /* Posiziona a 10mm dal bordo sinistro */
          right: 10mm; /* Posiziona a 10mm dal bordo destro */
          box-sizing: border-box;
        }
        
        .header-info {
          font-size: 9pt;
          text-align: center;
          margin-bottom: 15pt;
          border-bottom: 1pt solid #000;
          padding-bottom: 10pt;
        }
        
        .company-name {
          font-size: 16pt;
          font-weight: bold;
          letter-spacing: 2pt;
          text-align: center;
          margin: 20pt 0 5pt 0;
        }
        
        .company-subtitle {
          font-size: 10pt;
          letter-spacing: 1pt;
          text-align: center;
        }
        
        .report-title {
          font-size: 18pt;
          font-weight: bold;
          text-align: center;
          margin: 30pt 0 20pt 0;
          letter-spacing: 1pt;
        }
        
        .section-title {
          font-size: 12pt;
          font-weight: bold;
          text-align: center;
          margin: 20pt 0 10pt 0;
          text-decoration: underline;
        }
        
        .section-content {
          margin-bottom: 15pt;
          text-align: justify;
          line-height: 1.5;
        }
        
        .observation-date {
          font-weight: bold;
          text-decoration: underline;
          margin: 15pt 0 8pt 0;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .no-break {
          page-break-inside: avoid;
        }
        
        .signature-section {
          margin-top: 40pt;
          text-align: right;
          page-break-inside: avoid;
        }

        /* Pagination style */
        @page {
          @bottom-right {
            content: "Pag. " counter(page) " a " counter(pages);
            font-size: 9pt;
          }
        }
      `}</style>
      
      <FalcoPDFCoverPage data={data} agencyProfile={agencyProfile} />
      <div className="page-break"></div>
      <FalcoPDFReportContent data={data} agencyProfile={agencyProfile} />
    </div>
  );
};