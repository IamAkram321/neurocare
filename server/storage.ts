import { type User, type InsertUser, type Vital, type InsertVital } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addVital(vital: InsertVital): Promise<Vital>;
  getLatestVitals(limit?: number): Promise<Vital[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vitals: Vital[];

  constructor() {
    this.users = new Map();
    this.vitals = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addVital(vital: InsertVital): Promise<Vital> {
    const newVital: Vital = {
      id: randomUUID(),
      heartRate: vital.heartRate?.toString() || null,
      spo2: vital.spo2?.toString() || null,
      temperature: vital.temperature?.toString() || null,
      fall: vital.fall ?? false,
      timestamp: new Date(),
    };
    this.vitals.push(newVital);
    return newVital;
  }

  async getLatestVitals(limit: number = 10): Promise<Vital[]> {
    return this.vitals.slice(-limit).reverse();
  }
}

export const storage = new MemStorage();
