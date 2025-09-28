import { 
  type User, type InsertUser,
  type Child, type InsertChild,
  type IntakeForm, type InsertIntakeForm,
  type Clinic, type InsertClinic,
  type Session, type InsertSession,
  type Claim, type InsertClaim,
  type Document, type InsertDocument,
  users, children, intakeForms, clinics, sessions, claims, documents
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and } from "drizzle-orm";
import bcrypt from 'bcryptjs'; // Import bcryptjs
// import { createClient } from "@supabase/supabase-js"; // Removed Supabase client import

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>; // Modified: accepts InsertUser (with password)
  
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

// Initialize PostgreSQL connection using node-postgres
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL or SUPABASE_DATABASE_URL is not configured.");
  throw new Error("Database URL is not configured.");
}

console.log('🔄 Creating PostgreSQL connection to:', databaseUrl.substring(0, Math.min(databaseUrl.length, 80)) + '...');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = drizzle(pool);

// Initialize Supabase client for authentication - REMOVED
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error("❌ SUPABASE_URL or SUPABASE_ANON_KEY is not configured.");
//   throw new Error("Supabase URL and Anon Key must be configured.");
// }

// const supabase = createClient(
//   supabaseUrl,
//   supabaseAnonKey
// );

export class SupabaseStorage implements IStorage {
  constructor() {
    // Note: Seeding disabled to avoid connection issues at startup
    // Data will be created as needed during normal operation
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        return; // Data already seeded
      }

      // Create sample users
      const sampleUsers = [
        {
          id: "parent-1",
          username: "sarah.johnson",
          password: "password123",
          role: "parent",
          name: "Sarah Johnson",
          email: "sarah@example.com",
        },
        {
          id: "clinic-1",
          username: "dr.martinez",
          password: "password123",
          role: "clinic",
          name: "Dr. Martinez",
          email: "martinez@clinic.com",
        }
      ];

      await db.insert(users).values(sampleUsers);

      // Create sample child
      await db.insert(children).values([{
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
      }]);

      // Create sample clinic
      await db.insert(clinics).values([{
        id: "clinic-1",
        userId: "clinic-1",
        name: "Sunshine Therapy Center",
        specialization: "Speech Therapy",
        address: "123 Main St, Sydney NSW 2000",
        distance: "2.3",
        rating: "4.8",
        availability: "available",
      }]);

      // Create sample session
      await db.insert(sessions).values([{
        id: "session-1",
        childId: "child-1",
        clinicId: "clinic-1",
        sessionType: "Speech Therapy",
        scheduledDate: new Date(),
        status: "scheduled",
        notes: "",
        goalsAchieved: false,
        homeworkAssigned: false,
      }]);

      // Create sample claim
      await db.insert(claims).values([{
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
      }]);

      console.log("Sample data seeded successfully");
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // let createdAuthUserId: string | null = null; // No longer needed
    
    try {
      // First check if user already exists in our database
      const existingUserByUsername = await this.getUserByUsername(insertUser.username);
      if (existingUserByUsername) {
        throw new Error("Username already exists");
      }

      const existingUserByEmail = await this.getUserByEmail(insertUser.email);
      if (existingUserByEmail) {
        throw new Error("Email already exists");
      }

      console.log("🔄 Hashing password for user:", insertUser.username);
      const hashedPassword = await bcrypt.hash(insertUser.password, 10); // Hash password

      console.log("🔄 Attempting to insert new user into Drizzle DB:", insertUser.username);
      // Directly insert user into our Drizzle database
      const result = await db.insert(users).values({
        ...insertUser,
        password: hashedPassword, // Store hashed password
      }).returning();
      
      if (result.length === 0) {
        console.error("❌ Drizzle insert did not return any data for user:", insertUser.username);
        throw new Error("Failed to create user in database.");
      }
      
      console.log("✅ User created in database:", result[0].username, "with ID:", result[0].id);
      
      return result[0];
    } catch (error) {
      console.error("❌ Error during createUser in storage:", error);
      throw error;
    }
  }

  // Child methods
  async getChild(id: string): Promise<Child | undefined> {
    try {
      const result = await db.select().from(children).where(eq(children.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting child:", error);
      return undefined;
    }
  }

  async getChildrenByParent(parentId: string): Promise<Child[]> {
    try {
      const result = await db.select().from(children).where(eq(children.parentId, parentId));
      return result;
    } catch (error) {
      console.error("Error getting children by parent:", error);
      return [];
    }
  }

  async createChild(insertChild: InsertChild): Promise<Child> {
    try {
      const result = await db.insert(children).values(insertChild).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating child:", error);
      throw error;
    }
  }

  async updateChild(id: string, updates: Partial<Child>): Promise<Child | undefined> {
    try {
      const result = await db.update(children).set(updates).where(eq(children.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating child:", error);
      return undefined;
    }
  }

  // Intake form methods
  async getIntakeForm(childId: string): Promise<IntakeForm | undefined> {
    try {
      const result = await db.select().from(intakeForms).where(eq(intakeForms.childId, childId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting intake form:", error);
      return undefined;
    }
  }

  async createIntakeForm(insertForm: InsertIntakeForm): Promise<IntakeForm> {
    try {
      const result = await db.insert(intakeForms).values(insertForm).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating intake form:", error);
      throw error;
    }
  }

  async updateIntakeForm(id: string, updates: Partial<IntakeForm>): Promise<IntakeForm | undefined> {
    try {
      const result = await db.update(intakeForms).set(updates).where(eq(intakeForms.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating intake form:", error);
      return undefined;
    }
  }

  // Clinic methods
  async getAllClinics(): Promise<Clinic[]> {
    try {
      const result = await db.select().from(clinics);
      return result;
    } catch (error) {
      console.error("Error getting all clinics:", error);
      return [];
    }
  }

  async getClinic(id: string): Promise<Clinic | undefined> {
    try {
      const result = await db.select().from(clinics).where(eq(clinics.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting clinic:", error);
      return undefined;
    }
  }

  async getClinicByUserId(userId: string): Promise<Clinic | undefined> {
    try {
      const result = await db.select().from(clinics).where(eq(clinics.userId, userId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting clinic by user ID:", error);
      return undefined;
    }
  }

  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    try {
      const result = await db.insert(clinics).values(insertClinic).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating clinic:", error);
      throw error;
    }
  }

  // Session methods
  async getSession(id: string): Promise<Session | undefined> {
    try {
      const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting session:", error);
      return undefined;
    }
  }

  async getSessionsByChild(childId: string): Promise<Session[]> {
    try {
      const result = await db.select().from(sessions).where(eq(sessions.childId, childId));
      return result;
    } catch (error) {
      console.error("Error getting sessions by child:", error);
      return [];
    }
  }

  async getSessionsByClinic(clinicId: string): Promise<Session[]> {
    try {
      const result = await db.select().from(sessions).where(eq(sessions.clinicId, clinicId));
      return result;
    } catch (error) {
      console.error("Error getting sessions by clinic:", error);
      return [];
    }
  }

  async getTodaysSessionsByClinic(clinicId: string): Promise<Session[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const result = await db.select().from(sessions).where(
        and(
          eq(sessions.clinicId, clinicId),
          // Note: For proper date filtering, you might need to use SQL functions
          // This is a simplified version
        )
      );
      
      // Filter in memory for now - in production you'd use proper SQL date functions
      return result.filter(session => 
        session.scheduledDate >= today && 
        session.scheduledDate < tomorrow
      );
    } catch (error) {
      console.error("Error getting today's sessions by clinic:", error);
      return [];
    }
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    try {
      const result = await db.insert(sessions).values(insertSession).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    try {
      const result = await db.update(sessions).set(updates).where(eq(sessions.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating session:", error);
      return undefined;
    }
  }

  // Claim methods
  async getClaim(id: string): Promise<Claim | undefined> {
    try {
      const result = await db.select().from(claims).where(eq(claims.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting claim:", error);
      return undefined;
    }
  }

  async getAllClaims(): Promise<Claim[]> {
    try {
      const result = await db.select().from(claims);
      return result;
    } catch (error) {
      console.error("Error getting all claims:", error);
      return [];
    }
  }

  async getPendingClaims(): Promise<Claim[]> {
    try {
      const result = await db.select().from(claims).where(eq(claims.status, "pending"));
      return result;
    } catch (error) {
      console.error("Error getting pending claims:", error);
      return [];
    }
  }

  async getClaimsByChild(childId: string): Promise<Claim[]> {
    try {
      const result = await db.select().from(claims).where(eq(claims.childId, childId));
      return result;
    } catch (error) {
      console.error("Error getting claims by child:", error);
      return [];
    }
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    try {
      const result = await db.insert(claims).values(insertClaim).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating claim:", error);
      throw error;
    }
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined> {
    try {
      const result = await db.update(claims).set(updates).where(eq(claims.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating claim:", error);
      return undefined;
    }
  }

  // Document methods
  async getDocument(id: string): Promise<Document | undefined> {
    try {
      const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting document:", error);
      return undefined;
    }
  }

  async getDocumentsByChild(childId: string): Promise<Document[]> {
    try {
      const result = await db.select().from(documents).where(eq(documents.childId, childId));
      return result;
    } catch (error) {
      console.error("Error getting documents by child:", error);
      return [];
    }
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    try {
      const result = await db.insert(documents).values(insertDocument).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const result = await db.delete(documents).where(eq(documents.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting document:", error);
      return false;
    }
  }
}

export const storage = new SupabaseStorage();
