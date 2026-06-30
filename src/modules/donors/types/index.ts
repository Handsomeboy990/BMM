import { z } from "zod";
import { donorSchema, createDonorSchema } from "../schemas";

export type DonorProfile = z.infer<typeof donorSchema>;
export type CreateDonorDTO = z.infer<typeof createDonorSchema>;

export type DonorRecord = DonorProfile & {
  id: string;
  bitcoinAddress: string;
  profileHash: string;
  otsProof: string | null;
  createdAt: Date;
};
