import { describe, it, expect, beforeEach } from "vitest";
import { QuotaService, QuotaParams } from "./quota.service";
import { PlaylistEntry } from "../models/playlist-entry";

describe("QuotaService", () => {
  let service: QuotaService;
  let mockEntries: PlaylistEntry[];

  beforeEach(() => {
    service = new QuotaService();

    // Create a balanced mock playlist of 10 entries for predictable percentage calculation
    mockEntries = [
      { local: true, australian: true, female: true },
      { local: true, australian: true, female: false },
      { local: true, australian: false, female: false },
      { local: false, australian: true, female: true },
      { local: false, australian: true, female: false },
      { local: false, australian: false, female: true },
      { local: false, australian: false, female: false },
      { local: false, australian: false, female: false },
      { local: false, australian: false, female: false },
      { local: false, australian: false, female: false },
    ] as PlaylistEntry[];
    // Note: 3 Local, 4 Australian, 3 Female
  });

  describe("getLocalQuota", () => {
    it("should return meets true when count is exactly equal to the required rounded quota", () => {
      const params: QuotaParams = {
        localQuota: 30, // 30% of 10 = 3 items needed
        australianQuota: undefined,
        femaleQuota: undefined,
      };

      const result = service.getLocalQuota(params, mockEntries);

      expect(result).toEqual({
        count: 3,
        quota: 3,
        meets: true,
      });
    });

    it("should return meets true when count exceeds the required quota", () => {
      const params: QuotaParams = {
        localQuota: 10, // 10% of 10 = 1 item needed
        australianQuota: undefined,
        femaleQuota: undefined,
      };

      const result = service.getLocalQuota(params, mockEntries);

      expect(result.meets).toBe(true);
      expect(result.count).toBe(3);
      expect(result.quota).toBe(1);
    });

    it("should return meets false when count is below the required quota", () => {
      const params: QuotaParams = {
        localQuota: 50, // 50% of 10 = 5 items needed
        australianQuota: undefined,
        femaleQuota: undefined,
      };

      const result = service.getLocalQuota(params, mockEntries);

      expect(result.meets).toBe(false);
      expect(result.quota).toBe(5);
    });

    it("should default quota to 0 and pass if parameter is undefined", () => {
      const params: QuotaParams = {
        localQuota: undefined,
        australianQuota: undefined,
        femaleQuota: undefined,
      };

      const result = service.getLocalQuota(params, mockEntries);

      expect(result).toEqual({
        count: 3,
        quota: 0,
        meets: true,
      });
    });
  });

  describe("getAustralianQuota", () => {
    it("should successfully calculate and evaluate Australian quotas", () => {
      const params: QuotaParams = {
        localQuota: undefined,
        australianQuota: 40, // 40% of 10 = 4 items needed
        femaleQuota: undefined,
      };

      const result = service.getAustralianQuota(params, mockEntries);

      expect(result).toEqual({
        count: 4,
        quota: 4,
        meets: true,
      });
    });
  });

  describe("getFemaleQuota", () => {
    it("should successfully calculate and evaluate Female quotas", () => {
      const params: QuotaParams = {
        localQuota: undefined,
        australianQuota: undefined,
        femaleQuota: 40, // 40% of 10 = 4 items needed (we only have 3)
      };

      const result = service.getFemaleQuota(params, mockEntries);

      expect(result.meets).toBe(false);
      expect(result.count).toBe(3);
      expect(result.quota).toBe(4);
    });
  });

  describe("Edge Cases and Rounding", () => {
    it("should handle empty playlist gracefully", () => {
      const params: QuotaParams = {
        localQuota: 50,
        australianQuota: 50,
        femaleQuota: 50,
      };

      const result = service.getLocalQuota(params, []);

      expect(result).toEqual({
        count: 0,
        quota: 0,
        meets: true,
      });
    });

    it("should round the quota target to the nearest integer correctly", () => {
      // 3 items in playlist
      const shortEntries = [
        { local: true },
        { local: false },
        { local: false },
      ] as PlaylistEntry[];

      const params: QuotaParams = {
        localQuota: 25, // 25% of 3 = 0.75 -> Should round up to 1
        australianQuota: undefined,
        femaleQuota: undefined,
      };

      const result = service.getLocalQuota(params, shortEntries);

      expect(result.quota).toBe(1);
      expect(result.meets).toBe(true); // count (1) >= quota (1)
    });

    it("should round down the quota target when floating point is under 0.5", () => {
      // 3 items in playlist
      const shortEntries = [
        { local: true },
        { local: false },
        { local: false },
      ] as PlaylistEntry[];

      const params: QuotaParams = {
        localQuota: 10, // 10% of 3 = 0.3 -> Should round down to 0
        australianQuota: undefined,
        femaleQuota: undefined,
      };

      const result = service.getLocalQuota(params, shortEntries);

      expect(result.quota).toBe(0);
      expect(result.meets).toBe(true);
    });
  });

  describe("Null and Undefined Input Handling", () => {
    it("should handle null or undefined parameters gracefully", () => {
      // @ts-expect-error - Testing runtime JavaScript resilience against types
      const resultNull = service.getLocalQuota(null, mockEntries);
      // @ts-expect-error - Testing runtime JavaScript resilience against types
      const resultUndefined = service.getLocalQuota(undefined, mockEntries);

      expect(resultNull).toEqual({ count: 3, quota: 0, meets: true });
      expect(resultUndefined).toEqual({ count: 3, quota: 0, meets: true });
    });

    it("should handle null or undefined playlist arrays gracefully", () => {
      const params: QuotaParams = {
        localQuota: 50,
        australianQuota: 0,
        femaleQuota: 0,
      };

      // @ts-expect-error - Testing runtime JavaScript resilience against types
      const resultNull = service.getLocalQuota(params, null);
      // @ts-expect-error - Testing runtime JavaScript resilience against types
      const resultUndefined = service.getLocalQuota(params, undefined);

      expect(resultNull).toEqual({ count: 0, quota: 0, meets: true });
      expect(resultUndefined).toEqual({ count: 0, quota: 0, meets: true });
    });

    it("should handle malformed or null objects inside the entries array", () => {
      const params: QuotaParams = {
        localQuota: 50,
        australianQuota: 0,
        femaleQuota: 0,
      };
      const malformedEntries = [
        { local: true },
        null,
        undefined,
        { local: false },
      ] as PlaylistEntry[];

      // 1 valid local item out of 4 total array elements = 25%
      // 50% target of 4 items = 2 required items
      const result = service.getLocalQuota(params, malformedEntries);

      expect(result).toEqual({
        count: 1,
        quota: 2,
        meets: false, // 1 item does not meet the quota of 2
      });
    });
  });
});
