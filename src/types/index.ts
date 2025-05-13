export interface Hospital {
  id: string;
  name: string;
  licenseNumber: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  representative: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export interface Drug {
  id: string;
  name: string;
  din?: string; // Drug Identification Number
  dosage?: string;
}

export interface Location {
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface DrugRequest {
  id: string;
  hospitalId: string;
  drugs: Drug[];
  location: Location;
  maxDistance: number; // in kilometers
  status: 'pending' | 'matched' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface DrugOffer {
  id: string;
  hospitalId: string;
  drugs: Drug[];
  location: Location;
  maxDistance: number; // Maximum distance willing to deliver/transport
  expiryDate?: string;
  status: 'available' | 'reserved' | 'completed' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  requestId: string;
  offerId: string;
  requesterHospitalId: string;
  providerHospitalId: string;
  drugName: string;
  similarityScore: number;
  distance: number; // in kilometers
  status: 'pending' | 'notified' | 'agreed' | 'completed' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}