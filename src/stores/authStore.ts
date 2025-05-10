import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Hospital {
  id: string;
  name: string;
  licenseNumber: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  representative: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
}

interface AuthState {
  hospital: Hospital | null;
  isAuthenticated: boolean;
  login: (hospital: Hospital) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hospital: null,
      isAuthenticated: false,
      login: (hospital) => set({ hospital, isAuthenticated: true }),
      logout: () => set({ hospital: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);