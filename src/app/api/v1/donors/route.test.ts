import { vi, describe, it, expect } from "vitest";
import { POST } from "./route";
import { donorService } from "@/modules/donors/services/donor.service";
import { walletService, otsService } from "@/modules/bitcoin";

vi.mock("@/modules/donors/services/donor.service", () => {
  return {
    donorService: {
      createDonor: vi.fn(),
    },
  };
});

vi.mock("@/modules/donors", () => {
  const mockSchema = {
    parse: vi.fn((data) => {
      if (!data.email || !data.password) throw new Error("Validation failed");
      return data;
    }),
  };
  return {
    createDonorSchema: mockSchema,
  };
});

vi.mock("@/modules/bitcoin", () => {
  return {
    walletService: {
      verifySignature: vi.fn(),
    },
    otsService: {
      stampHash: vi.fn(),
    },
  };
});

describe("POST /api/v1/donors", () => {
  it("should successfully register a donor and return 201", async () => {
    vi.mocked(walletService.verifySignature).mockReturnValue(true);
    vi.mocked(otsService.stampHash).mockResolvedValue("ots-proof-xyz");

    const mockDonor = {
      id: "u1",
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      phoneNumber: "+221...",
      bloodType: "O-" as const,
      city: "Dakar",
      latitude: 14.5,
      longitude: -17.5,
      age: 30,
      available: true,
      bitcoinAddress: "bc1q...",
      profileHash: "hash...",
      otsProof: "ots-proof-xyz",
      createdAt: new Date("2026-06-30T12:00:00.000Z"),
    };
    vi.mocked(donorService.createDonor).mockResolvedValue(
      mockDonor as unknown as Awaited<
        ReturnType<typeof donorService.createDonor>
      >,
    );

    const body = {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      phoneNumber: "+221...",
      bloodType: "O-",
      city: "Dakar",
      latitude: 14.5,
      longitude: -17.5,
      age: 30,
      bitcoinAddress: "bc1q...",
      profileHash: "hash...",
      signature: "sig...",
      password: "password123",
    };

    const req = new Request("http://localhost/api/v1/donors", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.data).toEqual({
      ...mockDonor,
      createdAt: mockDonor.createdAt.toISOString(),
    });
    expect(walletService.verifySignature).toHaveBeenCalledWith(
      "hash...",
      "bc1q...",
      "sig...",
    );
    expect(otsService.stampHash).toHaveBeenCalledWith("hash...");
    expect(donorService.createDonor).toHaveBeenCalledWith({
      ...body,
      otsProof: "ots-proof-xyz",
    });
  });

  it("should return 400 if BIP-322 signature is invalid", async () => {
    vi.mocked(walletService.verifySignature).mockReturnValue(false);

    const body = {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      phoneNumber: "+221...",
      bloodType: "O-",
      city: "Dakar",
      latitude: 14.5,
      longitude: -17.5,
      age: 30,
      bitcoinAddress: "bc1q...",
      profileHash: "hash...",
      signature: "sig-invalid...",
      password: "password123",
    };

    const req = new Request("http://localhost/api/v1/donors", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error.code).toBe("bad_request");
  });
});
