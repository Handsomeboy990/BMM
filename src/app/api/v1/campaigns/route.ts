import { NextResponse } from "next/server";
import { createCampaignSchema, campaignService } from "@/modules/campaigns";

// POST: Lancer une nouvelle campagne
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = createCampaignSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const campaign = await campaignService.createCampaign(validatedData.data);

    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/campaigns error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// GET: Récupérer les campagnes pour un dashboard (via query param hospitalId pour le hackathon)
// En prod, le hospitalId viendrait du token d'auth du user (Supabase Auth).
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json(
        { error: "hospitalId is required" },
        { status: 400 },
      );
    }

    const campaigns = await campaignService.getHospitalCampaigns(hospitalId);

    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("GET /api/v1/campaigns error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
