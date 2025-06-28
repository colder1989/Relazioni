import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom'; // Importa Outlet
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, UserCircle, Shield } from 'lucide-react';

interface MainLayoutProps {
  children?: React.ReactNode; // children non è più strettamente necessario per Outlet, ma lo lascio per compatibilità
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  // La logica di handleSignOut è stata spostata o sarà gestita altrove per questa fase di debug
  // const handleSignOut = async () => { /* ... */ };

  return (
    <div className="min-h-screen flex flex-col bg-steel-900">
      <header className="glass-effect border-b shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 falco-gradient rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">Falco Investigation</h1>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center space-x-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/profile" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center space-x-2">
              <UserCircle className="w-4 h-4" />
              <span>Profilo</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet /> {/* Qui viene renderizzato il contenuto delle rotte annidate */}
      </main>
    </div>
  );
};