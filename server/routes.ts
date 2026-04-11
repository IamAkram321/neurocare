import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVitalsSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Arduino data endpoint - receives sensor readings
  app.post("/data", async (req, res) => {
    try {
      const { heartRate, spo2, temperature, fall } = req.body;

      // Validate using Zod schema
      const validated = insertVitalsSchema.parse({
        heartRate: heartRate ? parseFloat(heartRate) : undefined,
        spo2: spo2 ? parseFloat(spo2) : undefined,
        temperature: temperature ? parseFloat(temperature) : undefined,
        fall: fall === true || fall === "true",
      });

      // Save to storage
      const vital = await storage.addVital(validated);

      res.json({ success: true, id: vital.id });
    } catch (error: any) {
      console.error("Error saving vital:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get latest vitals
  app.get("/api/vitals", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const vitals = await storage.getLatestVitals(limit);
      res.json(vitals);
    } catch (error: any) {
      console.error("Error fetching vitals:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
