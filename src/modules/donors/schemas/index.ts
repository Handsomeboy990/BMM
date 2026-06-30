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
  firstName: z.string().min(1, "Le prénom est requis").max(255),
  lastName: z.string().min(1, "Le nom est requis").max(255),
  email: z.string().email("Adresse email invalide"),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis").max(50),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128),
  bitcoinAddress: z.string().min(1).max(255),
  profileHash: z.string().length(64),
  signature: z.string().min(1),
});

export const donorProfileBaseSchema = donorSchema;
