import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChildSchema, insertIntakeFormSchema, insertSessionSchema, insertClaimSchema, insertDocumentSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Get user from local database to find their email
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For development: Try Supabase Auth first, but fall back to password comparison if email not confirmed
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });

      // If Supabase auth succeeds, use it
      if (authData?.user && !authError) {
        console.log("✅ User authenticated via Supabase Auth:", user.username);
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword });
      }

      // If Supabase auth fails due to email not confirmed, fall back to password comparison
      if (authError?.code === 'email_not_confirmed') {
        console.log("📧 Email not confirmed, falling back to password comparison for development");
        if (user.password === password) {
          console.log("✅ User authenticated via password fallback:", user.username);
          const { password: _, ...userWithoutPassword } = user;
          return res.json({ user: userWithoutPassword });
        }
      }

      // For any other Supabase auth error, reject
      console.log("❌ Authentication failed:", authError);
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
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

  // Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const response = completion.choices[0].message.content;
      res.json({ content: response });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
