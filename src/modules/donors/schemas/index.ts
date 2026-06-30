import { z } from "zod";

export const donorSchema = z.object({
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  city: z.string().min(1).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  age: z.number().min(18).max(120),
  available: z.boolean().default(true),
});

export const createDonorSchema = donorSchema.extend({
  bitcoinAddress: z.string().min(1).max(255),
  profileHash: z.string().length(64),
  signature: z.string().min(1),
});

export const donorProfileBaseSchema = donorSchema;
