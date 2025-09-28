import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChildSchema, insertIntakeFormSchema, insertSessionSchema, insertClaimSchema, insertDocumentSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Removed Supabase environment variable checks
      const { username, password } = loginSchema.parse(req.body);
      
      // Get user from local database
      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log("❌ Login failed: User not found.", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Direct password comparison
      if (user.password !== password) {
        console.log("❌ Login failed: Incorrect password for user:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("✅ User authenticated successfully:", user.username);
      // Omit password from the returned user object for security
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      // Removed Supabase environment variable checks
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists in our Drizzle DB
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        console.log("❌ Registration failed: Username already exists.", userData.username);
        return res.status(409).json({ message: "Username already exists" });
      }

      // Check if email already exists in our Drizzle DB
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        console.log("❌ Registration failed: Email already exists.", userData.email);
        return res.status(409).json({ message: "Email already exists" });
      }

      // Proceed to create user in storage (direct Drizzle insert)
      const user = await storage.createUser(userData);
      
      console.log("✅ User registered successfully.", user.username);
      // Omit password from the returned user object for security
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("❌ Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      } else if (error instanceof Error && (error.message.includes("Username already exists") || error.message.includes("Email already exists"))) {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Child routes
  app.get("/api/children/parent/:parentId", async (req, res) => {
    try {
      const children = await storage.getChildrenByParent(req.params.parentId);
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/children", async (req, res) => {
    try {
      const childData = insertChildSchema.parse(req.body);
      const child = await storage.createChild(childData);
      res.status(201).json(child);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/children/:id", async (req, res) => {
    try {
      const updates = req.body;
      const child = await storage.updateChild(req.params.id, updates);
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      res.json(child);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Intake form routes
  app.get("/api/intake-forms/child/:childId", async (req, res) => {
    try {
      const form = await storage.getIntakeForm(req.params.childId);
      if (!form) {
        return res.status(404).json({ message: "Intake form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/intake-forms", async (req, res) => {
    try {
      const formData = insertIntakeFormSchema.parse(req.body);
      const form = await storage.createIntakeForm(formData);
      res.status(201).json(form);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/intake-forms/:id", async (req, res) => {
    try {
      const updates = req.body;
      const form = await storage.updateIntakeForm(req.params.id, updates);
      if (!form) {
        return res.status(404).json({ message: "Intake form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Clinic routes
  app.get("/api/clinics", async (req, res) => {
    try {
      const clinics = await storage.getAllClinics();
      res.json(clinics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/clinics/user/:userId", async (req, res) => {
    try {
      const clinic = await storage.getClinicByUserId(req.params.userId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Session routes
  app.get("/api/sessions/child/:childId", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByChild(req.params.childId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sessions/clinic/:clinicId", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByClinic(req.params.clinicId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sessions/clinic/:clinicId/today", async (req, res) => {
    try {
      const sessions = await storage.getTodaysSessionsByClinic(req.params.clinicId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/sessions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const session = await storage.updateSession(req.params.id, updates);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Claim routes
  app.get("/api/claims", async (req, res) => {
    try {
      const claims = await storage.getAllClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/claims/pending", async (req, res) => {
    try {
      const claims = await storage.getPendingClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/claims/child/:childId", async (req, res) => {
    try {
      const claims = await storage.getClaimsByChild(req.params.childId);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/claims", async (req, res) => {
    try {
      const claimData = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(claimData);
      res.status(201).json(claim);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/claims/:id", async (req, res) => {
    try {
      const updates = req.body;
      const claim = await storage.updateClaim(req.params.id, updates);
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      res.json(claim);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Document routes
  app.get("/api/documents/child/:childId", async (req, res) => {
    try {
      const documents = await storage.getDocumentsByChild(req.params.childId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const success = await storage.deleteDocument(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat API - REMOVED since Supabase authentication is no longer used, and OpenAI is not configured.
  // If chatbot functionality is desired, this section will need to be re-added and configured separately.

  const httpServer = createServer(app);
  return httpServer;
}
