import React from 'react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { getProxyImageUrl } from '@/lib/utils';

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
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
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

  const getPhotosForDay = (dayDate: string): Photo[] => {
    return data.photos.filter(photo => photo.date === dayDate);
  };

  // Fallback logo embedded as a Base64 string (a simple shield icon)
  const FALLBACK_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXnoaWVsZCI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiIvPjwvc3ZnPg==";

  return (
    <div id="falco-pdf-template" style={{ display: 'none' }}>
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
      
      <div className="pdf-content">
        {/* Header aziendale */}
        <div className="header-info no-break">
          {agencyProfile?.agency_name || "FALCO INVESTIGATION"} - {agencyProfile?.agency_address || "20124 MILANO (MI) – VIA SABAUDIA 8"} - Tel {agencyProfile?.agency_phone || "+39 02 82 19 79 69"}<br/>
          P.Iva IT11535690967 Autorizzazione Prefettura Milano Prot. 14816/12B15E Area I OSP<br/>
          {agencyProfile?.agency_email || "milano@falcoinvestigation.it"} - {agencyProfile?.agency_website || "WWW.INVESTIGATIONFALCO.IT"}
        </div>

        {/* Data e luogo */}
        <div style={{ textAlign: 'left', marginBottom: '30pt' }}>
          Milano, {formatDateLong(today)}
        </div>

        {/* Logo aziendale */}
        <div style={{ textAlign: 'center', margin: '20pt 0' }}>
          {agencyProfile?.agency_logo_url ? (
            <img 
              src={getProxyImageUrl(agencyProfile.agency_logo_url)} 
              alt={agencyProfile.agency_name || "Agency Logo"} 
              style={{ maxHeight: '60pt', marginBottom: '10pt', display: 'block', margin: '0 auto' }}
              crossOrigin="anonymous"
            />
          ) : (
            <img 
              src={FALLBACK_LOGO_BASE64} 
              alt="Falco Investigation Logo" 
              style={{ maxHeight: '60pt', marginBottom: '10pt', display: 'block', margin: '0 auto' }}
              crossOrigin="anonymous"
            />
          )}
          <div className="company-name">{agencyProfile?.agency_name || "FALCO INVESTIGATION"}</div>
          <div className="company-subtitle">INVESTIGAZIONI-INDAGINI-RICERCHE</div>
        </div>

        {/* Titolo report */}
        <div className="report-title">REPORT INVESTIGATIVO</div>

        {/* Destinatario */}
        {data.clientInfo.fullName && (
          <div style={{ marginBottom: '20pt' }}>
            Spett.le {data.clientInfo.fullName}<br/>
            {data.clientInfo.address}<br/>
            {/* Assuming city is part of address or not strictly needed for this template */}
          </div>
        )}

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
            <div className="section-title">PERSONA DI CUI SI CHIEDE L'OSSERVAZIONE</div>
            <div className="section-content no-break">
              <strong>{data.investigatedInfo.fullName}</strong>
              {data.investigatedInfo.birthPlace && data.investigatedInfo.birthDate && 
                `, nato/a a ${data.investigatedInfo.birthPlace} il ${formatDate(data.investigatedInfo.birthDate)}`
              }
              {data.investigatedInfo.address && ` e residente a ${data.investigatedInfo.address}`}
              , di seguito indicata come <strong>"osservato"</strong>.
              {data.investigatedInfo.vehicles.length > 0 && (
                <div style={{ marginTop: '10pt' }}>
                  L'osservato è solito utilizzare per i suoi spostamenti le seguenti autovetture:
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

        {data.mandateDetails.assignmentDate && (
          <>
            <div className="section-title">DATA DELL'INCARICO</div>
            <div className="section-content no-break">
              {formatDate(data.mandateDetails.assignmentDate)}
            </div>
          </>
        )}

        {(data.mandateDetails.purpose || data.mandateDetails.protectedRights) && (
          <>
            <div className="section-title">FINALITÀ DEL MANDATO E DIRITTO CHE SI INTENDE TUTELARE</div>
            <div className="section-content">
              {data.mandateDetails.purpose && <p>{data.mandateDetails.purpose}</p>}
              {data.mandateDetails.protectedRights && <p>{data.mandateDetails.protectedRights}</p>}
            </div>
          </>
        )}

        {/* Nuova pagina per osservazioni */}
        {data.observationDays.length > 0 && (
          <>
            <div className="page-break"></div>
            
            <div className="section-title">ESITO DEGLI ACCERTAMENTI E DELL'ATTIVITÀ DI OSSERVAZIONE DIRETTA</div>
            <div className="section-content">
              Nel corso dell'accertamento svolto dal {data.observationDays.length > 0 ? formatDate(data.observationDays[0].date) : ''} 
              {data.observationDays.length > 1 ? ` al ${formatDate(data.observationDays[data.observationDays.length - 1].date)}` : ''} 
              sono emersi i seguenti elementi circa la finalità dell'indagine espletata:
            </div>

            {/* Osservazioni */}
            {data.observationDays.map((obs, index) => (
              <div key={obs.id} className="no-break">
                <div className="observation-date">
                  Giorno {index + 1}: {new Date(obs.date).toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="section-content">
                  Dalle ore {formatTime(obs.startTime)} alle ore {formatTime(obs.endTime)}, sono state condotte attività di osservazione.
                  {obs.locations.length > 0 && (
                    <span>
                      {' '}I luoghi visitati includono: {obs.locations.map(loc => `${loc.placeName} (${loc.address})`).join(', ')}.
                    </span>
                  )}
                  <br />
                  {obs.description && <span style={{ whiteSpace: 'pre-wrap' }}>{obs.description}</span>}
                </div>

                {/* Photos for this specific day (if per-day strategy) */}
                {data.photoManagement.photoStrategy === 'per-day' && getPhotosForDay(obs.date).length > 0 && (
                  <div style={{ marginTop: '15pt', textAlign: 'center' }}>
                    <h5 style={{ fontWeight: 'bold', marginBottom: '10pt', fontSize: '10pt' }}>Documentazione Fotografica del Giorno:</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10pt', justifyContent: 'center' }}>
                      {getPhotosForDay(obs.date).map((photo) => {
                        return photo.url && (
                          <div key={photo.id} style={{ border: '1pt solid #ccc', padding: '5pt', borderRadius: '5pt', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '150pt', margin: '0 auto' }}>
                            <img 
                              src={getProxyImageUrl(photo.url)} 
                              alt={photo.description} 
                              style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: '5pt' }}
                              crossOrigin="anonymous"
                            />
                            <div style={{ fontSize: '8pt', color: '#555', textAlign: 'center' }}>
                              <p>{photo.time} - {photo.location}</p>
                              <p style={{ marginTop: '2pt' }}>{photo.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Photos section (if separate-dossier strategy) */}
        {data.photoManagement.photoStrategy === 'separate-dossier' && data.photos.length > 0 && (
          <>
            <div className="page-break"></div>
            <div className="section-title">DOCUMENTAZIONE FOTOGRAFICA</div>
            <div className="section-content">
              Allegato al presente report viene consegnato un fascicolo fotografico contenente {data.photos.length} immagini documentali.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10pt', justifyContent: 'center', marginTop: '15pt' }}>
              {data.photos.map((photo) => {
                return photo.url && (
                  <div key={photo.id} style={{ border: '1pt solid #ccc', padding: '5pt', borderRadius: '5pt', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '150pt', margin: '0 auto' }}>
                    <img 
                      src={getProxyImageUrl(photo.url)} 
                      alt={photo.description} 
                      style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: '5pt' }}
                      crossOrigin="anonymous"
                    />
                    <div style={{ fontSize: '8pt', color: '#555', textAlign: 'center' }}>
                      <p>{photo.time} - {photo.location}</p>
                      <p style={{ marginTop: '2pt' }}>{photo.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Additional Notes */}
        {data.additionalNotes.notes && (
          <>
            <div className="page-break"></div> {/* Consider if this should always be a new page */}
            <div className="section-title">NOTE AGGIUNTIVE</div>
            <div className="section-content">
              <p style={{ whiteSpace: 'pre-wrap' }}>{data.additionalNotes.notes}</p>
            </div>
          </>
        )}

        {/* Conclusions */}
        {data.conclusions.text && (
          <>
            <div className="page-break"></div>
            <div className="section-title">CONCLUSIONI</div>
            <div className="section-content">
              <p style={{ whiteSpace: 'pre-wrap' }}>{data.conclusions.text}</p>
            </div>
          </>
        )}

        {/* Closing Statement */}
        <div className="section-content">
          <p>Tanto vi dovevamo per le Vs. eventuali e ulteriori valutazioni.</p>
        </div>

        {/* Firma */}
        <div className="signature-section">
          <div style={{ fontWeight: 'bold', marginBottom: '40pt' }}>INVESTIGATORE PRIVATO</div>
          <div style={{ borderTop: '1pt solid #000', paddingTop: '5pt', width: '200pt', marginLeft: 'auto', textAlign: 'center' }}>
            {agencyProfile?.first_name} {agencyProfile?.last_name}
          </div>
        </div>

        {/* Privacy Notice */}
        <div style={{ fontSize: '9pt', color: '#555', marginTop: '30pt', textAlign: 'justify' }}>
          <p>
            Le informazioni contenute nel presente report sono di natura strettamente confidenziale e la loro divulgazione è consentita solo nel rispetto delle leggi vigenti, in particolar modo quelle sulla privacy. 
            Le responsabilità del loro uso difforme è in capo al soggetto che le diffonde.
          </p>
          <p style={{ marginTop: '5pt' }}>
            <strong>N.B.:</strong> il presente report viene redatto in un unico esemplare originale. Lo stesso sarà consegnato nelle mani della mandante. Si fa presente che lo stesso potrà essere usato nel rispetto delle norme vigenti in materia di privacy. Si dà infine atto del fatto che tutto il materiale utilizzato per la sua redazione sarà distrutto all'atto della consegna.
          </p>
          {data.privacy.customNotes && (
            <p style={{ marginTop: '5pt', whiteSpace: 'pre-wrap' }}>{data.privacy.customNotes}</p>
          )}
        </div>
      </div>
    </div>
  );
};