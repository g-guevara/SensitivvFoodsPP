// app/components/Login/User.ts
export interface User {
  _id: string;
  userID: string;
  name: string;
  email: string;
  language: string;
  trialPeriodDays: number;
  
  // Nuevos campos personales
  personalInfo?: {
    rut?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    allergies?: string[];
    diagnosedDiseases?: string[];
    paymentMethod?: {
      type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
      details?: string;
      isDefault?: boolean;
    }[];
  };
  
  // Metadatos
  profileCompleteness?: number; // Porcentaje de completitud del perfil
  lastUpdated?: string;
}