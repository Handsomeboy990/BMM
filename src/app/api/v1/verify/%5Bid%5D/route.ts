import { donorService } from "@/modules/donors";
import { otsService, breezService, rewardService } from "@/modules/bitcoin";
import { authService } from "@/modules/auth";
import { API_ERROR_CODE } from "@/lib/api/errors";
import { handleApiError, success, failure } from "@/lib/api/response";
import { z } from "zod";

const rewardPayloadSchema = z.object({
  bolt11Invoice: z.string().min(10, "La facture BOLT11 est invalide"),
  satsAmount: z
    .number()
    .min(1, "Le montant doit être supérieur à 0")
    .optional(),
});

/**
 * GET /api/v1/verify/[id]
 * Récupère le statut de vérification publique d'un donneur (blockchain OpenTimestamps)
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    // Validation : l'ID doit être un UUID valide
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return failure(API_ERROR_CODE.BAD_REQUEST, "Format d'ID invalide", {
        status: 400,
      });
    }

    const donor = await donorService.getDonorById(id);
    if (!donor) {
      return failure(API_ERROR_CODE.NOT_FOUND, "Donneur introuvable", {
        status: 404,
      });
    }

    // Vérification de la preuve d'horodatage si elle existe
    let isTimestampVerified = false;
    let verificationDetails = null;

    if (donor.otsProof) {
      const verifyResult = (await otsService.verifyTimestamp(
        donor.profileHash,
        donor.otsProof,
      )) as { bitcoin?: { height: number; timestamp: number } } | null;

      if (verifyResult && verifyResult.bitcoin) {
        isTimestampVerified = true;
        verificationDetails = {
          height: verifyResult.bitcoin.height,
          timestamp: verifyResult.bitcoin.timestamp,
        };
      }
    }

    return success({
      donor: {
        id: donor.id,
        bloodType: donor.bloodType,
        bitcoinAddress: donor.bitcoinAddress,
        profileHash: donor.profileHash,
        hasOtsProof: !!donor.otsProof,
        createdAt: donor.createdAt,
      },
      verification: {
        isTimestampVerified,
        details: verificationDetails,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/verify/[id]
 * Attribue une récompense en Satoshis (via Breez Liquid / Lightning Network)
 * à un donneur suite à la validation physique de son don.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Authentification & Autorisation (Seuls les hôpitaux/administrateurs connectés peuvent récompenser)
    const user = await authService.getCurrentUser();
    if (!user || !user.organizationId) {
      return failure(
        API_ERROR_CODE.FORBIDDEN,
        "Accès refusé. L'utilisateur n'est associé à aucune organisation.",
        { status: 403 },
      );
    }

    const id = (await params).id;

    // Validation du format UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return failure(API_ERROR_CODE.BAD_REQUEST, "Format d'ID invalide", {
        status: 400,
      });
    }

    // 2. Vérification que le donneur existe
    const donor = await donorService.getDonorById(id);
    if (!donor) {
      return failure(API_ERROR_CODE.NOT_FOUND, "Donneur introuvable", {
        status: 404,
      });
    }

    // 3. Validation de la facture BOLT11
    const body = await req.json();
    const validatedData = rewardPayloadSchema.parse(body);
    const satsAmount = validatedData.satsAmount || 1000;

    // 4. Initialisation d'une trace de paiement en statut 'pending'
    const rewardLog = await rewardService.createRewardLog({
      donorId: id,
      hospitalId: user.organizationId,
      satsAmount,
      bolt11Invoice: validatedData.bolt11Invoice,
    });

    try {
      // 5. Exécution du paiement Lightning via Breez
      const payoutResult = await breezService.payInvoice(
        validatedData.bolt11Invoice,
      );

      if (!payoutResult || !payoutResult.paymentHash) {
        throw new Error("Paiement échoué. Aucun hash de transaction retourné.");
      }

      // 6. Mise à jour de la trace en succès
      const updatedLog = await rewardService.updateRewardStatus(
        rewardLog.id,
        "completed",
        payoutResult.paymentHash,
      );

      return success({
        message: "Récompense envoyée avec succès.",
        reward: updatedLog,
      });
    } catch (paymentError) {
      const errorMsg =
        paymentError instanceof Error
          ? paymentError.message
          : "Échec de la transaction Lightning";

      // Enregistrement de l'échec en base pour l'audit
      const failedLog = await rewardService.updateRewardStatus(
        rewardLog.id,
        "failed",
        undefined,
        errorMsg,
      );

      return failure(
        API_ERROR_CODE.INTERNAL_ERROR,
        `Échec du paiement Lightning: ${errorMsg}`,
        {
          status: 500,
          details: { reward: failedLog },
        },
      );
    }
  } catch (error) {
    return handleApiError(error);
  }
}
