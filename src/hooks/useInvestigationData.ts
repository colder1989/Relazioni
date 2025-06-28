import { useState, useCallback } from 'react';

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
  file: File | null;
  description: string;
  time: string;
  location: string;
  url?: string;
  date: string; // Added date field for photo
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
  const [data, setData] = useState<InvestigationData>(initialData);

  const updateData = useCallback((updates: Partial<InvestigationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
  }, []);

  return {
    data,
    updateData,
    resetData,
  };
};