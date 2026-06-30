import { createCampaignSchema, campaignService } from "@/modules/campaigns";
import { authService } from "@/modules/auth";
import { API_ERROR_CODE } from "@/lib/api/errors";
import { handleApiError, success, failure } from "@/lib/api/response";

/**
 * POST /api/v1/campaigns
 * Lance une nouvelle campagne de don
 */
export async function POST(req: Request) {
  try {
    const user = await authService.getCurrentUser();
    if (!user || !user.organizationId) {
      return failure(
        API_ERROR_CODE.FORBIDDEN,
        "Accès refusé. L'utilisateur n'est associé à aucune organisation.",
        { status: 403 },
      );
    }

    const body = await req.json();

    // Sécurité: Forcer l'injection du hospitalId de la session de confiance
    body.hospitalId = user.organizationId;

    const validatedData = createCampaignSchema.parse(body);
    const campaign = await campaignService.createCampaign(validatedData);

    return success(campaign, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/v1/campaigns
 * Récupère les campagnes associées à l'hôpital de l'utilisateur connecté
 */
export async function GET(req: Request) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return failure(API_ERROR_CODE.UNAUTHORIZED, "Authentification requise.", {
        status: 401,
      });
    }

    // Le super admin peut spécifier un hospitalId en paramètre, l'admin d'organisation est restreint à la sienne
    const targetHospitalId =
      user.role === "super_admin"
        ? new URL(req.url).searchParams.get("hospitalId") || user.organizationId
        : user.organizationId;

    if (!targetHospitalId) {
      return failure(
        API_ERROR_CODE.BAD_REQUEST,
        "hospitalId manquant ou l'utilisateur n'est associé à aucune organisation.",
        { status: 400 },
      );
    }

    const campaigns =
      await campaignService.getHospitalCampaigns(targetHospitalId);

    return success(campaigns);
  } catch (error) {
    return handleApiError(error);
  }
}
