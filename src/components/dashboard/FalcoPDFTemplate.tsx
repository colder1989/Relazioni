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

        /* Reset di base per il PDF - MIGLIORATO */
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

        /* NUOVO - Contenitore per centrare tutto */
        .pdf-container {
          width: 100% !important;
          max-width: 180mm !important;
          margin: 0 auto !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        /* Stili base per tutti i contenuti del PDF - MIGLIORATI */
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

        /* Stili specifici per la pagina di copertina - MIGLIORATI */
        .pdf-cover-page-styles {
          min-height: 267mm !important;
          position: relative !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          page-break-after: always !important;
        }

        /* Stili per il contenuto del report - MIGLIORATI */
        .pdf-report-content-styles {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Header info centrato - MIGLIORATO */
        .header-info {
          font-size: 9pt !important;
          text-align: center !important;
          margin: 0 auto 15pt auto !important;
          border-bottom: 1pt solid #000 !important;
          padding-bottom: 10pt !important;
          width: 100% !important;
        }

        /* Footer della copertina - MIGLIORATO */
        .cover-page-footer {
          text-align: center !important;
          font-size: 9pt !important;
          color: #000 !important;
          border-top: 1pt solid #000 !important;
          padding-top: 10pt !important;
          margin-top: auto !important;
          width: 100% !important;
        }

        /* NUOVO - Centratura dei titoli */
        .title-center {
          text-align: center !important;
          margin: 0 auto !important;
          width: 100% !important;
        }

        /* NUOVO - Immagini responsive e centrate */
        .pdf-image {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
        }

        /* NUOVO - Logo aziendale */
        .agency-logo {
          max-width: 80px !important;
          max-height: 80px !important;
          margin: 0 auto 20pt auto !important;
          display: block !important;
        }

        /* MIGLIORATO - Sezioni del report */
        .report-section {
          margin-bottom: 20pt !important;
          width: 100% !important;
          page-break-inside: avoid !important;
        }

        .section-title {
          font-size: 14pt !important;
          font-weight: bold !important;
          margin-bottom: 10pt !important;
          text-align: center !important;
          color: #000 !important;
          text-transform: uppercase !important;
          text-decoration: underline !important;
        }

        .section-content {
          font-size: 11pt !important;
          line-height: 1.4 !important;
          text-align: justify !important;
          margin-bottom: 15pt !important;
        }

        .observation-date {
          font-weight: bold !important;
          text-decoration: underline !important;
          margin: 15pt 0 10pt 0 !important;
          font-size: 12pt !important;
        }

        /* MIGLIORATO - Griglia foto */
        .photo-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 10pt !important;
          margin: 15pt 0 !important;
          width: 100% !important;
          page-break-inside: avoid !important;
        }

        .photo-item {
          text-align: center !important;
          page-break-inside: avoid !important;
        }

        .photo-item img {
          max-width: 100% !important;
          height: auto !important;
          border: 1pt solid #000 !important;
          max-height: 60mm !important;
          object-fit: cover !important;
        }

        .photo-caption {
          font-size: 9pt !important;
          margin-top: 5pt !important;
          font-style: italic !important;
          text-align: center !important;
        }

        /* MIGLIORATO - Page breaks */
        .page-break {
          page-break-before: always !important;
        }

        .no-break {
          page-break-inside: avoid !important;
        }

        /* MIGLIORATO - Firma sezione */
        .signature-section {
          margin-top: 30pt !important;
          page-break-inside: avoid !important;
          text-align: right !important;
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

        /* NUOVO - Privacy notes */
        .privacy-notes {
          margin: 30pt 0 !important;
          font-size: 9pt !important;
          font-style: italic !important;
          text-align: justify !important;
          border-top: 1pt solid #000 !important;
          padding-top: 15pt !important;
        }

        .privacy-notes p {
          margin: 8pt 0 !important;
        }

        .privacy-highlight {
          text-decoration: underline !important;
          font-weight: bold !important;
        }

        /* Utility classes */
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold !important; }
        .font-italic { font-style: italic !important; }

        /* NUOVO - Highlighted names come nei tuoi esempi */
        .highlighted-name {
          font-weight: bold !important;
          text-decoration: underline !important;
        }

        /* NUOVO - Recipient styling */
        .recipient {
          margin: 15pt 0 !important;
          font-size: 11pt !important;
        }

        .recipient-label {
          font-weight: normal !important;
          margin-bottom: 5pt !important;
        }

        .recipient-address {
          margin-left: 20pt !important;
          line-height: 1.3 !important;
        }

        /* NUOVO - Main title */
        .main-title {
          text-align: center !important;
          font-size: 18pt !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          margin: 20pt 0 !important;
          letter-spacing: 1pt !important;
        }

        /* NUOVO - Report date */
        .report-date {
          text-align: left !important;
          font-size: 11pt !important;
          margin: 15pt 0 !important;
        }

        /* NUOVO - Agency header */
        .agency-header {
          text-align: center !important;
          margin-bottom: 20pt !important;
          border-bottom: 2pt solid #000 !important;
          padding-bottom: 15pt !important;
        }

        .agency-info {
          font-size: 8pt !important;
          line-height: 1.2 !important;
          margin-bottom: 10pt !important;
        }
      `}</style>

      <div className="pdf-container">
        {/* Pagina di copertina - MANTIENE COMPONENTE ESISTENTE */}
        <div className="pdf-base-styles pdf-cover-page-styles">
          <FalcoPDFCoverPage data={data} agencyProfile={agencyProfile} />
        </div>

        {/* Contenuto del report - MANTIENE COMPONENTE ESISTENTE */}
        <div className="pdf-base-styles pdf-report-content-styles">
          <FalcoPDFReportContent data={data} agencyProfile={agencyProfile} />
        </div>
      </div>
    </div>
  );
};