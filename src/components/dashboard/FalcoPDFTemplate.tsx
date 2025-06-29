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
          margin: 10mm;
        }
        
        body {
          -webkit-print-color-adjust: exact; /* For Chrome/Safari */
          print-color-adjust: exact; /* Standard */
        }

        .pdf-content {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
          background: white;
          width: 100%;
          box-sizing: border-box; /* Ensure padding/border are included in width */
          padding: 10mm; /* Apply page margins as padding */
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