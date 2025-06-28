import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-steel-900 p-4">
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-steel-800 border border-steel-700">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/ea7672d3-5fe4-45e8-bd81-ca137cc8caa8.png" 
            alt="Falco Investigation Logo" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-slate-100">Accedi a Falco Investigation</h2>
          <p className="text-slate-400 text-sm">Gestisci le tue relazioni investigative professionali</p>
        </div>
        <Auth
          supabaseClient={supabase}
          providers={[]} // No third-party providers for now
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))', // Using Tailwind primary color
                  brandAccent: 'hsl(var(--primary-foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  messageText: 'hsl(var(--foreground))',
                  messageBackground: 'hsl(var(--card))',
                  anchorText: 'hsl(var(--primary))',
                  anchorTextHover: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="dark" // Using dark theme to match app
          localization={{
            variables: {
              sign_in: {
                email_label: 'Indirizzo Email',
                password_label: 'Password',
                email_input_placeholder: 'La tua email',
                password_input_placeholder: 'La tua password',
                button_label: 'Accedi',
                social_provider_text: 'Accedi con {{provider}}',
                link_text: 'Hai già un account? Accedi',
              },
              sign_up: {
                email_label: 'Indirizzo Email',
                password_label: 'Password',
                email_input_placeholder: 'La tua email',
                password_input_placeholder: 'Crea una password',
                button_label: 'Registrati',
                social_provider_text: 'Registrati con {{provider}}',
                link_text: 'Non hai un account? Registrati',
              },
              forgotten_password: {
                email_label: 'Indirizzo Email',
                password_reset_button_label: 'Invia istruzioni per il reset',
                link_text: 'Hai dimenticato la password?',
                email_input_placeholder: 'La tua email',
              },
              update_password: {
                password_label: 'Nuova Password',
                password_input_placeholder: 'La tua nuova password',
                button_label: 'Aggiorna password',
              },
              magic_link: {
                email_input_placeholder: 'La tua email',
                button_label: 'Invia Magic Link',
                link_text: 'Invia un Magic Link',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;