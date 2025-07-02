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
          margin: 15mm;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }

        /* Reset di base per il PDF */
        #falco-pdf-template {
          margin: 0 !important;
          padding: 0 !important;
          width: 210mm !important;
          min-height: 297mm !important;
          font-family: 'Times New Roman', serif !important;
          font-size: 11pt !important;
          line-height: 1.4 !important;
          color: #000 !important;
          background: white !important;
          box-sizing: border-box !important;
          position: relative !important;
        }

        /* Contenitore per centrare tutto il contenuto */
        .pdf-container {
          width: 100% !important;
          max-width: 180mm !important; /* Larghezza contenuto meno margini */
          margin: 0 auto !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        /* Stili base per tutti i contenuti del PDF */
        .pdf-base-styles {
          width: 100% !important;
          margin: 0 auto !important;
          padding: 0 !important;
          font-family: 'Times New Roman', serif !important;
          font-size: 11pt !important;
          line-height: 1.4 !important;
          color: #000 !important;
          background: white !important;
          box-sizing: border-box !important;
        }

        /* Stili specifici per la pagina di copertina */
        .pdf-cover-page-styles {
          min-height: 267mm !important; /* Altezza A4 meno margini */
          position: relative !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          page-break-after: always !important;
        }

        /* Stili per il contenuto del report */
        .pdf-report-content-styles {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Header info centrato */
        .header-info {
          font-size: 9pt !important;
          text-align: center !important;
          margin: 0 auto 15pt auto !important;
          border-bottom: 1pt solid #000 !important;
          padding-bottom: 10pt !important;
          width: 100% !important;
        }

        /* Footer della copertina */
        .cover-page-footer {
          text-align: center !important;
          font-size: 9pt !important;
          color: #000 !important;
          border-top: 1pt solid #000 !important;
          padding-top: 10pt !important;
          margin-top: auto !important;
          width: 100% !important;
        }

        /* Centratura dei titoli */
        .title-center {
          text-align: center !important;
          margin: 0 auto !important;
          width: 100% !important;
        }

        /* Immagini responsive e centrate */
        .pdf-image {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
        }

        /* Logo aziendale */
        .agency-logo {
          max-width: 80px !important;
          max-height: 80px !important;
          margin: 0 auto 20pt auto !important;
          display: block !important;
        }

        /* Sezioni del report */
        .report-section {
          margin-bottom: 20pt !important;
          width: 100% !important;
          page-break-inside: avoid !important;
        }

        .report-section h2 {
          font-size: 14pt !important;
          font-weight: bold !important;
          margin-bottom: 10pt !important;
          text-align: center !important;
          color: #000 !important;
        }

        .report-section h3 {
          font-size: 12pt !important;
          font-weight: bold !important;
          margin-bottom: 8pt !important;
          color: #000 !important;
        }

        /* Tabelle */
        .pdf-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 10pt 0 !important;
        }

        .pdf-table th,
        .pdf-table td {
          border: 1pt solid #000 !important;
          padding: 5pt !important;
          text-align: left !important;
          font-size: 10pt !important;
        }

        .pdf-table th {
          background-color: #f0f0f0 !important;
          font-weight: bold !important;
        }

        /* Foto griglia */
        .photo-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 10pt !important;
          margin: 10pt 0 !important;
          width: 100% !important;
        }

        .photo-item {
          text-align: center !important;
          page-break-inside: avoid !important;
        }

        .photo-item img {
          max-width: 100% !important;
          height: auto !important;
          border: 1pt solid #ccc !important;
        }

        .photo-caption {
          font-size: 9pt !important;
          margin-top: 5pt !important;
          font-style: italic !important;
        }

        /* Page breaks */
        .page-break {
          page-break-before: always !important;
        }

        .no-break {
          page-break-inside: avoid !important;
        }

        /* Firma sezione */
        .signature-section {
          margin-top: 30pt !important;
          page-break-inside: avoid !important;
        }

        .signature-line {
          border-bottom: 1pt solid #000 !important;
          width: 200pt !important;
          margin: 20pt auto 5pt auto !important;
          display: block !important;
        }

        .signature-label {
          text-align: center !important;
          font-size: 10pt !important;
          margin-top: 5pt !important;
        }

        /* Utility classes */
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold !important; }
        .font-italic { font-style: italic !important; }
      `}</style>

      <div className="pdf-container">
        {/* Pagina di copertina */}
        <div className="pdf-base-styles pdf-cover-page-styles">
          <FalcoPDFCoverPage data={data} agencyProfile={agencyProfile} />
        </div>

        {/* Contenuto del report */}
        <div className="pdf-base-styles pdf-report-content-styles">
          <FalcoPDFReportContent data={data} agencyProfile={agencyProfile} />
        </div>
      </div>
    </div>
  );
};