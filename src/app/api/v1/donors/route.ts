import { NextResponse } from "next/server";
import { createDonorSchema } from "@/modules/donors";
import { donorService } from "@/modules/donors/services/donor.service";
import { walletService, otsService } from "@/modules/bitcoin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation des données avec Zod
    const validatedData = createDonorSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validatedData.data;

    // Vérification cryptographique de la signature BIP-322
    const isValidSignature = walletService.verifySignature(
      data.profileHash,
      data.bitcoinAddress,
      data.signature,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid cryptographic signature" },
        { status: 400 },
      );
    }

    // Horodatage du profil sur Bitcoin via OpenTimestamps
    let otsProof = null;
    try {
      otsProof = await otsService.stampHash(data.profileHash);
    } catch (e) {
      console.error(
        "OTS Stamping failed, proceeding without it or handle appropriately:",
        e,
      );
      // Dans le cadre du hackathon, si les serveurs OTS sont lents/indisponibles,
      // on peut soit rejeter, soit accepter sans preuve (ou la générer asynchrone).
      // Ici on accepte avec un log d'erreur.
    }

    // Enregistrement dans la base de données
    const newDonor = await donorService.createDonor({ ...data, otsProof });

    return NextResponse.json(
      { success: true, donor: newDonor },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/v1/donors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
