import { z } from "zod";
import { loginSchema, signUpSchema } from "../schemas";

export type LoginDTO = z.infer<typeof loginSchema>;
export type SignUpDTO = z.infer<typeof signUpSchema>;

export type UserProfile = {
  id: string;
  email: string | undefined;
  role: "super_admin" | "org_admin";
  organizationId: string | null;
  organization?: {
    id: string;
    name: string;
    type: "hospital" | "ong" | "collect";
    latitude: number;
    longitude: number;
    city: string;
    contactEmail: string;
    verified: boolean;
    createdAt: Date;
  } | null;
};
