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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 falco-gradient rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold">Anteprima Report Investigativo</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" className="falco-gradient text-white">
              <Download className="w-4 h-4 mr-2" />
              Esporta PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-8">
          <div className="space-y-6 max-w-3xl mx-auto font-serif text-sm leading-relaxed">
            {/* Header with Logo and Date */}
            <div className="text-right mb-8">
              <p>Milano, {formatDateLong(new Date().toISOString())}</p>
            </div>

            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/ea7672d3-5fe4-45e8-bd81-ca137cc8caa8.png" 
                  alt="Falco Investigation Logo" 
                  className="h-20 w-auto"
                />
              </div>
              <h1 className="text-2xl font-bold mb-4">REPORT INVESTIGATIVO</h1>
            </div>

            {/* Client Address */}
            {data.clientInfo.fullName && (
              <div className="mb-8">
                <p><strong>Spett.le {data.clientInfo.fullName}</strong></p>
                {data.clientInfo.address && <p>{data.clientInfo.address}</p>}
              </div>
            )}

            {/* Client Details */}
            {data.clientInfo.fullName && (
              <div className="mb-6">
                <h3 className="font-bold mb-2 text-base">GENERALITÀ DEL MANDANTE</h3>
                <p>
                  {data.clientInfo.fullName}
                  {data.clientInfo.birthDate && data.clientInfo.birthPlace && 
                    ` nata a ${data.clientInfo.birthPlace} il ${formatDate(data.clientInfo.birthDate)}`
                  }
                  {data.clientInfo.address && ` e residente in ${data.clientInfo.address}`}
                  {data.clientInfo.documentNumber && 
                    `, identificata a mezzo ${data.clientInfo.documentType.toLowerCase()} n° ${data.clientInfo.documentNumber}.`
                  }
                </p>
              </div>
            )}

            {/* Investigated Person */}
            {data.investigatedInfo.fullName && (
              <div className="mb-6">
                <h3 className="font-bold mb-2 text-base">PERSONA DI CUI SI CHIEDE L'OSSERVAZIONE</h3>
                <p>
                  {data.investigatedInfo.fullName}
                  {data.investigatedInfo.birthDate && data.investigatedInfo.birthPlace && 
                    `, nato a ${data.investigatedInfo.birthPlace} il ${formatDate(data.investigatedInfo.birthDate)}`
                  }
                  {data.investigatedInfo.address && ` e residente a ${data.investigatedInfo.address}`}
                  , di seguito indicato come "osservato"
                </p>
                
                {data.investigatedInfo.vehicles.length > 0 && (
                  <div className="mt-3">
                    <p>L'osservato è solito utilizzare per i suoi spostamenti le seguenti autovetture:</p>
                    {data.investigatedInfo.vehicles.map((vehicle, index) => (
                      <p key={index} className="ml-4">
                        • {vehicle.model} di colore {vehicle.color} targato {vehicle.licensePlate}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Assignment Date */}
            {data.mandateDetails.assignmentDate && (
              <div className="mb-6">
                <h3 className="font-bold mb-2 text-base">DATA DELL'INCARICO</h3>
                <p>{formatDate(data.mandateDetails.assignmentDate)}</p>
              </div>
            )}

            {/* Purpose and Protected Rights */}
            {(data.mandateDetails.purpose || data.mandateDetails.protectedRights) && (
              <div className="mb-8">
                <h3 className="font-bold mb-2 text-base">FINALITÀ DEL MANDATO E DIRITTO CHE SI INTENDE TUTELARE</h3>
                {data.mandateDetails.purpose && <p className="mb-2">{data.mandateDetails.purpose}</p>}
                {data.mandateDetails.protectedRights && <p>{data.mandateDetails.protectedRights}</p>}
              </div>
            )}

            {/* Investigation Results */}
            {data.observationDays.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-base">ESITO DEGLI ACCERTAMENTI E DELL'ATTIVITÀ DI OSSERVAZIONE DIRETTA</h3>
                <p className="mb-4">
                  Nel corso dell'accertamento svolto dal {data.observationDays.length > 0 ? formatDate(data.observationDays[0].date) : ''} 
                  {data.observationDays.length > 1 ? ` al ${formatDate(data.observationDays[data.observationDays.length - 1].date)}` : ''} 
                  sono emersi i seguenti elementi circa la finalità dell'indagine espletata:
                </p>
                
                {data.observationDays.map((day, index) => (
                  <div key={day.id} className="mb-6">
                    <h4 className="font-bold mb-2 underline">
                      {new Date(day.date).toLocaleDateString('it-IT', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h4>
                    <p className="text-justify">
                      {day.description || `In data ${formatDate(day.date)}, dalle ore ${day.startTime} alle ore ${day.endTime}, sono state condotte attività di osservazione.`}
                      {day.locations.length > 0 && (
                        <span>
                          {' '}I luoghi visitati includono: {day.locations.map(loc => `${loc.placeName} (${loc.address})`).join(', ')}.
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Removed Gambling Activities */}

            {/* Conclusions */}
            {data.conclusions.text && (
              <div className="mb-8">
                <h3 className="font-bold mb-2 text-base">CONCLUSIONI</h3>
                <p className="text-justify whitespace-pre-wrap">{data.conclusions.text}</p>
              </div>
            )}

            {/* Additional Notes */}
            {data.additionalNotes.notes && (
              <div className="mb-8">
                <p className="text-justify whitespace-pre-wrap">{data.additionalNotes.notes}</p>
              </div>
            )}

            {/* Photos section based on strategy */}
            {data.photos.length > 0 && (
              <div className="mb-8">
                <p className="text-sm">
                  {data.photoManagement.photoStrategy === 'separate-dossier' 
                    ? `Allegato al presente report viene consegnato un fascicolo fotografico contenente ${data.photos.length} immagini documentali.`
                    : `Sono state acquisite ${data.photos.length} immagini documentali durante le attività di osservazione.`
                  }
                </p>
              </div>
            )}

            {/* Closing Statement */}
            <div className="mb-8">
              <p>Tanto vi dovevamo per le vs. eventuali e ulteriori valutazioni.</p>
            </div>

            {/* Privacy Notice */}
            <div className="mb-8">
              <p className="text-justify">
                Le informazioni contenute nel presente report sono di natura strettamente confidenziale e la loro divulgazione è consentita solo nel rispetto delle leggi vigenti, in particolar modo quelle sulla privacy. 
                Le responsabilità del loro uso difforme è in capo al soggetto che le diffonde.
              </p>
              <p className="mt-2 text-justify">
                <strong>N.B.:</strong> il presente report viene redatto in un unico esemplare originale. Lo stesso sarà consegnato nelle mani della mandante. Si fa presente che lo stesso potrà essere usato nel rispetto delle norme vigenti in materia di privacy. Si dà infine atto del fatto che tutto il materiale utilizzato per la sua redazione sarà distrutto all'atto della consegna.
              </p>
              {data.privacy.customNotes && (
                <p className="mt-2">{data.privacy.customNotes}</p>
              )}
            </div>

            {/* Signature */}
            <div className="text-right mb-12">
              <p className="font-bold">INVESTIGATORE PRIVATO</p>
              <p className="mt-8">Tripolino Alessandro</p>
            </div>

            {/* Footer with Company Info */}
            <div className="border-t border-slate-300 pt-4 text-center">
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold">FALCO INVESTIGATION</p>
                <p>20124 MILANO (MI) – VIA SABAUDIA 8</p>
                <p>Tel +39 02 82 19 79 69 - P.Iva IT11535690967</p>
                <p>Autorizzazione Prefettura Milano Prot. 14816/12B15E Area I OSP</p>
                <p>milano@falcoinvestigation.it - WWW.INVESTIGATIONFALCO.IT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};