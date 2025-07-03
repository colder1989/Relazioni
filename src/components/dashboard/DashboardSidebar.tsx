import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { InvestigationData } from '@/hooks/useInvestigationData';

interface DashboardSidebarProps {
  stats: {
    completed: number;
    total: number;
    percentage: number;
  };
  resetData: () => void;
  data: InvestigationData; // Pass the full data to access counts
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ stats, resetData, data }) => {
  const getStatusIcon = () => {
    if (stats.percentage === 100) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (stats.percentage >= 50) return <Clock className="w-5 h-5 text-blue-400" />;
    return <AlertCircle className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="space-y-6">
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2 text-slate-100">
            {getStatusIcon()}
            <span>Stato Relazione</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Progresso Compilazione</span>
            <span className="text-sm font-medium text-blue-400">{stats.completed}/{stats.total}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          
          <div className="pt-4 space-y-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetData}
              className="w-full floating-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Relazione
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="section-card">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Guida Professionale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-3">
            {[
              "Compila le informazioni cliente",
              "Inserisci dati dell'investigato", 
              "Specifica dettagli del mandato",
              "Configura gestione foto",
              "Aggiungi giorni di osservazione",
              "Carica foto e documenti",
              "Aggiungi note extra se necessario",
              "Scrivi le conclusioni",
              "Esporta la relazione finale"
            ].map((step, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-3 rounded-lg professional-hover"
              >
                <div className={`step-indicator ${index < stats.completed ? 'active' : ''}`}>
                  {index + 1}
                </div>
                <p className="text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Stats Card */}
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Statistiche Investigative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 professional-accent rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{data.observationDays.length}</div>
              <div className="text-xs text-slate-300">Giorni Osservazione</div>
            </div>
            <div className="text-center p-4 professional-accent rounded-lg">
              <div className="text-2xl font-bold text-cyan-400">{data.photos.length}</div>
              <div className="text-xs text-slate-300">Foto Caricate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 professional-accent rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{data.investigatedInfo.vehicles.length}</div>
              <div className="text-xs text-slate-300">Veicoli Monitorati</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};