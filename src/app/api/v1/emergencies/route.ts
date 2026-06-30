import { createEmergencySchema, emergencyService } from "@/modules/emergencies";
import { handleApiError, success } from "@/lib/api/response";

/**
 * POST /api/v1/emergencies
 * Déclare une nouvelle alerte de manque de sang
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation Zod : lève une ZodError interceptée par handleApiError
    const validatedData = createEmergencySchema.parse(body);

    // TODO(security): Valider que le hospitalId correspond au token de session de l'utilisateur authentifié

    const emergency = await emergencyService.createEmergency(validatedData);

    return success(emergency, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/v1/emergencies
 * Récupère les alertes d'urgence (toutes les actives ou filtrées par hospitalId)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    let emergencies;

    if (hospitalId) {
      // TODO(security): Valider que le hospitalId correspond à l'organisation de l'utilisateur authentifié
      emergencies = await emergencyService.getHospitalEmergencies(hospitalId);
    } else {
      emergencies = await emergencyService.getAllActiveEmergencies();
    }

    return success(emergencies);
  } catch (error) {
    return handleApiError(error);
  }
}
