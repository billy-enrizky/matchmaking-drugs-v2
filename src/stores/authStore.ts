import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, Hospital as HospitalModel, User as UserModel } from '../services/db';

interface User {
  id: number;
  email: string;
}

export interface Hospital {
  id: number;
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
  user: User | null;
  hospital: Hospital | null;
  isAuthenticated: boolean;
  isRegistering: boolean;
  tempEmail: string | null;
  isUserRegistered: boolean | null;
  
  // Auth actions
  checkUserExists: (email: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Hospital registration
  setTempEmail: (email: string | null) => void;
  setIsRegistering: (isRegistering: boolean) => void;
  registerHospital: (hospital: Omit<HospitalModel, 'id' | 'userId' | 'createdAt'>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hospital: null,
      isAuthenticated: false,
      isRegistering: false,
      tempEmail: null,
      isUserRegistered: null,
      
      checkUserExists: async (email: string) => {
        try {
          const user = await db.findUserByEmail(email);
          set({ isUserRegistered: !!user, tempEmail: email });
          return !!user;
        } catch (error) {
          console.error('Error checking user existence:', error);
          return false;
        }
      },
      
      register: async (email: string, password: string) => {
        try {
          const userId = await db.createUser(email, password);
          if (userId) {
            set({ 
              user: { id: userId, email },
              isAuthenticated: true,
              isUserRegistered: true,
              tempEmail: null
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error registering user:', error);
          return false;
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          const user = await db.findUserByEmail(email);
          if (!user) return false;
          
          const isValid = await db.verifyPassword(user, password);
          if (!isValid) return false;
          
          const hospital = await db.getHospitalByUserId(user.id!);
          
          set({ 
            user: { id: user.id!, email: user.email },
            hospital: hospital ? {
              id: hospital.id!,
              name: hospital.name,
              licenseNumber: hospital.licenseNumber,
              address: hospital.address,
              representative: hospital.representative
            } : null,
            isAuthenticated: true,
            tempEmail: null
          });
          
          return true;
        } catch (error) {
          console.error('Error logging in:', error);
          return false;
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          hospital: null, 
          isAuthenticated: false,
          tempEmail: null,
          isUserRegistered: null
        });
      },
      
      setTempEmail: (email) => {
        set({ tempEmail: email });
      },
      
      setIsRegistering: (isRegistering) => {
        set({ isRegistering });
      },
      
      registerHospital: async (hospitalData) => {
        const { user } = get();
        
        if (!user) return false;
        
        try {
          const hospitalId = await db.createHospital({
            userId: user.id,
            ...hospitalData
          });
          
          if (hospitalId) {
            const hospital = await db.getHospitalByUserId(user.id);
            if (hospital) {
              set({
                hospital: {
                  id: hospital.id!,
                  name: hospital.name,
                  licenseNumber: hospital.licenseNumber,
                  address: hospital.address,
                  representative: hospital.representative
                },
                isRegistering: false
              });
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error('Error registering hospital:', error);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        hospital: state.hospital,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);