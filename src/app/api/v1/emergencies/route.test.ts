import { vi, describe, it, expect } from "vitest";
import { POST, GET } from "./route";
import { emergencyService, type EmergencyRecord } from "@/modules/emergencies";

vi.mock("@/modules/emergencies", () => {
  const mockSchema = {
    parse: vi.fn((data) => {
      if (!data.bloodType) throw new Error("Validation failed");
      return data;
    }),
  };
  return {
    createEmergencySchema: mockSchema,
    emergencyService: {
      createEmergency: vi.fn(),
      getHospitalEmergencies: vi.fn(),
      getAllActiveEmergencies: vi.fn(),
    },
  };
});

describe("POST /api/v1/emergencies", () => {
  it("should return 201 and the created emergency on success", async () => {
    const mockEmergency: EmergencyRecord = {
      id: "e1-uuid",
      hospitalId: "h1-uuid",
      bloodType: "O-",
      quantityNeeded: 2,
      city: "Dakar",
      latitude: 14.7167,
      longitude: -17.4677,
      status: "active",
      createdAt: new Date("2026-06-30T12:00:00.000Z"),
    };
    vi.mocked(emergencyService.createEmergency).mockResolvedValue(
      mockEmergency,
    );

    const body = {
      hospitalId: "h1-uuid",
      bloodType: "O-",
      quantityNeeded: 2,
      city: "Dakar",
      latitude: 14.7167,
      longitude: -17.4677,
    };

    const req = new Request("http://localhost/api/v1/emergencies", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.data).toEqual({
      ...mockEmergency,
      createdAt: mockEmergency.createdAt.toISOString(),
    });
    expect(emergencyService.createEmergency).toHaveBeenCalledWith(body);
  });

  it("should return 422 or 500 when validation fails", async () => {
    const req = new Request("http://localhost/api/v1/emergencies", {
      method: "POST",
      body: JSON.stringify({}), // Empty body fails validation
    });

    const response = await POST(req);
    expect(response.status).toBe(500); // Because we threw generic error in mock
  });
});

describe("GET /api/v1/emergencies", () => {
  it("should fetch all active emergencies when no hospitalId is provided", async () => {
    const mockEmergencies: EmergencyRecord[] = [
      {
        id: "e1",
        hospitalId: "h1",
        bloodType: "O-",
        quantityNeeded: 1,
        city: "Dakar",
        latitude: 14.7167,
        longitude: -17.4677,
        status: "active",
        createdAt: new Date("2026-06-30T12:00:00.000Z"),
      },
    ];
    vi.mocked(emergencyService.getAllActiveEmergencies).mockResolvedValue(
      mockEmergencies,
    );

    const req = new Request("http://localhost/api/v1/emergencies");
    const response = await GET(req);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual([
      {
        ...mockEmergencies[0],
        createdAt: mockEmergencies[0].createdAt.toISOString(),
      },
    ]);
    expect(emergencyService.getAllActiveEmergencies).toHaveBeenCalled();
  });

  it("should fetch hospital emergencies when hospitalId is provided", async () => {
    const mockEmergencies: EmergencyRecord[] = [
      {
        id: "e1",
        hospitalId: "h1",
        bloodType: "O-",
        quantityNeeded: 1,
        city: "Dakar",
        latitude: 14.7167,
        longitude: -17.4677,
        status: "active",
        createdAt: new Date("2026-06-30T12:00:00.000Z"),
      },
    ];
    vi.mocked(emergencyService.getHospitalEmergencies).mockResolvedValue(
      mockEmergencies,
    );

    const req = new Request(
      "http://localhost/api/v1/emergencies?hospitalId=h1",
    );
    const response = await GET(req);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual([
      {
        ...mockEmergencies[0],
        createdAt: mockEmergencies[0].createdAt.toISOString(),
      },
    ]);
    expect(emergencyService.getHospitalEmergencies).toHaveBeenCalledWith("h1");
  });
});
