import { beforeEach, describe, expect, it } from "vitest";
import { SortService } from "./sort.service"; // Adjust the import path as needed

describe("SortService", () => {
  let service: SortService;
  const allowedColumns = ["id", "name", "createdAt"];

  beforeEach(() => {
    service = new SortService();
  });

  describe("isValid", () => {
    it("should return true for an exact match with an allowed column", () => {
      expect(service.isValid("name", allowedColumns)).toBe(true);
    });

    it("should return true for a valid column prefixed with '-'", () => {
      expect(service.isValid("-name", allowedColumns)).toBe(true);
    });

    it("should return false if the column is not in the allowed list", () => {
      expect(service.isValid("invalidColumn", allowedColumns)).toBe(false);
    });

    it("should return false if a column prefixed with '-' is not in the allowed list", () => {
      expect(service.isValid("-invalidColumn", allowedColumns)).toBe(false);
    });

    it("should return false for an empty string input", () => {
      expect(service.isValid("", allowedColumns)).toBe(false);
    });
  });

  describe("getDirection", () => {
    it("should return 'asc' when there is no '-' prefix", () => {
      expect(service.getDirection("name")).toBe("asc");
    });

    it("should return 'desc' when the input starts with '-'", () => {
      expect(service.getDirection("-name")).toBe("desc");
    });

    it("should return 'asc' if '-' is in the middle of the string", () => {
      expect(service.getDirection("user-name")).toBe("asc");
    });
  });

  describe("getColumnId", () => {
    it("should return the original string if it does not start with '-'", () => {
      expect(service.getColumnId("name")).toBe("name");
    });

    it("should strip the leading '-' and return the clean column ID", () => {
      expect(service.getColumnId("-name")).toBe("name");
    });

    it("should preserve dashes that are not at the start of the string", () => {
      expect(service.getColumnId("user-name")).toBe("user-name");
    });
  });
});
