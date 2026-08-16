import { TestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";
import { beforeAll, describe, expect, it } from "vitest";
import { DurationService } from "./duration.service";

describe("DurationService", () => {
  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserTestingModule,
      platformBrowserTesting(),
      { teardown: { destroyAfterEach: true } },
    );

    TestBed.configureTestingModule({
      providers: [DurationService],
    });
  });

  describe("DurationService.isValidDuration (falsehood)", () => {
    it("should return false for a null input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate(null)).toBeFalsy();
    });

    it("should return false for an undefined input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate(undefined)).toBeFalsy();
    });

    it("should return false for a malformed input (1).", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate("0:0")).toBeFalsy();
    });

    it("should return false for a malformed input (2).", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate("0:")).toBeFalsy();
    });
  });

  describe("DurationService.isValidDuration (truth)", () => {
    it("should return true for a full HH:MM:SS input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate("01:00:00")).toBeTruthy();
    });

    it("should return true for a MM:SS input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate("00:01")).toBeTruthy();
    });

    it("should return true for a M:SS input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate("3:00")).toBeTruthy();
    });

    it("should return true for a 00:00 input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate("00:00")).toBeTruthy();
    });

    it("should return true for an empty input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.validate("")).toBeTruthy();
    });
  });

  describe("DurationService.parse", () => {
    it("should return 00:00:00 for a null input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse(null)).toBe("00:00:00");
    });

    it("should return 00:00:00 for an undefined input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse(undefined)).toBe("00:00:00");
    });

    it("should return 00:00:00 for an empty input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse("")).toBe("00:00:00");
    });

    it("should return 00:00:00 for a 00:00 input.", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse("00:00")).toBe("00:00:00");
    });

    it("should return 00:04:33 from the input '4:33'", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse("4:33")).toBe("00:04:33");
    });

    it("should return 00:04:33 from the input '04:33'", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse("04:33")).toBe("00:04:33");
    });

    it("should return 00:00:33 from the input '33'", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse("33")).toBe("00:00:33");
    });

    it("should return 00:33:25 from the input '33:25'", () => {
      const ds = TestBed.inject(DurationService);
      expect(ds.parse("33:25")).toBe("00:33:25");
    });
  });
});
