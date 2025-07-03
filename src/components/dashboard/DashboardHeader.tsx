import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Plus, CheckCircle, Clock, AlertCircle, Shield, Search, LogOut, UserCircle, Loader2 } from 'lucide-react';

interface DashboardHeaderProps {
  agencyName: string;
  stats: {
    completed: number;
    total: number;
    percentage: number;
  };
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  handleExportPDF: () => Promise<void>;
  isExporting: boolean;
  handleSignOut: () => Promise<void>;
  onProfileClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  agencyName,
  stats,
  showPreview,
  setShowPreview,
  handleExportPDF,
  isExporting,
  handleSignOut,
  onProfileClick,
}) => {
  const getStatusIcon = () => {
    if (stats.percentage === 100) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (stats.percentage >= 50) return <Clock className="w-5 h-5 text-blue-400" />;
    return <AlertCircle className="w-5 h-5 text-amber-400" />;
  };

  const getStatusText = () => {
    if (stats.percentage === 100) return "Relazione Completa";
    if (stats.percentage >= 50) return "In Corso";
    return "Da Iniziare";
  };

  const getStatusClass = () => {
    if (stats.percentage === 100) return "status-complete";
    if (stats.percentage >= 50) return "status-progress";
    return "status-pending";
  };

  return (
    <header className="glass-effect border-b shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 slide-in-up">
            <div className="w-12 h-12 falco-gradient rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{agencyName}</h1>
              <p className="text-slate-300 flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Dashboard Relazioni Investigative</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getStatusClass()}`}>
              {getStatusIcon()}
              <span className="text-sm font-medium text-white">{getStatusText()}</span>
            </div>
            <Badge className="professional-badge">
              {stats.percentage}% Completato
            </Badge>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="floating-button flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Anteprima</span>
            </Button>
            <Button
              onClick={handleExportPDF}
              className="falco-gradient text-white hover:opacity-90 flex items-center space-x-2 floating-button"
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Esporta PDF' : 'Esporta PDF'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={onProfileClick}
              className="floating-button flex items-center space-x-2"
            >
              <UserCircle className="w-4 h-4" />
              <span>Profilo</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="floating-button flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Esci</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};