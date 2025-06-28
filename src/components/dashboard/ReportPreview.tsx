import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Download, FileText } from 'lucide-react';
import { InvestigationData } from '@/hooks/useInvestigationData';

interface ReportPreviewProps {
  data: InvestigationData;
  onClose: () => void;
}

export const ReportPreview = ({ data, onClose }: ReportPreviewProps) => {
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
            <Button size="sm" className="falco-gradient text-white">
              <Download className="w-4 h-4 mr-2" />
              Esporta PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="text-steel-700 hover:text-steel-900">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow p-8 font-inter text-sm leading-relaxed">
          <div className="space-y-8 max-w-3xl mx-auto">
            {/* Header with Logo and Date */}
            <div className="flex justify-between items-start mb-8">
              <img 
                src="/lovable-uploads/ea7672d3-5fe4-45e8-bd81-ca137cc8caa8.png" 
                alt="Falco Investigation Logo" 
                className="h-24 w-auto"
              />
              <div className="text-right text-xs text-steel-700">
                <p className="font-bold">FALCO INVESTIGATION</p>
                <p>20124 MILANO (MI) – VIA SABAUDIA 8</p>
                <p>Tel +39 02 82 19 79 69 - P.Iva IT11535690967</p>
                <p>Autorizzazione Prefettura Milano Prot. 14816/12B15E Area I OSP</p>
                <p>milano@falcoinvestigation.it - WWW.INVESTIGATIONFALCO.IT</p>
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
              <h1 className="text-xl font-playfair font-bold mb-2">OGGETTO: RELAZIONE INVESTIGATIVA</h1>
              {data.mandateDetails.assignmentDate && (
                <p className="text-base font-medium">Riferimento Vostro incarico del {formatDate(data.mandateDetails.assignmentDate)}</p>
              )}
              {data.investigatedInfo.fullName && (
                <p className="text-base font-medium">Persona di cui si chiede l'osservazione: {data.investigatedInfo.fullName}</p>
              )}
            </div>

            {/* Introduction/Premise */}
            <div className="mb-8 text-justify">
              <p>
                Con la presente, si rende conto dell'attività investigativa svolta su Vostro incarico, conferito in data {formatDate(data.mandateDetails.assignmentDate)}, al fine di tutelare il Vostro diritto di {data.mandateDetails.protectedRights || '[diritti tutelati]'}.
              </p>
              <p className="mt-2">
                L'attività è stata svolta nel rispetto delle normative vigenti in materia di privacy (GDPR 679/2016) e del Codice Deontologico degli Investigatori Privati.
              </p>
            </div>

            {/* Client Details */}
            {data.clientInfo.fullName && (
              <div className="mb-6">
                <h3 className="font-playfair font-bold mb-2 text-base uppercase">Generalità del Mandante</h3>
                <p className="text-justify">
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
                <h3 className="font-playfair font-bold mb-2 text-base uppercase">Persona di cui si chiede l'osservazione</h3>
                <p className="text-justify">
                  {data.investigatedInfo.fullName}
                  {data.investigatedInfo.birthDate && data.investigatedInfo.birthPlace && 
                    `, nato/a a ${data.investigatedInfo.birthPlace} il ${formatDate(data.investigatedInfo.birthDate)}`
                  }
                  {data.investigatedInfo.address && ` e residente a ${data.investigatedInfo.address}`}
                  , di seguito indicato come "osservato".
                </p>
                
                {data.investigatedInfo.vehicles.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">L'osservato è solito utilizzare per i suoi spostamenti le seguenti autovetture:</p>
                    <ul className="list-disc list-inside ml-4">
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
                <h3 className="font-playfair font-bold mb-2 text-base uppercase">Finalità del Mandato e Diritto che si intende tutelare</h3>
                {data.mandateDetails.purpose && <p className="mb-2 text-justify">{data.mandateDetails.purpose}</p>}
                {data.mandateDetails.protectedRights && <p className="text-justify">{data.mandateDetails.protectedRights}</p>}
              </div>
            )}

            {/* Investigation Results */}
            {data.observationDays.length > 0 && (
              <div className="mb-8">
                <h3 className="font-playfair font-bold mb-4 text-base uppercase">Esito degli Accertamenti e dell'Attività di Osservazione Diretta</h3>
                <p className="mb-4 text-justify">
                  Nel corso dell'accertamento svolto dal {data.observationDays.length > 0 ? formatDate(data.observationDays[0].date) : ''} 
                  {data.observationDays.length > 1 ? ` al ${formatDate(data.observationDays[data.observationDays.length - 1].date)}` : ''} 
                  sono emersi i seguenti elementi circa la finalità dell'indagine espletata:
                </p>
                
                {data.observationDays.map((day, index) => (
                  <div key={day.id} className="mb-6">
                    <h4 className="font-bold mb-2 text-base">
                      Giorno {index + 1}: {new Date(day.date).toLocaleDateString('it-IT', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h4>
                    <p className="text-justify">
                      Dalle ore {formatTime(day.startTime)} alle ore {formatTime(day.endTime)}, sono state condotte attività di osservazione.
                      {day.locations.length > 0 && (
                        <span>
                          {' '}I luoghi visitati includono: {day.locations.map(loc => `${loc.placeName} (${loc.address})`).join(', ')}.
                        </span>
                      )}
                      <br />
                      {day.description && <span className="mt-2 block whitespace-pre-wrap">{day.description}</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Conclusions */}
            {data.conclusions.text && (
              <div className="mb-8">
                <h3 className="font-playfair font-bold mb-2 text-base uppercase">Conclusioni</h3>
                <p className="text-justify whitespace-pre-wrap">{data.conclusions.text}</p>
              </div>
            )}

            {/* Additional Notes */}
            {data.additionalNotes.notes && (
              <div className="mb-8">
                <h3 className="font-playfair font-bold mb-2 text-base uppercase">Note Aggiuntive</h3>
                <p className="text-justify whitespace-pre-wrap">{data.additionalNotes.notes}</p>
              </div>
            )}

            {/* Photos section based on strategy */}
            {data.photos.length > 0 && (
              <div className="mb-8">
                <h3 className="font-playfair font-bold mb-2 text-base uppercase">Documentazione Fotografica</h3>
                <p className="text-justify">
                  {data.photoManagement.photoStrategy === 'separate-dossier' 
                    ? `Allegato al presente report viene consegnato un fascicolo fotografico contenente ${data.photos.length} immagini documentali.`
                    : `Sono state acquisite ${data.photos.length} immagini documentali durante le attività di osservazione.`
                  }
                </p>
                {data.photoManagement.photoStrategy === 'per-day' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {data.photos.map((photo) => photo.url && (
                      <div key={photo.id} className="border border-slate-300 p-2 rounded-lg">
                        <img src={photo.url} alt={photo.description} className="w-full h-48 object-cover mb-2 rounded" />
                        <p className="text-xs text-steel-700">{photo.time} - {photo.location}</p>
                        <p className="text-xs text-steel-800 mt-1">{photo.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Closing Statement */}
            <div className="mb-8 text-justify">
              <p>Tanto vi dovevamo per le Vs. eventuali e ulteriori valutazioni.</p>
            </div>

            {/* Signature */}
            <div className="text-right mb-12 mt-12">
              <p className="font-bold text-base">INVESTIGATORE PRIVATO</p>
              <p className="mt-2 text-base">Tripolino Alessandro</p>
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
      </div>
    </div>
  );
};