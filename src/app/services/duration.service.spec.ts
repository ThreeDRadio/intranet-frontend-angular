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

  // Falsehood
  it("should return false for a null input.", () => {
    const ds = TestBed.inject(DurationService);
    expect(ds.isValidDuration(null)).toBeFalsy();
  });

  it("should return false for an undefined input.", () => {
    const ds = TestBed.inject(DurationService);
    expect(ds.isValidDuration(undefined)).toBeFalsy();
  });

  it("should return false for a malformed input (1).", () => {
    const ds = TestBed.inject(DurationService);
    expect(ds.isValidDuration("0:0")).toBeFalsy();
  });

  it("should return false for a malformed input (2).", () => {
    const ds = TestBed.inject(DurationService);
    expect(ds.isValidDuration("0:")).toBeFalsy();
  });

  // Truth
  it("should return true for a full HH:MM:SS input.", () => {
    const ds = TestBed.inject(DurationService);
    expect(ds.isValidDuration("01:00:00")).toBeTruthy();
  });

  it("should return true for a MM:SS input.", () => {
    const ds = TestBed.inject(DurationService);
    expect(ds.isValidDuration("00:01")).toBeTruthy();
  });

  it("should return true for a M:SS input.", () => {
    const ds = TestBed.inject(DurationService);
    expect(ds.isValidDuration("3:00")).toBeTruthy();
  });
});
