import { DonorRecord } from "../../donors";

const compatibility: Record<string, string[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Rayon de la terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type MatchingResult = DonorRecord & { distanceKm: number };

export const matchingService = {
  /**
   * Trouve les donneurs compatibles les plus proches
   */
  findMatchingDonors: (
    requestedType: string,
    lat: number,
    lon: number,
    donors: DonorRecord[],
  ): MatchingResult[] => {
    const compatibleTypes = compatibility[requestedType] || [];

    return donors
      .filter((d) => compatibleTypes.includes(d.bloodType) && d.available)
      .map((d) => ({
        ...d,
        distanceKm: haversineDistance(lat, lon, d.latitude, d.longitude),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 10);
  },
};
