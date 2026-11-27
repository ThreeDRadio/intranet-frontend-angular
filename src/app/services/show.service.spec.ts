import "@angular/compiler";
import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { Show } from "../models/show";
import { ShowService } from "./show.service";
import { TestBed } from "@angular/core/testing";
import { ShowApi } from "./show-api";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";

const createMockShow = (overrides: Partial<Show> = {}): Show => {
  const show = new Show();
  return Object.assign(show, {
    id: 1,
    name: "Default Show",
    startTime: "09:00",
    endTime: "11:00",
    defaultHost: "Alice",
    active: true,
    playlists: "/api/shows/1/playlists",
    topartists: "/api/shows/1/topartists",
    statistics: "/api/shows/1/statistics",
    customQuotas: false,
    femaleQuota: null,
    localQuota: null,
    australianQuota: null,
    ...overrides,
  });
};

describe("ShowService", () => {
  let showService: ShowService;

  const mockShows: Show[] = [
    createMockShow({ id: 1, name: "The Morning Show", defaultHost: "Alice" }),
    createMockShow({ id: 2, name: "Morning Briefing", defaultHost: "Bob" }),
    createMockShow({ id: 3, name: "Late Night", defaultHost: "" }),
    createMockShow({
      id: 4,
      name: "Good Morning World",
      defaultHost: "Charlie",
    }),
  ];

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserTestingModule,
      platformBrowserTesting(),
      { teardown: { destroyAfterEach: true } },
    );

    TestBed.configureTestingModule({
      providers: [ShowService, { provide: ShowApi, useValue: {} }],
    });
    showService = TestBed.inject(ShowService);
  });

  describe("filter", () => {
    it("returns all shows when input is an empty string", () => {
      const result = showService.filter("", mockShows);
      expect(result).toEqual(mockShows);
    });

    it("returns all shows when input is not a string (runtime safety)", () => {
      // @ts-expect-error testing invalid runtime input
      expect(showService.filter(null, mockShows)).toEqual(mockShows);
      // @ts-expect-error testing invalid runtime input
      expect(showService.filter(undefined, mockShows)).toEqual(mockShows);
      // @ts-expect-error testing invalid runtime input
      expect(showService.filter(123, mockShows)).toEqual(mockShows);
    });

    it("prioritises shows that start with the query over shows that merely include it", () => {
      const result = showService.filter("morning", mockShows);

      expect(result).toEqual([
        createMockShow({ id: 2, name: "Morning Briefing", defaultHost: "Bob" }),
        createMockShow({
          id: 1,
          name: "The Morning Show",
          defaultHost: "Alice",
        }),
        createMockShow({
          id: 4,
          name: "Good Morning World",
          defaultHost: "Charlie",
        }),
      ]);
    });

    it("performs case-insensitive matching", () => {
      const result = showService.filter("MORNING", mockShows);
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Morning Briefing");
    });

    it("returns an empty array when no shows match", () => {
      const result = showService.filter("sports", mockShows);
      expect(result).toEqual([]);
    });

    it("handles an empty shows array gracefully", () => {
      const result = showService.filter("morning", []);
      expect(result).toEqual([]);
    });
  });

  describe("isDefaultHost", () => {
    it("returns false when show is null or undefined", () => {
      expect(showService.isDefaultHost("Alice", null)).toBe(false);
      expect(showService.isDefaultHost("Alice", undefined)).toBe(false);
    });

    it("returns true for any input when show.defaultHost is an empty string", () => {
      const openShow: Show = createMockShow({
        id: 6,
        name: "Open Mic",
        defaultHost: "",
      });
      expect(showService.isDefaultHost("Anyone", openShow)).toBe(true);
      expect(showService.isDefaultHost("", openShow)).toBe(true);
    });

    it("returns true when input matches defaultHost (case-insensitive)", () => {
      const show: Show = createMockShow({
        id: 7,
        name: "Tech Talk",
        defaultHost: "Alice",
      });

      expect(showService.isDefaultHost("Alice", show)).toBe(true);
      expect(showService.isDefaultHost("alice", show)).toBe(true);
      expect(showService.isDefaultHost("ALICE", show)).toBe(true);
    });

    it("returns false when input does not match defaultHost", () => {
      const show: Show = createMockShow({
        id: 7,
        name: "Tech Talk",
        defaultHost: "Alice",
      });
      expect(showService.isDefaultHost("Bob", show)).toBe(false);
      expect(showService.isDefaultHost("", show)).toBe(false);
    });
  });

  describe("isDifferentHost", () => {
    it("returns true when show is null or undefined (inverse of isDefaultHost)", () => {
      expect(showService.isDifferentHost("Alice", null)).toBe(true);
      expect(showService.isDifferentHost("Alice", undefined)).toBe(true);
    });

    it("returns false when show.defaultHost is an empty string", () => {
      const openShow: Show = createMockShow({
        id: 6,
        name: "Open Mic",
        defaultHost: "",
      });
      expect(showService.isDifferentHost("Anyone", openShow)).toBe(false);
    });

    it("returns false when input matches defaultHost (case-insensitive)", () => {
      const show: Show = createMockShow({
        id: 7,
        name: "Tech Talk",
        defaultHost: "Alice",
      });
      expect(showService.isDifferentHost("alice", show)).toBe(false);
    });

    it("returns true when input does not match defaultHost", () => {
      const show: Show = createMockShow({
        id: 7,
        name: "Tech Talk",
        defaultHost: "Alice",
      });
      expect(showService.isDifferentHost("Bob", show)).toBe(true);
    });
  });
});
