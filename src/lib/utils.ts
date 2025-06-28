import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funzione per ottenere l'URL proxy dell'immagine
export const getProxyImageUrl = (originalUrl: string) => {
  if (!originalUrl) return ''; // Gestisci il caso di URL vuoto
  const supabaseProjectId = "pdufmdtcuwbedrkzoeko"; // Il tuo Project ID Supabase
  // Aggiungi un parametro di cache-busting per assicurarti che il browser non utilizzi una versione cache
  const cacheBuster = Date.now(); 
  return `https://${supabaseProjectId}.supabase.co/functions/v1/image-proxy?url=${encodeURIComponent(originalUrl)}&_cb=${cacheBuster}`;
};