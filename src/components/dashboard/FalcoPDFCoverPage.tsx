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

  // Logo di fallback migliorato
  const FALLBACK_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIiBmaWxsPSJub25lIj4KICA8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzOCIgZmlsbD0iIzJkM2E4NyIgc3Ryb2tlPSIjMTEyNTZhIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8cGF0aCBkPSJNNDAgMTBzMTUgNSAxNSAyMHYxNWwtMTUgMTUtMTUtMTV2LTE1YzAtMTUgMTUtMjAgMTUtMjB6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Z24K";

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      padding: '0',
      margin: '0'
    }}>
      {/* Contenuto principale della copertina */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Logo aziendale centrato */}
        <div className="text-center" style={{ marginBottom: '30pt' }}>
          {agencyProfile?.agency_logo_url ? (
            <img 
              src={getProxyImageUrl(agencyProfile.agency_logo_url)} 
              alt="Logo Agenzia"
              className="agency-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = FALLBACK_LOGO_BASE64;
              }}
            />
          ) : (
            <img 
              src={FALLBACK_LOGO_BASE64} 
              alt="Logo Predefinito"
              className="agency-logo"
            />
          )}
        </div>

        {/* Informazioni agenzia centrate */}
        {agencyProfile && (
          <div className="header-info">
            <div style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '5pt' }}>
              {agencyProfile.agency_name}
            </div>
            <div style={{ fontSize: '10pt', marginBottom: '3pt' }}>
              {agencyProfile.agency_address}
            </div>
            <div style={{ fontSize: '10pt', marginBottom: '3pt' }}>
              Tel: {agencyProfile.agency_phone} | Email: {agencyProfile.agency_email}
            </div>
            {agencyProfile.agency_website && (
              <div style={{ fontSize: '10pt' }}>
                Web: {agencyProfile.agency_website}
              </div>
            )}
          </div>
        )}

        {/* Titolo principale centrato */}
        <div className="title-center" style={{ margin: '40pt 0' }}>
          <h1 style={{ 
            fontSize: '24pt', 
            fontWeight: 'bold', 
            marginBottom: '10pt',
            textTransform: 'uppercase',
            letterSpacing: '2pt',
            color: '#000'
          }}>
            REPORT INVESTIGATIVO
          </h1>
          <div style={{ 
            fontSize: '14pt', 
            fontWeight: 'bold',
            color: '#333',
            marginTop: '20pt'
          }}>
            Oggetto: {data.mandateDetails?.mandateObject || 'Non specificato'}
          </div>
        </div>

        {/* Informazioni principali centrate */}
        <div style={{ 
          textAlign: 'center', 
          margin: '30pt auto',
          maxWidth: '400pt'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            margin: '0 auto'
          }}>
            <tr>
              <td style={{ 
                padding: '8pt', 
                borderBottom: '1pt solid #ccc',
                fontWeight: 'bold',
                textAlign: 'left',
                width: '40%'
              }}>
                Cliente:
              </td>
              <td style={{ 
                padding: '8pt', 
                borderBottom: '1pt solid #ccc',
                textAlign: 'left'
              }}>
                {data.clientInfo?.fullName || 'Non specificato'}
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '8pt', 
                borderBottom: '1pt solid #ccc',
                fontWeight: 'bold',
                textAlign: 'left'
              }}>
                Soggetto:
              </td>
              <td style={{ 
                padding: '8pt', 
                borderBottom: '1pt solid #ccc',
                textAlign: 'left'
              }}>
                {data.investigatedInfo?.fullName || 'Non specificato'}
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '8pt', 
                borderBottom: '1pt solid #ccc',
                fontWeight: 'bold',
                textAlign: 'left'
              }}>
                Periodo:
              </td>
              <td style={{ 
                padding: '8pt', 
                borderBottom: '1pt solid #ccc',
                textAlign: 'left'
              }}>
                {data.mandateDetails?.startDate && data.mandateDetails?.endDate
                  ? `${formatDate(data.mandateDetails.startDate)} - ${formatDate(data.mandateDetails.endDate)}`
                  : 'Non specificato'
                }
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '8pt', 
                fontWeight: 'bold',
                textAlign: 'left'
              }}>
                Data Report:
              </td>
              <td style={{ 
                padding: '8pt', 
                textAlign: 'left'
              }}>
                {formatDateLong(today)}
              </td>
            </tr>
          </table>
        </div>

        {/* Nota di riservatezza centrata */}
        <div style={{ 
          textAlign: 'center',
          marginTop: 'auto',
          marginBottom: '20pt',
          fontSize: '10pt',
          fontStyle: 'italic',
          color: '#666',
          maxWidth: '400pt',
          margin: 'auto auto 20pt auto'
        }}>
          <div style={{ 
            border: '1pt solid #ccc',
            padding: '10pt',
            backgroundColor: '#f9f9f9'
          }}>
            <strong>DOCUMENTO RISERVATO</strong><br />
            Il presente documento contiene informazioni riservate e confidenziali.<br />
            È vietata la riproduzione anche parziale senza autorizzazione scritta.
          </div>
        </div>
      </div>

      {/* Footer della copertina */}
      <div className="cover-page-footer">
        <div style={{ fontSize: '9pt', color: '#666' }}>
          Investigatore: {agencyProfile ? `${agencyProfile.first_name} ${agencyProfile.last_name}` : 'Non specificato'}
        </div>
        <div style={{ fontSize: '8pt', color: '#999', marginTop: '5pt' }}>
          Report generato il {formatDateLong(today)}
        </div>
      </div>
    </div>
  );
};