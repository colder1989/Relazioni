import React from 'react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { getProxyImageUrl } from '@/lib/utils';

interface FalcoPDFReportContentProps {
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

export const FalcoPDFReportContent = ({ data, agencyProfile }: FalcoPDFReportContentProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  };

  const getPhotosForDay = (dayDate: string): Photo[] => {
    return data.photos.filter(photo => photo.date === dayDate);
  };

  // Fallback logo embedded as a Base64 string (a simple shield icon)
  const FALLBACK_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXnoaWVsZCI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiIvPjwvc3ZnPg==";

  return (
    <div className="pdf-content">
      {/* Header aziendale per le pagine successive */}
      <div className="header-info no-break">
        {agencyProfile?.agency_name || "FALCO INVESTIGATION"} - Relazione Investigativa
      </div>

      {/* Esito degli Accertamenti */}
      {data.observationDays.length > 0 && (
        <>
          <div className="section-title">ESITO DEGLI ACCERTAMENTI E DELL’ATTIVITÀ DI OSSERVAZIONE DIRETTA</div>
          <div className="section-content">
            Nel corso dell’accertamento svolto dal {data.observationDays.length > 0 ? formatDate(data.observationDays[0].date) : ''} 
            {data.observationDays.length > 1 ? ` al ${formatDate(data.observationDays[data.observationDays.length - 1].date)}` : ''} 
            sono emersi i seguenti elementi circa la finalità dell’indagine espletata:
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
                  {getPhotosForDay(obs.date).map((photo) => {
                    return photo.url && (
                      <div key={photo.id} style={{ border: '1pt solid #ccc', padding: '5pt', borderRadius: '5pt', background: '#fff', display: 'inline-block', margin: '5pt auto', maxWidth: '180mm', width: '100%', boxSizing: 'border-box' }}>
                        <img 
                          src={getProxyImageUrl(photo.url)} 
                          alt={photo.description} 
                          style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '5pt' }}
                          crossOrigin="anonymous"
                        />
                        <div style={{ fontSize: '8pt', color: '#555', textAlign: 'center', padding: '0 5pt 5pt' }}>
                          <p>{photo.time} - {photo.location}</p>
                          <p style={{ marginTop: '2pt' }}>{photo.description}</p>
                        </div>
                      </div>
                    );
                  })}
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
          <div style={{ marginTop: '15pt', textAlign: 'center' }}>
            {data.photos.map((photo) => {
              return photo.url && (
                <div key={photo.id} style={{ border: '1pt solid #ccc', padding: '5pt', borderRadius: '5pt', background: '#fff', display: 'inline-block', margin: '5pt auto', maxWidth: '180mm', width: '100%', boxSizing: 'border-box' }}>
                  <img 
                    src={getProxyImageUrl(photo.url)} 
                    alt={photo.description} 
                    style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '5pt' }}
                    crossOrigin="anonymous"
                  />
                  <div style={{ fontSize: '8pt', color: '#555', textAlign: 'center', padding: '0 5pt 5pt' }}>
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
          <div className="page-break"></div>
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
  );
};