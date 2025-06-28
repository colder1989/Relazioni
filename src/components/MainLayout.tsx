import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, LayoutDashboard, UserCircle, Shield } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Disconnessione",
        description: "Sei stato disconnesso con successo.",
      });
      // SessionContextProvider will handle the redirect to /login
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Errore",
        description: "Impossibile effettuare il logout.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (email: string | undefined) => {
    if (!email) return '??';
    const parts = email.split('@')[0].split('.');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

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

            {!isSessionLoading && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user.user_metadata.avatar_url} alt={session.user.email || "User"} />
                      <AvatarFallback className="bg-falco-navy text-white">
                        {getUserInitials(session.user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-steel-800 border border-steel-700 text-slate-100" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.email}</p>
                      <p className="text-xs leading-none text-slate-400">
                        {session.user.user_metadata.first_name} {session.user.user_metadata.last_name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-steel-700" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-steel-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="floating-button">Accedi</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};