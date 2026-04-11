import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const vitals = pgTable("vitals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  heartRate: numeric("heart_rate"),
  spo2: numeric("spo2"),
  temperature: numeric("temperature"),
  fall: boolean("fall").default(false),
  timestamp: timestamp("timestamp").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVitalsSchema = z.object({
  heartRate: z.number().optional(),
  spo2: z.number().optional(),
  temperature: z.number().optional(),
  fall: z.boolean().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Vital = typeof vitals.$inferSelect;
export type InsertVital = z.infer<typeof insertVitalsSchema>;
