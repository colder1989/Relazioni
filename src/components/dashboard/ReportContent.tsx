import React from 'react';
import { InvestigationData, Photo } from '@/hooks/useInvestigationData';
import { cn } from '@/lib/utils'; // Import cn utility

interface ReportContentProps {
  data: InvestigationData;
  agencyProfile: {
    agency_name: string;
    agency_address: string;
    agency_phone: string;
    agency_email: string;
    agency_website: string;
    agency_logo_url: string;
  } | null;
  className?: string; // Add className prop
}

export const ReportContent = ({ data, agencyProfile, className }: ReportContentProps) => {
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

  return (
    <div className={cn("p-8 font-inter text-sm leading-relaxed bg-falco-cream text-steel-900", className)}> {/* Apply base styles and className */}
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Header with Logo and Date */}
        <div className="flex justify-between items-start mb-8">
          {agencyProfile?.agency_logo_url ? (
            <>
              {console.log('ReportContent: Agency Logo URL:', agencyProfile.agency_logo_url)}
              <img 
                src={agencyProfile.agency_logo_url} 
                alt={agencyProfile.agency_name || "Agency Logo"} 
                className="h-24 w-auto object-contain"
              />
            </>
          ) : (
            <img 
              src="/lovable-uploads/ea7672d3-5fe4-45e8-bd81-ca1377c8caa8.png" 
              alt="Falco Investigation Logo" 
              className="h-24 w-auto"
            />
          )}
          <div className="text-right text-xs text-steel-700">
            <p className="font-bold">{agencyProfile?.agency_name || "FALCO INVESTIGATION"}</p>
            <p>{agencyProfile?.agency_address || "20124 MILANO (MI) – VIA SABAUDIA 8"}</p>
            <p>Tel {agencyProfile?.agency_phone || "+39 02 82 19 79 69"} - P.Iva IT11535690967</p>
            <p>Autorizzazione Prefettura Milano Prot. 14816/12B15E Area I OSP</p>
            <p>{agencyProfile?.agency_email || "milano@falcoinvestigation.it"} - {agencyProfile?.agency_website || "WWW.INVESTIGATIONFALCO.IT"}</p>
            <p className="mt-4 text-steel-900 font-medium">Milano, {formatDateLong(today)}</p>
          </div>
        </div>

        {/* Recipient Address */}
        {data.clientInfo.fullName && (
          <div className="mb-8 text-left">
            <p className="font-bold">Spett.le {data.clientInfo.fullName}</p>
            {data.clientInfo.address && <p>{data.clientInfo.address}</p>}
          </div>
        )}

        {/* Subject */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-playfair font-bold mb-2 text-steel-900">OGGETTO: RELAZIONE INVESTIGATIVA</h1>
          {data.mandateDetails.assignmentDate && (
            <p className="text-base font-medium text-steel-900">Riferimento Vostro incarico del {formatDate(data.mandateDetails.assignmentDate)}</p>
          )}
          {data.investigatedInfo.fullName && (
            <p className="text-base font-medium text-steel-900">Persona di cui si chiede l'osservazione: {data.investigatedInfo.fullName}</p>
          )}
        </div>

        {/* Introduction/Premise */}
        <div className="mb-8 text-justify">
          <p className="text-steel-900">
            Con la presente, si rende conto dell'attività investigativa svolta su Vostro incarico, conferito in data {formatDate(data.mandateDetails.assignmentDate)}, al fine di tutelare il Vostro diritto di {data.mandateDetails.protectedRights || '[diritti tutelati]'}.
          </p>
          <p className="mt-2 text-steel-900">
            L'attività è stata svolta nel rispetto delle normative vigenti in materia di privacy (GDPR 679/2016) e del Codice Deontologico degli Investigatori Privati.
          </p>
        </div>

        {/* Client Details */}
        {data.clientInfo.fullName && (
          <div className="mb-6">
            <h3 className="font-playfair font-bold mb-2 text-base uppercase text-steel-900">Generalità del Mandante</h3>
            <p className="text-justify text-steel-900">
              {data.clientInfo.fullName}
              {data.clientInfo.birthDate && data.clientInfo.birthPlace && 
                ` nata/o a ${data.clientInfo.birthPlace} il ${formatDate(data.clientInfo.birthDate)}`
              }
              {data.clientInfo.address && ` e residente in ${data.clientInfo.address}`}
              {data.clientInfo.documentNumber && 
                `, identificata/o a mezzo ${data.clientInfo.documentType.toLowerCase()} n° ${data.clientInfo.documentNumber}.`
              }
            </p>
          </div>
        )}

        {/* Investigated Person */}
        {data.investigatedInfo.fullName && (
          <div className="mb-6">
            <h3 className="font-playfair font-bold mb-2 text-base uppercase text-steel-900">Persona di cui si chiede l'osservazione</h3>
            <p className="text-justify text-steel-900">
              {data.investigatedInfo.fullName}
              {data.investigatedInfo.birthDate && data.investigatedInfo.birthPlace && 
                `, nato/a a ${data.investigatedInfo.birthPlace} il ${formatDate(data.investigatedInfo.birthDate)}`
              }
              {data.investigatedInfo.address && ` e residente a ${data.investigatedInfo.address}`}
              , di seguito indicato come "osservato".
            </p>
            
            {data.investigatedInfo.vehicles.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-steel-900">L'osservato è solito utilizzare per i suoi spostamenti le seguenti autovetture:</p>
                <ul className="list-disc list-inside ml-4 text-steel-900">
                  {data.investigatedInfo.vehicles.map((vehicle, index) => (
                    <li key={index}>
                      {vehicle.model} di colore {vehicle.color} targato {vehicle.licensePlate}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Mandate Purpose and Protected Rights */}
        {(data.mandateDetails.purpose || data.mandateDetails.protectedRights) && (
          <div className="mb-8">
            <h3 className="font-playfair font-bold mb-2 text-base uppercase text-steel-900">Finalità del Mandato e Diritto che si intende tutelare</h3>
            {data.mandateDetails.purpose && <p className="mb-2 text-justify text-steel-900">{data.mandateDetails.purpose}</p>}
            {data.mandateDetails.protectedRights && <p className="text-justify text-steel-900">{data.mandateDetails.protectedRights}</p>}
          </div>
        )}

        {/* Investigation Results */}
        {data.observationDays.length > 0 && (
          <div className="mb-8">
            <h3 className="font-playfair font-bold mb-4 text-base uppercase text-steel-900">Esito degli Accertamenti e dell'Attività di Osservazione Diretta</h3>
            <p className="mb-4 text-justify text-steel-900">
              Nel corso dell'accertamento svolto dal {data.observationDays.length > 0 ? formatDate(data.observationDays[0].date) : ''} 
              {data.observationDays.length > 1 ? ` al ${formatDate(data.observationDays[data.observationDays.length - 1].date)}` : ''} 
              sono emersi i seguenti elementi circa la finalità dell'indagine espletata:
            </p>
            
            {data.observationDays.map((day, index) => (
              <div key={day.id} className="mb-6">
                <h4 className="font-bold mb-2 text-base text-steel-900">
                  Giorno {index + 1}: {new Date(day.date).toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h4>
                <p className="text-justify text-steel-900">
                  Dalle ore {formatTime(day.startTime)} alle ore {formatTime(day.endTime)}, sono state condotte attività di osservazione.
                  {day.locations.length > 0 && (
                    <span>
                      {' '}I luoghi visitati includono: {day.locations.map(loc => `${loc.placeName} (${loc.address})`).join(', ')}.
                    </span>
                  )}
                  <br />
                  {day.description && <span className="mt-2 block whitespace-pre-wrap">{day.description}</span>}
                </p>

                {/* Photos for this specific day (if per-day strategy) */}
                {data.photoManagement.photoStrategy === 'per-day' && getPhotosForDay(day.date).length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold mb-2 text-sm text-steel-900">Documentazione Fotografica del Giorno:</h5>
                    <div className="grid grid-cols-2 gap-4">
                      {getPhotosForDay(day.date).map((photo) => {
                        console.log('ReportContent: Rendering photo for day:', photo.url);
                        return photo.url && (
                          <div key={photo.id} className="border border-slate-300 p-2 rounded-lg bg-white">
                            <img src={photo.url} alt={photo.description} className="w-full h-48 object-cover mb-2 rounded" />
                            <p className="text-xs text-steel-700">{photo.time} - {photo.location}</p>
                            <p className="text-xs text-steel-800 mt-1">{photo.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Photos section (if separate-dossier strategy) */}
        {data.photoManagement.photoStrategy === 'separate-dossier' && data.photos.length > 0 && (
          <div className="mb-8">
            <h3 className="font-playfair font-bold mb-2 text-base uppercase text-steel-900">Documentazione Fotografica</h3>
            <p className="text-justify text-steel-900">
              Allegato al presente report viene consegnato un fascicolo fotografico contenente {data.photos.length} immagini documentali.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {data.photos.map((photo) => {
                console.log('ReportContent: Rendering photo for separate dossier:', photo.url);
                return photo.url && (
                  <div key={photo.id} className="border border-slate-300 p-2 rounded-lg bg-white">
                    <img src={photo.url} alt={photo.description} className="w-full h-48 object-cover mb-2 rounded" />
                    <p className="text-xs text-steel-700">{photo.time} - {photo.location}</p>
                    <p className="text-xs text-steel-800 mt-1">{photo.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Conclusions */}
        {data.conclusions.text && (
          <div className="mb-8">
            <h3 className="font-playfair font-bold mb-2 text-base uppercase text-steel-900">Conclusioni</h3>
            <p className="text-justify whitespace-pre-wrap text-steel-900">{data.conclusions.text}</p>
          </div>
        )}

        {/* Additional Notes */}
        {data.additionalNotes.notes && (
          <div className="mb-8">
            <h3 className="font-playfair font-bold mb-2 text-base uppercase text-steel-900">Note Aggiuntive</h3>
            <p className="text-justify whitespace-pre-wrap text-steel-900">{data.additionalNotes.notes}</p>
          </div>
        )}

        {/* Closing Statement */}
        <div className="mb-8 text-justify">
          <p className="text-steel-900">Tanto vi dovevamo per le Vs. eventuali e ulteriori valutazioni.</p>
        </div>

        {/* Signature */}
        <div className="text-right mb-12 mt-12">
          <p className="font-bold text-base text-steel-900">INVESTIGATORE PRIVATO</p>
          <p className="mt-2 text-base text-steel-900">{agencyProfile?.first_name} {agencyProfile?.last_name}</p>
        </div>

        {/* Privacy Notice */}
        <div className="mb-8 text-justify text-xs text-steel-700">
          <p>
            Le informazioni contenute nel presente report sono di natura strettamente confidenziale e la loro divulgazione è consentita solo nel rispetto delle leggi vigenti, in particolar modo quelle sulla privacy. 
            Le responsabilità del loro uso difforme è in capo al soggetto che le diffonde.
          </p>
          <p className="mt-2">
            <strong>N.B.:</strong> il presente report viene redatto in un unico esemplare originale. Lo stesso sarà consegnato nelle mani della mandante. Si fa presente che lo stesso potrà essere usato nel rispetto delle norme vigenti in materia di privacy. Si dà infine atto del fatto che tutto il materiale utilizzato per la sua redazione sarà distrutto all'atto della consegna.
          </p>
          {data.privacy.customNotes && (
            <p className="mt-2 whitespace-pre-wrap">{data.privacy.customNotes}</p>
          )}
        </div>
      </div>
    </div>
  );
};