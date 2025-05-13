import Dexie, { Table } from 'dexie';
import bcrypt from 'bcryptjs';

export interface User {
  id?: number;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface Hospital {
  id?: number;
  userId: number;
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
  createdAt: Date;
}

class MedExchangeDB extends Dexie {
  users!: Table<User>;
  hospitals!: Table<Hospital>;

  constructor() {
    super('MedExchangeDB');
    this.version(1).stores({
      users: '++id, email',
      hospitals: '++id, userId, name'
    });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.users.where('email').equals(email.toLowerCase()).first();
  }

  async createUser(email: string, password: string): Promise<number> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    return await this.users.add({
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date()
    });
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.passwordHash);
  }

  async getHospitalByUserId(userId: number): Promise<Hospital | undefined> {
    return await this.hospitals.where('userId').equals(userId).first();
  }

  async createHospital(hospitalData: Omit<Hospital, 'id' | 'createdAt'>): Promise<number> {
    return await this.hospitals.add({
      ...hospitalData,
      createdAt: new Date()
    });
  }
}

export const db = new MedExchangeDB();
