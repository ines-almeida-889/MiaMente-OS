import { 
  type User, type InsertUser,
  type Child, type InsertChild,
  type IntakeForm, type InsertIntakeForm,
  type Clinic, type InsertClinic,
  type Session, type InsertSession,
  type Claim, type InsertClaim,
  type Document, type InsertDocument
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Child methods
  getChild(id: string): Promise<Child | undefined>;
  getChildrenByParent(parentId: string): Promise<Child[]>;
  createChild(child: InsertChild): Promise<Child>;
  updateChild(id: string, updates: Partial<Child>): Promise<Child | undefined>;
  
  // Intake form methods
  getIntakeForm(childId: string): Promise<IntakeForm | undefined>;
  createIntakeForm(form: InsertIntakeForm): Promise<IntakeForm>;
  updateIntakeForm(id: string, updates: Partial<IntakeForm>): Promise<IntakeForm | undefined>;
  
  // Clinic methods
  getAllClinics(): Promise<Clinic[]>;
  getClinic(id: string): Promise<Clinic | undefined>;
  getClinicByUserId(userId: string): Promise<Clinic | undefined>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  
  // Session methods
  getSession(id: string): Promise<Session | undefined>;
  getSessionsByChild(childId: string): Promise<Session[]>;
  getSessionsByClinic(clinicId: string): Promise<Session[]>;
  getTodaysSessionsByClinic(clinicId: string): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  
  // Claim methods
  getClaim(id: string): Promise<Claim | undefined>;
  getAllClaims(): Promise<Claim[]>;
  getPendingClaims(): Promise<Claim[]>;
  getClaimsByChild(childId: string): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined>;
  
  // Document methods
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByChild(childId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private children: Map<string, Child> = new Map();
  private intakeForms: Map<string, IntakeForm> = new Map();
  private clinics: Map<string, Clinic> = new Map();
  private sessions: Map<string, Session> = new Map();
  private claims: Map<string, Claim> = new Map();
  private documents: Map<string, Document> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const parentUser: User = {
      id: "parent-1",
      username: "sarah.johnson",
      password: "password123",
      role: "parent",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      createdAt: new Date(),
    };

    const clinicUser: User = {
      id: "clinic-1",
      username: "dr.martinez",
      password: "password123",
      role: "clinic",
      name: "Dr. Martinez",
      email: "martinez@clinic.com",
      createdAt: new Date(),
    };

    const insuranceUser: User = {
      id: "insurance-1",
      username: "admin.ndis",
      password: "password123",
      role: "insurance",
      name: "NDIS Admin",
      email: "admin@ndis.gov.au",
      createdAt: new Date(),
    };

    this.users.set(parentUser.id, parentUser);
    this.users.set(clinicUser.id, clinicUser);
    this.users.set(insuranceUser.id, insuranceUser);

    // Create sample child
    const child: Child = {
      id: "child-1",
      parentId: "parent-1",
      name: "Emma Johnson",
      dateOfBirth: new Date("2017-03-15"),
      gender: "female",
      primaryLanguage: "English",
      currentDiagnosis: "Autism Spectrum Disorder",
      diagnosisDate: new Date("2020-01-15"),
      diagnosingProfessional: "Dr. Smith",
      ndisStatus: "approved",
      createdAt: new Date(),
    };

    this.children.set(child.id, child);

    // Create sample clinic
    const clinic: Clinic = {
      id: "clinic-1",
      userId: "clinic-1",
      name: "Sunshine Therapy Center",
      specialization: "Speech Therapy",
      address: "123 Main St, Sydney NSW 2000",
      distance: "2.3",
      rating: "4.8",
      availability: "available",
      createdAt: new Date(),
    };

    this.clinics.set(clinic.id, clinic);

    // Create sample sessions
    const session: Session = {
      id: "session-1",
      childId: "child-1",
      clinicId: "clinic-1",
      sessionType: "Speech Therapy",
      scheduledDate: new Date(),
      status: "scheduled",
      notes: "",
      goalsAchieved: false,
      homeworkAssigned: false,
      createdAt: new Date(),
    };

    this.sessions.set(session.id, session);

    // Create sample claims
    const claim: Claim = {
      id: "claim-1",
      claimNumber: "NDIS-2024-0312-001",
      childId: "child-1",
      clinicId: "clinic-1",
      amount: "2840.00",
      status: "pending",
      submittedDate: new Date(),
      reviewedDate: null,
      period: "Feb 1-28, 2024",
      priority: "normal",
      createdAt: new Date(),
    };

    this.claims.set(claim.id, claim);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Child methods
  async getChild(id: string): Promise<Child | undefined> {
    return this.children.get(id);
  }

  async getChildrenByParent(parentId: string): Promise<Child[]> {
    return Array.from(this.children.values()).filter(child => child.parentId === parentId);
  }

  async createChild(insertChild: InsertChild): Promise<Child> {
    const id = randomUUID();
    const child: Child = { 
      ...insertChild, 
      id,
      createdAt: new Date(),
    };
    this.children.set(id, child);
    return child;
  }

  async updateChild(id: string, updates: Partial<Child>): Promise<Child | undefined> {
    const child = this.children.get(id);
    if (child) {
      const updatedChild = { ...child, ...updates };
      this.children.set(id, updatedChild);
      return updatedChild;
    }
    return undefined;
  }

  // Intake form methods
  async getIntakeForm(childId: string): Promise<IntakeForm | undefined> {
    return Array.from(this.intakeForms.values()).find(form => form.childId === childId);
  }

  async createIntakeForm(insertForm: InsertIntakeForm): Promise<IntakeForm> {
    const id = randomUUID();
    const form: IntakeForm = { 
      ...insertForm, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.intakeForms.set(id, form);
    return form;
  }

  async updateIntakeForm(id: string, updates: Partial<IntakeForm>): Promise<IntakeForm | undefined> {
    const form = this.intakeForms.get(id);
    if (form) {
      const updatedForm = { ...form, ...updates, updatedAt: new Date() };
      this.intakeForms.set(id, updatedForm);
      return updatedForm;
    }
    return undefined;
  }

  // Clinic methods
  async getAllClinics(): Promise<Clinic[]> {
    return Array.from(this.clinics.values());
  }

  async getClinic(id: string): Promise<Clinic | undefined> {
    return this.clinics.get(id);
  }

  async getClinicByUserId(userId: string): Promise<Clinic | undefined> {
    return Array.from(this.clinics.values()).find(clinic => clinic.userId === userId);
  }

  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    const id = randomUUID();
    const clinic: Clinic = { 
      ...insertClinic, 
      id,
      createdAt: new Date(),
    };
    this.clinics.set(id, clinic);
    return clinic;
  }

  // Session methods
  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getSessionsByChild(childId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(session => session.childId === childId);
  }

  async getSessionsByClinic(clinicId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(session => session.clinicId === clinicId);
  }

  async getTodaysSessionsByClinic(clinicId: string): Promise<Session[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return Array.from(this.sessions.values()).filter(session => 
      session.clinicId === clinicId && 
      session.scheduledDate >= today && 
      session.scheduledDate < tomorrow
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = { 
      ...insertSession, 
      id,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (session) {
      const updatedSession = { ...session, ...updates };
      this.sessions.set(id, updatedSession);
      return updatedSession;
    }
    return undefined;
  }

  // Claim methods
  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getAllClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values());
  }

  async getPendingClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values()).filter(claim => claim.status === "pending");
  }

  async getClaimsByChild(childId: string): Promise<Claim[]> {
    return Array.from(this.claims.values()).filter(claim => claim.childId === childId);
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = randomUUID();
    const claim: Claim = { 
      ...insertClaim, 
      id,
      createdAt: new Date(),
    };
    this.claims.set(id, claim);
    return claim;
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (claim) {
      const updatedClaim = { ...claim, ...updates };
      this.claims.set(id, updatedClaim);
      return updatedClaim;
    }
    return undefined;
  }

  // Document methods
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByChild(childId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.childId === childId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = { 
      ...insertDocument, 
      id,
      createdAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }
}

export const storage = new MemStorage();
