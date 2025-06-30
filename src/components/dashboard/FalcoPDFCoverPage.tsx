import React from 'react';
import { InvestigationData } from '@/hooks/useInvestigationData';
import { getProxyImageUrl } from '@/lib/utils';

interface FalcoPDFCoverPageProps {
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

export const FalcoPDFCoverPage = ({ data, agencyProfile }: FalcoPDFCoverPageProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const formatDateLong = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
      'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const today = new Date().toISOString();

  // Fallback logo embedded as a Base64 string (a simple shield icon)
  const FALLBACK_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXnoaWVsZCI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiIvPjwvc3ZnPg==";

  return (
    <div className="pdf-base-styles pdf-cover-page-styles">
      {/* Main content wrapper - will take up most of the page */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        {/* Logo aziendale in alto al centro */}
        <div style={{ textAlign: 'center', marginBottom: '20pt' }}>
          {agencyProfile?.agency_logo_url ? (
            <img
              src={getProxyImageUrl(agencyProfile.agency_logo_url)}
              alt={agencyProfile.agency_name || "Agency Logo"}
              style={{ maxHeight: '120pt', marginBottom: '10pt', display: 'block', margin: '0 auto' }}
              crossOrigin="anonymous"
            />
          ) : (
            <img
              src={FALLBACK_LOGO_BASE64}
              alt="Falco Investigation Logo"
              style={{ maxHeight: '120pt', marginBottom: '10pt', display: 'block', margin: '0 auto' }}
              crossOrigin="anonymous"
            />
          )}
          <div className="company-name">{agencyProfile?.agency_name || "FALCO INVESTIGATION"}</div>
          <div className="company-subtitle">INVESTIGAZIONI-INDAGINI-RICERCHE</div>
        </div>

        {/* Data e luogo in alto a sinistra, Mandante in alto a destra */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '30pt', fontSize: '11pt' }}>
          <div style={{ textAlign: 'left' }}>
            Milano, {formatDateLong(today)}
          </div>
          {data.clientInfo.fullName && (
            <div style={{ textAlign: 'right' }}>
              Spett.le {data.clientInfo.fullName}<br/>
              {data.clientInfo.address}<br/>
            </div>
          )}
        </div>

        {/* Titolo report */}
        <div className="report-title">REPORT INVESTIGATIVO</div>

        {/* Sezioni del report */}
        <div className="section-title">GENERALITÀ DEL MANDANTE</div>
        <div className="section-content no-break">
          <strong>Sig.ra/Sig. {data.clientInfo.fullName}</strong> 
          {data.clientInfo.birthPlace && data.clientInfo.birthDate && 
            ` nata/o a ${data.clientInfo.birthPlace} il ${formatDate(data.clientInfo.birthDate)}`
          }
          {data.clientInfo.address && ` e residente in ${data.clientInfo.address}`}
          {data.clientInfo.documentNumber && 
            `, identificata/o a mezzo ${data.clientInfo.documentType.toLowerCase()} n° ${data.clientInfo.documentNumber}.`
          }
        </div>

        {data.investigatedInfo.fullName && (
          <>
            <div className="section-title">PERSONA DI CUI SI CHIEDE L’OSSERVAZIONE</div>
            <div className="section-content no-break">
              <strong>{data.investigatedInfo.fullName}</strong>
              {data.investigatedInfo.birthPlace && data.investigatedInfo.birthDate && 
                `, nato/a a ${data.investigatedInfo.birthPlace} il ${formatDate(data.investigatedInfo.birthDate)}`
              }
              {data.investigatedInfo.address && ` e residente a ${data.investigatedInfo.address}`}
              , di seguito indicata come <strong>“osservato”</strong>.
            </div>
          </>
        )}

        {data.mandateDetails.assignmentDate && (
          <>
            <div className="section-title">DATA DELL’INCARICO</div>
            <div className="section-content no-break">
              {formatDate(data.mandateDetails.assignmentDate)}
            </div>
          </>
        )}

        {(data.mandateDetails.purpose || data.mandateDetails.protectedRights || data.investigatedInfo.vehicles.length > 0) && (
          <>
            <div className="section-title">FINALITÀ DEL MANDATO E DIRITTO CHE SI INTENDE TUTELARE</div>
            <div className="section-content">
              {data.mandateDetails.purpose && <p>{data.mandateDetails.purpose}</p>}
              {data.mandateDetails.protectedRights && <p>{data.mandateDetails.protectedRights}</p>}
              {data.investigatedInfo.vehicles.length > 0 && (
                <div style={{ marginTop: '10pt' }}>
                  <p>L’osservato è solito utilizzare per i suoi spostamenti l’autovettura:</p>
                  <ul style={{ listStyleType: 'disc', marginLeft: '20pt' }}>
                    {data.investigatedInfo.vehicles.map((vehicle, index) => (
                      <li key={index}>
                        {vehicle.model} di colore {vehicle.color} targato {vehicle.licensePlate}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer aziendale per la prima pagina - Posizionato in modo assoluto */}
      <div className="cover-page-footer">
        {agencyProfile?.agency_name || "FALCO INVESTIGATION"} - {agencyProfile?.agency_address || "20124 MILANO (MI) – VIA SABAUDIA 8"} - Tel {agencyProfile?.agency_phone || "+39 02 82 19 79 69"}<br/>
        P.Iva IT11535690967 Autorizzazione Prefettura Milano Prot. 14816/12B15E Area I OSP<br/>
        {agencyProfile?.agency_email || "milano@falcoinvestigation.it"} - {agencyProfile?.agency_website || "WWW.INVESTIGATIONFALCO.IT"}
      </div>
    </div>
  );
};