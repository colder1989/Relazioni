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

  // Logo Falco Investigation come nei tuoi esempi
  const FALCO_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJmYWxjb0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZENzAwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTAwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZmFsY29HcmFkaWVudCkiIHJ4PSI1Ii8+PHBhdGggZD0iTTUwIDI1SDEwMEw3NSU1MEg1MFYyNVoiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSIxMDAiIHk9IjM1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GQUxDTyBJTlZFU1RJR0FUSU9OPC90ZXh0Pjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JTlZFU1RJR0FUSU9OSSAtIElOREFHSU5JIC0gUklDRVJDSEU8L2RleHQ+PC9zdmc+";

  return (
    <div id="falco-pdf-template">
      <style>{`
        @page {
          size: A4;
          margin: 15mm;
        }
        
        /* Reset di base */
        #falco-pdf-template {
          margin: 0 !important;
          padding: 0 !important;
          width: 210mm !important;
          font-family: 'Times New Roman', serif !important;
          font-size: 11pt !important;
          line-height: 1.4 !important;
          color: #000 !important;
          background: white !important;
          box-sizing: border-box !important;
        }

        .pdf-page {
          max-width: 180mm !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background: white !important;
        }

        /* Header con logo e info agenzia */
        .agency-header {
          text-align: center !important;
          margin-bottom: 20pt !important;
          border-bottom: 2pt solid #000 !important;
          padding-bottom: 15pt !important;
        }

        .agency-logo {
          max-width: 200px !important;
          max-height: 100px !important;
          margin: 0 auto 10pt auto !important;
          display: block !important;
        }

        .agency-info {
          font-size: 8pt !important;
          line-height: 1.2 !important;
          margin-bottom: 10pt !important;
        }

        .report-date {
          text-align: left !important;
          font-size: 11pt !important;
          margin: 15pt 0 !important;
        }

        /* Titolo principale */
        .main-title {
          text-align: center !important;
          font-size: 18pt !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          margin: 20pt 0 !important;
          letter-spacing: 1pt !important;
        }

        /* Destinatario */
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

        /* Sezioni del documento */
        .section {
          margin: 20pt 0 !important;
          page-break-inside: avoid !important;
        }

        .section-title {
          font-size: 12pt !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          margin-bottom: 10pt !important;
          text-align: center !important;
          text-decoration: underline !important;
        }

        .section-content {
          font-size: 11pt !important;
          line-height: 1.4 !important;
          text-align: justify !important;
        }

        /* Evidenziazione nomi */
        .highlighted-name {
          font-weight: bold !important;
          text-decoration: underline !important;
        }

        /* Date delle osservazioni */
        .observation-date {
          font-weight: bold !important;
          text-decoration: underline !important;
          margin: 15pt 0 10pt 0 !important;
        }

        /* Griglia foto come nei tuoi esempi */
        .photo-grid {
          display: flex !important;
          flex-direction: column !important;
          gap: 15pt !important;
          margin: 15pt 0 !important;
          page-break-inside: avoid !important;
        }

        .photo-row {
          display: flex !important;
          justify-content: center !important;
          gap: 10pt !important;
        }

        .photo-item {
          flex: 1 !important;
          max-width: 80mm !important;
          text-align: center !important;
        }

        .photo-item img {
          width: 100% !important;
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

        /* Lista puntata */
        .bullet-list {
          margin: 10pt 0 !important;
          padding-left: 20pt !important;
        }

        .bullet-list li {
          margin-bottom: 5pt !important;
        }

        /* Conclusioni */
        .conclusions {
          margin: 25pt 0 !important;
          font-size: 11pt !important;
          line-height: 1.4 !important;
          text-align: justify !important;
        }

        /* Note privacy */
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

        /* Firma */
        .signature-section {
          margin-top: 40pt !important;
          text-align: right !important;
          page-break-inside: avoid !important;
        }

        .signature-title {
          font-weight: bold !important;
          text-transform: uppercase !important;
          font-size: 12pt !important;
          margin-bottom: 15pt !important;
        }

        .signature-name {
          font-size: 11pt !important;
        }

        /* Page breaks */
        .page-break {
          page-break-before: always !important;
        }

        /* Utility classes */
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold !important; }
        .font-italic { font-style: italic !important; }
      `}</style>

      <div className="pdf-page">
        {/* Header con logo e info agenzia */}
        <div className="agency-header">
          {agencyProfile?.agency_logo_url ? (
            <img 
              src={getProxyImageUrl(agencyProfile.agency_logo_url)} 
              alt="Logo Agenzia"
              className="agency-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = FALCO_LOGO_BASE64;
              }}
            />
          ) : (
            <img 
              src={FALCO_LOGO_BASE64} 
              alt="Falco Investigation Logo"
              className="agency-logo"
            />
          )}
          
          {agencyProfile && (
            <div className="agency-info">
              <strong>{agencyProfile.agency_name.toUpperCase()}</strong> - {agencyProfile.agency_address} - Tel {agencyProfile.agency_phone}<br />
              P.Iva IT11535690967 Autorizzazione Prefettura Milano Prot. 14816/12B15E Area I OSP<br />
              {agencyProfile.agency_email} {agencyProfile.agency_website?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Data e luogo */}
        <div className="report-date">
          Milano, {formatDateLong(today)}
        </div>

        {/* Titolo principale */}
        <div className="main-title">
          Report Investigativo
        </div>

        {/* Destinatario */}
        <div className="recipient">
          <div className="recipient-label">Spett.le <span className="highlighted-name">{data.clientInfo?.fullName || 'CLIENTE'}</span></div>
          <div className="recipient-address">
            {data.clientInfo?.address || 'Indirizzo non specificato'}<br />
            {data.clientInfo?.city && data.clientInfo?.postalCode 
              ? `${data.clientInfo.postalCode} – ${data.clientInfo.city} (${data.clientInfo.province || 'MI'})`
              : 'Città non specificata'
            }
          </div>
        </div>

        {/* Generalità del mandante */}
        <div className="section">
          <div className="section-title">Generalità del Mandante</div>
          <div className="section-content">
            <span className="highlighted-name">Sig.ra {data.clientInfo?.fullName || 'Non specificato'}</span> nata a {data.clientInfo?.birthPlace || 'Non specificato'} il {data.clientInfo?.birthDate ? formatDate(data.clientInfo.birthDate) : 'Non specificato'} e residente in {data.clientInfo?.address || 'Non specificato'} a {data.clientInfo?.city || 'Non specificato'} ({data.clientInfo?.province || 'MI'}), identificata a mezzo carta d'identità n° {data.clientInfo?.documentType?.toLowerCase()} n° {data.clientInfo?.documentNumber || 'Non specificato'} rilasciata dal comune di {data.clientInfo?.idIssuedBy || 'Non specificato'} il {data.clientInfo?.idIssueDate ? formatDate(data.clientInfo.idIssueDate) : 'Non specificato'}.
          </div>
        </div>

        {/* Persona di cui si chiede l'osservazione */}
        <div className="section">
          <div className="section-title">Persona di cui si chiede l'osservazione</div>
          <div className="section-content">
            <span className="highlighted-name">{data.investigatedInfo?.fullName || 'Non specificato'}</span>, nato a {data.investigatedInfo?.birthPlace || 'Non specificato'} il {data.investigatedInfo?.birthDate ? formatDate(data.investigatedInfo.birthDate) : 'Non specificato'} e residente a {data.investigatedInfo?.address || 'Non specificato'}, di seguito indicata come "<strong>osservato</strong>"
          </div>
        </div>

        {/* Data dell'incarico */}
        <div className="section">
          <div className="section-title">Data dell'Incarico</div>
          <div className="section-content text-center">
            <strong>{data.mandateDetails?.assignmentDate ? formatDateLong(data.mandateDetails.assignmentDate) : 'Non specificato'}</strong>
          </div>
        </div>

        {/* Finalità del mandato */}
        <div className="section">
          <div className="section-title">Finalità del Mandato e Diritto che si intende Tutelare</div>
          <div className="section-content">
            {data.mandateDetails?.purpose || 'Esecuzione di accertamenti investigativi come da mandato conferito.'}
            <br /><br />
            L'agenzia viene quindi incaricata, su esplicito mandato da parte della Sig.ra <span className="highlighted-name">{data.clientInfo?.fullName || 'MANDANTE'}</span>, di svolgere ogni utile indagine investigativa finalizzata ad appurare {data.mandateDetails?.protectedRights || 'le finalità specificate nel mandato'}.
            
            {data.investigatedInfo?.vehicles && data.investigatedInfo.vehicles.length > 0 && (
              <>
                <br /><br />
                In proposito, il mandante in particolare riferisce:
                <ul className="bullet-list">
                  <li>L'osservato è solito utilizzare per i suoi spostamenti l'autovettura:</li>
                  {data.investigatedInfo.vehicles.map((vehicle, index) => (
                    <li key={index} style={{ marginLeft: '20pt' }}>
                      • {vehicle.model} di colore {vehicle.color} targato {vehicle.licensePlate}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Nuova pagina per le osservazioni */}
        <div className="page-break"></div>

        {/* Esito degli accertamenti */}
        <div className="section">
          <div className="section-title">Esito degli Accertamenti e dell'Attività di Osservazione Diretta</div>
          <div className="section-content">
            Nel corso dell'accertamento svolto dal {data.mandateDetails?.assignmentDate ? formatDate(data.mandateDetails.assignmentDate) : 'data inizio'} al {data.mandateDetails?.assignmentDate ? formatDate(data.mandateDetails.assignmentDate) : 'data fine'} sono emersi i seguenti elementi circa la finalità dell'indagine espletata:
          </div>
        </div>

        {/* Giorni di osservazione */}
        {data.observationDays && data.observationDays.map((day, dayIndex) => (
          <div key={dayIndex} className="section">
            <div className="observation-date">
              {day.date ? formatDateLong(day.date) : `Giorno ${dayIndex + 1}`}
            </div>
            
            <div className="section-content">
              {day.description || 'Attività di osservazione svolta come da programma.'}
            </div>

            {/* Foto del giorno */}
            {data.photoManagement.photoStrategy === 'per-day' && day.photos && day.photos.length > 0 && (
              <div className="photo-grid">
                {Array.from({ length: Math.ceil(day.photos.length / 2) }).map((_, rowIndex) => (
                  <div key={rowIndex} className="photo-row">
                    {day.photos.slice(rowIndex * 2, (rowIndex + 1) * 2).map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-item">
                        <img 
                          src={getProxyImageUrl(photo.url)} 
                          alt={photo.description || `Foto ${photoIndex + 1}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {photo.description && (
                          <div className="photo-caption">
                            {photo.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Sezione foto separata */}
        {data.photoManagement.photoStrategy === 'separate-dossier' && data.photos && data.photos.length > 0 && (
          <>
            <div className="page-break"></div>
            <div className="section">
              <div className="section-title">Documentazione Fotografica</div>
              <div className="section-content">
                Allegato al presente report viene consegnato un fascicolo fotografico contenente {data.photos.length} immagini documentali.
              </div>
              <div className="photo-grid">
                {Array.from({ length: Math.ceil(data.photos.length / 2) }).map((_, rowIndex) => (
                  <div key={rowIndex} className="photo-row">
                    {data.photos.slice(rowIndex * 2, (rowIndex + 1) * 2).map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-item">
                        <img 
                          src={getProxyImageUrl(photo.url)} 
                          alt={photo.description || `Foto ${photoIndex + 1}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {photo.description && (
                          <div className="photo-caption">
                            {photo.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Note Aggiuntive */}
        {data.additionalNotes.notes && (
          <>
            <div className="page-break"></div>
            <div className="section">
              <div className="section-title">Note Aggiuntive</div>
              <div className="section-content">
                <p style={{ whiteSpace: 'pre-wrap' }}>{data.additionalNotes.notes}</p>
              </div>
            </div>
          </>
        )}

        {/* Conclusioni */}
        <div className="section">
          <div className="section-title">Conclusioni</div>
          <div className="conclusions">
            {data.conclusions?.text || 'In conclusione, durante le attività di osservazione sono emersi elementi significativi circa le finalità dell\'indagine espletata.'}
            <br /><br />
            <em>Tanto vi dovevamo per le vs. eventuali e ulteriori valutazioni.</em>
          </div>
        </div>

        {/* Note sulla privacy */}
        <div className="privacy-notes">
          <p>
            <span className="privacy-highlight">Le informazioni contenute nel presente report sono di natura strettamente confidenziale e la loro divulgazione è consentita solo nel rispetto delle leggi vigenti, in particolar modo quelle sulla privacy.</span>
          </p>
          <p>
            <span className="privacy-highlight">Le responsabilità del loro uso difforme è in capo al soggetto che le diffonde.</span>
          </p>
          <p>
            <span className="privacy-highlight">N.B.: il presente report viene redatto in un unico esemplare originale. Lo stesso sarà consegnato nelle mani della mandante. Si fa presente che lo stesso potrà essere usato nel rispetto delle norme vigenti in materia di privacy. Si dà infine atto del fatto che tutto il materiale utilizzato per la sua redazione sarà distrutto all'atto della consegna.</span>
          </p>
          {data.privacy.customNotes && (
            <p style={{ marginTop: '5pt', whiteSpace: 'pre-wrap' }}>{data.privacy.customNotes}</p>
          )}
        </div>

        {/* Firma */}
        <div className="signature-section">
          <div className="signature-title">Investigatore Privato</div>
          <div className="signature-name">
            {agencyProfile ? `${agencyProfile.first_name} ${agencyProfile.last_name}` : 'Tripolino Alessandro'}
          </div>
        </div>
      </div>
    </div>
  );
};