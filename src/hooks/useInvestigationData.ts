import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { useToast } from '@/components/ui/use-toast';

export interface ClientInfo {
  fullName: string;
  address: string;
  birthDate: string;
  birthPlace: string;
  documentType: string;
  documentNumber: string;
}

export interface InvestigatedInfo {
  fullName: string;
  address: string;
  birthDate: string;
  birthPlace: string;
  vehicles: Array<{
    model: string;
    color: string;
    licensePlate: string;
  }>;
}

export interface MandateDetails {
  assignmentDate: string;
  investigationType: string;
  purpose: string;
  protectedRights: string;
}

export interface ObservationDay {
  id: string;
  type: 'single' | 'multiple' | 'general';
  date: string;
  startTime: string;
  endTime: string;
  locations: Array<{
    address: string;
    placeName: string;
  }>;
  description: string;
}

export interface Photo {
  id: string;
  description: string;
  time: string;
  location: string;
  url?: string;
  date: string;
}

export interface Conclusions {
  text: string;
}

export interface Privacy {
  standardMessage: string;
  customNotes: string;
}

export interface AdditionalNotes {
  notes: string;
}

export interface PhotoManagement {
  photoStrategy: 'per-day' | 'separate-dossier';
}

export interface InvestigationData {
  clientInfo: ClientInfo;
  investigatedInfo: InvestigatedInfo;
  mandateDetails: MandateDetails;
  observationDays: ObservationDay[];
  photos: Photo[];
  additionalNotes: AdditionalNotes;
  photoManagement: PhotoManagement;
  conclusions: Conclusions;
  privacy: Privacy;
}

const initialData: InvestigationData = {
  clientInfo: {
    fullName: '',
    address: '',
    birthDate: '',
    birthPlace: '',
    documentType: 'Carta d\'Identità',
    documentNumber: '',
  },
  investigatedInfo: {
    fullName: '',
    address: '',
    birthDate: '',
    birthPlace: '',
    vehicles: [],
  },
  mandateDetails: {
    assignmentDate: '',
    investigationType: '',
    purpose: '',
    protectedRights: '',
  },
  observationDays: [],
  photos: [],
  additionalNotes: {
    notes: '',
  },
  photoManagement: {
    photoStrategy: 'per-day',
  },
  conclusions: {
    text: '',
  },
  privacy: {
    standardMessage: 'La presente relazione è strettamente confidenziale e riservata. I dati contenuti sono stati raccolti nel rispetto della normativa sulla privacy (GDPR 679/2016) e del Codice Deontologico degli Investigatori Privati. È vietata la divulgazione a terzi non autorizzati.',
    customNotes: '',
  },
};

export const useInvestigationData = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { toast } = useToast();
  const [data, setData] = useState<InvestigationData>(initialData);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLatestReport = useCallback(async () => {
    if (!session?.user) {
      setIsLoadingReport(false);
      return;
    }

    try {
      setIsLoadingReport(true);
      const { data: reports, error } = await supabase
        .from('investigation_reports')
        .select('id, report_data')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error;
      }

      if (reports) {
        setData(reports.report_data as InvestigationData);
        setReportId(reports.id);
        toast({
          title: "Successo",
          description: "Ultimo report caricato.",
        });
      } else {
        setData(initialData);
        setReportId(null);
        toast({
          title: "Benvenuto",
          description: "Nessun report trovato, inizia una nuova relazione.",
        });
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il report.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReport(false);
    }
  }, [session, toast]);

  const saveReport = useCallback(async (currentData: InvestigationData, currentReportId: string | null) => {
    if (!session?.user) {
      toast({
        title: "Errore",
        description: "Devi essere loggato per salvare il report.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reportToSave = {
        user_id: session.user.id,
        report_data: currentData,
      };

      let error = null;
      let newReportId = currentReportId;

      if (currentReportId) {
        const { error: updateError } = await supabase
          .from('investigation_reports')
          .update(reportToSave)
          .eq('id', currentReportId);
        error = updateError;
      } else {
        const { data: newReport, error: insertError } = await supabase
          .from('investigation_reports')
          .insert(reportToSave)
          .select('id')
          .single();
        error = insertError;
        if (newReport) {
          newReportId = newReport.id;
          setReportId(newReport.id);
        }
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Successo",
        description: "Report salvato automaticamente.",
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il report.",
        variant: "destructive",
      });
    }
  }, [session, toast]);

  // Effect to fetch report on session change
  useEffect(() => {
    if (!isSessionLoading) {
      fetchLatestReport();
    }
  }, [isSessionLoading, fetchLatestReport]);

  // Effect to debounce saving data
  useEffect(() => {
    if (isLoadingReport || !session?.user) return; // Don't save while loading or if not logged in

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      saveReport(data, reportId);
    }, 1000); // Save after 1 second of no changes

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [data, reportId, saveReport, isLoadingReport, session]);

  const updateData = useCallback((updates: Partial<InvestigationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
    setReportId(null); // Reset report ID to create a new one
    toast({
      title: "Nuova Relazione",
      description: "Inizia a compilare la tua nuova relazione investigativa.",
    });
  }, [toast]);

  return {
    data,
    updateData,
    resetData,
    isLoadingReport,
  };
};