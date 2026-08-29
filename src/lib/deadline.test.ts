import { describe, expect, it } from "vitest";

import { DeadlineExceededError, withDeadline } from "./deadline";

const later = <T>(value: T, ms: number) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

describe("withDeadline", () => {
  it("resolves with the value when the promise settles in time", async () => {
    await expect(withDeadline(later("ok", 5), 100)).resolves.toBe("ok");
  });

  it("rejects with a deadline error when the promise is too slow", async () => {
    await expect(withDeadline(later("ok", 200), 20, "Stats")).rejects.toThrow(
      DeadlineExceededError,
    );
  });

  it("propagates the original rejection rather than a deadline error", async () => {
    const boom = Promise.reject(new Error("boom"));
    await expect(withDeadline(boom, 100)).rejects.toThrow("boom");
  });

  it("names the operation in the deadline message", async () => {
    await expect(
      withDeadline(later("ok", 200), 20, "Statistiques"),
    ).rejects.toThrow(/Statistiques/);
  });
});
