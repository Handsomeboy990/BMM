import { handleApiError, success } from "@/lib/api/response";
import { statisticsService } from "@/modules/statistics";

/**
 * GET /api/v1/public/stats
 * Agrégats publics affichés sur la page d'accueil: nombre de donneurs
 * validés, structures partenaires, villes couvertes, campagnes et urgences
 * en cours, et niveau des réserves par groupe sanguin.
 *
 * Aucune donnée nominative n'est exposée. Réponse mise en cache brièvement:
 * la page d'accueil est très visitée et ces chiffres bougent lentement.
 */
export async function GET() {
  try {
    const stats = await statisticsService.getPublicStatistics();

    return success(stats, {
      meta: { generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
