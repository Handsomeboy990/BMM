import { vi, describe, it, expect } from "vitest";
import { GET, PATCH, DELETE } from "./route";
import { emergencyService, type EmergencyRecord } from "@/modules/emergencies";

vi.mock("@/modules/emergencies", () => {
  const mockSchema = {
    parse: vi.fn((data) => data),
  };
  return {
    updateEmergencyStatusSchema: mockSchema,
    emergencyService: {
      getEmergencyById: vi.fn(),
      updateEmergencyStatus: vi.fn(),
      deleteEmergency: vi.fn(),
    },
  };
});

const VALID_UUID = "d3b07384-d113-4632-a5e2-123456789abc";
const INVALID_UUID = "invalid-uuid-format";

describe("GET /api/v1/emergencies/[id]", () => {
  it("should return 200 and the emergency if found", async () => {
    const mockEmergency: EmergencyRecord = {
      id: VALID_UUID,
      hospitalId: "h1",
      bloodType: "O-",
      quantityNeeded: 1,
      city: "Dakar",
      latitude: 14.7167,
      longitude: -17.4677,
      status: "active",
      createdAt: new Date("2026-06-30T12:00:00.000Z"),
    };
    vi.mocked(emergencyService.getEmergencyById).mockResolvedValue(
      mockEmergency,
    );

    const req = new Request(
      `http://localhost/api/v1/emergencies/${VALID_UUID}`,
    );
    const response = await GET(req, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual({
      ...mockEmergency,
      createdAt: mockEmergency.createdAt.toISOString(),
    });
    expect(emergencyService.getEmergencyById).toHaveBeenCalledWith(VALID_UUID);
  });

  it("should return 400 when UUID format is invalid", async () => {
    const req = new Request(
      `http://localhost/api/v1/emergencies/${INVALID_UUID}`,
    );
    const response = await GET(req, {
      params: Promise.resolve({ id: INVALID_UUID }),
    });

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error.code).toBe("bad_request");
  });

  it("should return 404 when emergency does not exist", async () => {
    vi.mocked(emergencyService.getEmergencyById).mockResolvedValue(null);

    const req = new Request(
      `http://localhost/api/v1/emergencies/${VALID_UUID}`,
    );
    const response = await GET(req, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error.code).toBe("not_found");
  });
});

describe("PATCH /api/v1/emergencies/[id]", () => {
  it("should successfully update emergency status", async () => {
    const mockEmergency: EmergencyRecord = {
      id: VALID_UUID,
      hospitalId: "h1",
      bloodType: "O-",
      quantityNeeded: 1,
      city: "Dakar",
      latitude: 14.7167,
      longitude: -17.4677,
      status: "active",
      createdAt: new Date("2026-06-30T12:00:00.000Z"),
    };
    const mockUpdated: EmergencyRecord = {
      id: VALID_UUID,
      hospitalId: "h1",
      bloodType: "O-",
      quantityNeeded: 1,
      city: "Dakar",
      latitude: 14.7167,
      longitude: -17.4677,
      status: "resolved",
      createdAt: new Date("2026-06-30T12:00:00.000Z"),
    };

    vi.mocked(emergencyService.getEmergencyById).mockResolvedValue(
      mockEmergency,
    );
    vi.mocked(emergencyService.updateEmergencyStatus).mockResolvedValue(
      mockUpdated,
    );

    const req = new Request(
      `http://localhost/api/v1/emergencies/${VALID_UUID}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status: "resolved" }),
      },
    );

    const response = await PATCH(req, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual({
      ...mockUpdated,
      createdAt: mockUpdated.createdAt.toISOString(),
    });
    expect(emergencyService.updateEmergencyStatus).toHaveBeenCalledWith(
      VALID_UUID,
      "resolved",
    );
  });
});

describe("DELETE /api/v1/emergencies/[id]", () => {
  it("should successfully delete an emergency", async () => {
    const mockEmergency: EmergencyRecord = {
      id: VALID_UUID,
      hospitalId: "h1",
      bloodType: "O-",
      quantityNeeded: 1,
      city: "Dakar",
      latitude: 14.7167,
      longitude: -17.4677,
      status: "active",
      createdAt: new Date("2026-06-30T12:00:00.000Z"),
    };
    vi.mocked(emergencyService.getEmergencyById).mockResolvedValue(
      mockEmergency,
    );
    vi.mocked(emergencyService.deleteEmergency).mockResolvedValue(true);

    const req = new Request(
      `http://localhost/api/v1/emergencies/${VALID_UUID}`,
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(req, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual({ success: true });
    expect(emergencyService.deleteEmergency).toHaveBeenCalledWith(VALID_UUID);
  });
});
