import { NextResponse } from "next/server";
import { donorService } from "@/modules/donors";
import { otsService } from "@/modules/bitcoin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // In Next.js 15+ params is often a Promise depending on context, we await it
) {
  try {
    const id = (await params).id;

    // Validation : l'ID doit être un UUID valide
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const donor = await donorService.getDonorById(id);

    if (!donor) {
      return NextResponse.json({ error: "Donor not found" }, { status: 404 });
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

    return NextResponse.json({
      success: true,
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
    console.error("GET /api/v1/verify/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
