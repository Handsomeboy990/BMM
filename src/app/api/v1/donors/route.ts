import { createDonorSchema } from "@/modules/donors";
import { donorService } from "@/modules/donors/services/donor.service";
import { walletService, otsService } from "@/modules/bitcoin";
import { API_ERROR_CODE } from "@/lib/api/errors";
import { handleApiError, success, failure } from "@/lib/api/response";

/**
 * POST /api/v1/donors
 * Inscrit un nouveau donneur avec son identité nominative, ses identifiants d'accès
 * et ses preuves cryptographiques Bitcoin (signature BIP-322 & horodatage OTS).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation des données avec Zod
    const validatedData = createDonorSchema.parse(body);

    // Vérification cryptographique de la signature BIP-322
    const isValidSignature = walletService.verifySignature(
      validatedData.profileHash,
      validatedData.bitcoinAddress,
      validatedData.signature,
    );

    if (!isValidSignature) {
      return failure(
        API_ERROR_CODE.BAD_REQUEST,
        "La signature cryptographique BIP-322 est invalide.",
        { status: 400 },
      );
    }

    // Horodatage du profil sur Bitcoin via OpenTimestamps
    let otsProof = null;
    try {
      otsProof = await otsService.stampHash(validatedData.profileHash);
    } catch (e) {
      console.error(
        "L'horodatage OpenTimestamps a échoué. Poursuite de la création sans preuve.",
        e,
      );
    }

    // Enregistrement dans la base de données (Supabase Auth + Table donors)
    const newDonor = await donorService.createDonor({
      ...validatedData,
      otsProof,
    });

    return success(newDonor, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
