import { TestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";
import { beforeAll, describe, expect, it } from "vitest";
import { DateService } from "./date.service";

describe("DateService", () => {
  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserTestingModule,
      platformBrowserTesting(),
      { teardown: { destroyAfterEach: true } },
    );

    TestBed.configureTestingModule({
      providers: [DateService],
    });
  });

  it("should return an empty string for a null input.", () => {
    const ds = TestBed.inject(DateService);
    expect(ds.getDisplayDate(null)).toBe("");
  });

  it("should return an empty string for an undefined input.", () => {
    const ds = TestBed.inject(DateService);
    expect(ds.getDisplayDate(undefined)).toBe("");
  });
});
