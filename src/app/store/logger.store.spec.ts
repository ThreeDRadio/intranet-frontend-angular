import { TestBed, tick } from "@angular/core/testing";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { initialState, LoggerStore } from "./logger.store";
import { unprotected } from "@ngrx/signals/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";
import { PlaylistService } from "../services/playlist.service";
import { ShowService } from "../services/show.service";
import { getState, patchState } from "@ngrx/signals";
import { from, of, throwError } from "rxjs";
import { PlaylistEntry } from "../models/playlist-entry";

describe("LoggerStore", () => {
  let fakePlaylistsP1 = [
    {
      id: 1,
      show: 1,
      showname: "",
      host: "Test Host 1",
      date: "01-01-2026",
      notes: "This is a test playlist (1)",
      tracks: "",
      complete: true,
      fillin: false,
      femaleQuota: 40,
      localQuota: 20,
      australianQuota: 20,
    },
    {
      id: 3,
      show: 1,
      showname: "",
      host: "Test Host 3",
      date: "01-01-2026",
      notes: "This is a test playlist (3)",
      tracks: "",
      complete: true,
      fillin: true,
      femaleQuota: 40,
      localQuota: 20,
      australianQuota: 20,
    },
    {
      id: 4,
      show: 2,
      showname: "",
      host: "Test Host 4",
      date: "02-01-2026",
      notes: "This is a test playlist (4)",
      tracks: "",
      complete: true,
      fillin: true,
      femaleQuota: 40,
      localQuota: 20,
      australianQuota: 20,
    },
  ];
  let fakePlaylistsP2 = [
    {
      id: 2,
      show: 1,
      showname: "",
      host: "Test Host 2",
      date: "01-01-2025",
      notes: "This is a test playlist (2)",
      tracks: "",
      complete: true,
      fillin: true,
      femaleQuota: 40,
      localQuota: 20,
      australianQuota: 20,
    },
  ];

  let fakeShows = [
    {
      id: 1,
      name: "Test Show 1",
      startTime: "09:00:00",
      endTime: "11:00:00",
      defaultHost: "Test Host 1",
      active: true,
      playlists: "",
      topartists: "",
      statistics: "",
      customQuotas: false,
      femaleQuota: 40,
      localQuota: 20,
      australianQuota: 20,
    },
    {
      id: 2,
      name: "Test Show 2",
      startTime: "11:00:00",
      endTime: "13:00:00",
      defaultHost: "Test Host 2",
      active: true,
      playlists: "",
      topartists: "",
      statistics: "",
      customQuotas: false,
      femaleQuota: 40,
      localQuota: 20,
      australianQuota: 20,
    },
  ];

  const mockPlaylistService = {
    getPlaylistPage: (page: number) => {
      if (page === 1) {
        return from([fakePlaylistsP1]);
      } else if (page === 2) {
        return from([fakePlaylistsP2]);
      }
    },
    deleteEntry: vi.fn(),
  };

  const mockShowService = {
    getShows: (ids: number[]) => {
      return from([fakeShows.filter((f) => ids.includes(f.id))]);
    },
  };

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserTestingModule,
      platformBrowserTesting(),
      { teardown: { destroyAfterEach: true } },
    );

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        LoggerStore,
        { provide: PlaylistService, useValue: mockPlaylistService },
        { provide: ShowService, useValue: mockShowService },
      ],
    });
  });

  beforeEach(() => {
    let store = TestBed.inject(LoggerStore);
    // Reset state to initial default values before each test
    patchState(unprotected(store), initialState);
  });

  it("should be empty to begin with", () => {
    const store = TestBed.inject(LoggerStore);
    expect(store).toBeDefined();
    expect(getState(store)).toStrictEqual(initialState);
  });

  describe("LoggerStore - playlists", () => {
    it("should be updated with playlists from service", () => {
      const store = TestBed.inject(LoggerStore);
      store.fetchPlaylists(1);
      TestBed.tick();
      expect(store.isLoading()).toBeFalsy();
      const currentState = getState(store);
      expect(currentState.playlists).toBeDefined();
      expect(currentState.playlists.length).toBeGreaterThan(0);
      const firstPlaylist = currentState.playlists[0];
      expect(firstPlaylist).toBeDefined();
      expect(firstPlaylist.host).toBe("Test Host 1");
      expect(firstPlaylist.complete).toBeTruthy();
    });

    it("should be updated with playlists when page changes", () => {
      const store = TestBed.inject(LoggerStore);
      store.fetchPlaylists(1);
      TestBed.tick();
      expect(store.isLoading()).toBeFalsy();
      const currentStatePage1 = getState(store);
      expect(currentStatePage1.playlists).toBeDefined();
      expect(currentStatePage1.playlists.length).toBeGreaterThan(0);
      const firstPlaylistPage1 = currentStatePage1.playlists[0];
      expect(firstPlaylistPage1).toBeDefined();
      expect(firstPlaylistPage1.host).toBe("Test Host 1");
      expect(firstPlaylistPage1.complete).toBeTruthy();

      // Load the next page
      store.fetchPlaylists(2);
      TestBed.tick();
      expect(store.isLoading()).toBeFalsy();
      const currentStatePage2 = getState(store);
      expect(currentStatePage2.playlists).toBeDefined();
      expect(currentStatePage2.playlists.length).toBeGreaterThan(0);
      const firstPlaylistPage2 = currentStatePage2.playlists[0];
      expect(firstPlaylistPage2).toBeDefined();
      expect(firstPlaylistPage2.host).toBe("Test Host 2");
      expect(firstPlaylistPage2.complete).toBeTruthy();
    });

    it("should be able to return playlists sorted by date", () => {
      const store = TestBed.inject(LoggerStore);
      store.fetchPlaylists(1);
      TestBed.tick();
      expect(store.isLoading()).toBeFalsy();
      const currentState = getState(store);
      expect(currentState.playlists).toBeDefined();
      expect(currentState.playlists.length).toBeGreaterThan(0);
      const byDate = store.playlistsByDate();
      expect(byDate.length).toBe(2);
      const first = byDate[0];
      expect(first.date).toBe("01-01-2026");
      expect(first.playlists.length).toBeGreaterThan(0);
      expect(first.playlists[0].date).toBe("01-01-2026");
      expect(first.playlists[0].host).toBe("Test Host 1");
      expect(first.playlists[1].date).toBe("01-01-2026");
      expect(first.playlists[1].host).toBe("Test Host 3");
      const second = byDate[1];
      expect(second.date).toBe("02-01-2026");
      expect(second.playlists.length).toBeGreaterThan(0);
      expect(second.playlists[0].date).toBe("02-01-2026");
      expect(second.playlists[0].host).toBe("Test Host 4");
    });

    it("should be updated with shows when playlists are fetched", () => {
      const store = TestBed.inject(LoggerStore);
      store.fetchPlaylists(1);
      TestBed.tick();
      expect(store.isLoading()).toBeFalsy();
      const currentState = getState(store);
      expect(currentState.playlists).toBeDefined();
      expect(currentState.playlists.length).toBeGreaterThan(0);
      const firstShow = currentState.shows[0];
      expect(firstShow).toBeDefined();
      expect(firstShow.id).toBe(1);
      expect(firstShow.defaultHost).toBe("Test Host 1");
      expect(firstShow.name).toBe("Test Show 1");
    });

    it("should be able to retrieve playlists by id", () => {
      const store = TestBed.inject(LoggerStore);
      store.fetchPlaylists(1);
      TestBed.tick();
      expect(store.isLoading()).toBeFalsy();
      const firstPlaylist = store.playlistById()(1);
      expect(firstPlaylist).toBeDefined();
      expect(firstPlaylist?.host).toBe("Test Host 1");
      expect(firstPlaylist?.complete).toBeTruthy();
    });

    it("should be able to retrieve shows for a given playlist page by id", () => {
      const store = TestBed.inject(LoggerStore);
      store.fetchPlaylists(1);
      TestBed.tick();
      expect(store.isLoading()).toBeFalsy();
      const firstShow = store.showById()(1);
      expect(firstShow).toBeDefined();
      expect(firstShow?.name).toBe("Test Show 1");
      expect(firstShow?.active).toBeTruthy();
    });
  });

  describe("LoggerStore - playlist editor", () => {
    let store: any;
    const initialEntries: PlaylistEntry[] = [
      {
        id: 101,
        index: 1,
        playlist: 0,
        artist: "Artist A",
        title: "Song A",
        album: "Album A",
        duration: "00:01:00",
        local: true,
        australian: true,
        female: true,
        newRelease: false,
      },
      {
        id: 102,
        index: 2,
        playlist: 0,
        artist: "Artist B",
        title: "Song B",
        album: "Album B",
        duration: "00:03:30",
        local: true,
        australian: true,
        female: true,
        newRelease: false,
      },
      {
        id: 103,
        index: 3,
        playlist: 0,
        artist: "Artist C",
        title: "Song C",
        album: "Album C",
        duration: "00:02:00",
        local: true,
        australian: false,
        female: true,
        newRelease: false,
      },
    ];

    beforeEach(() => {
      vi.resetAllMocks();
      store = TestBed.inject(LoggerStore);
      // Seed initial data
      patchState(store, { playlistEntries: [...initialEntries] });
    });

    it("should remove the item optimistically before the API responds", async () => {
      // API is slow and hasn't responded yet
      mockPlaylistService.deleteEntry.mockReturnValue(
        of(null).pipe(
          await import("rxjs/operators").then(({ delay }) => delay(1000)),
        ),
      );

      store.deletePlaylistEntry(102);
      TestBed.tick();

      // Assert: UI is instantly updated, item 102 is missing
      const entries = store.playlistEntries();
      expect(entries.length).toBe(2);
      expect(entries.find((e: PlaylistEntry) => e.id === 102)).toBeUndefined();

      // Clean up timer
      TestBed.tick();
    });

    it("should reindex the items only after the API succeeds", () => {
      mockPlaylistService.deleteEntry.mockReturnValue(of(true));
      store.deletePlaylistEntry(102);
      TestBed.tick();

      const entries = store.playlistEntries();
      expect(entries).toEqual([
        {
          id: 101,
          index: 1,
          playlist: 0,
          artist: "Artist A",
          title: "Song A",
          album: "Album A",
          duration: "00:01:00",
          local: true,
          australian: true,
          female: true,
          newRelease: false,
        },
        {
          id: 103,
          index: 2,
          playlist: 0,
          artist: "Artist C",
          title: "Song C",
          album: "Album C",
          duration: "00:02:00",
          local: true,
          australian: false,
          female: true,
          newRelease: false,
        },
      ]);
    });

    it("should roll back to the original state if the API fails", () => {
      mockPlaylistService.deleteEntry.mockReturnValue(
        throwError(() => new Error("Network Error")),
      );

      store.deletePlaylistEntry(102);
      TestBed.tick();

      expect(store.playlistEntries()).toEqual(initialEntries);
    });

    it("should preserve original object references after a rollback", () => {
      mockPlaylistService.deleteEntry.mockReturnValue(
        throwError(() => new Error("Server Error")),
      );

      const firstItemBeforeClick = store.playlistEntries()[0];

      store.deletePlaylistEntry(102);
      TestBed.tick();

      const firstItemAfterRollback = store.playlistEntries()[0];
      expect(firstItemAfterRollback).toBe(firstItemBeforeClick);
    });

    it("should keep the rxMethod stream alive to handle subsequent calls after a failure", () => {
      mockPlaylistService.deleteEntry
        .mockReturnValueOnce(throwError(() => new Error("First call fails")))
        .mockReturnValueOnce(of(true));

      // First attempt fails
      store.deletePlaylistEntry(102);
      TestBed.tick();
      expect(store.playlistEntries().length).toBe(3); // Rolled back

      // Second attempt on a different item succeeds
      store.deletePlaylistEntry(101);
      TestBed.tick();
      expect(store.playlistEntries().length).toBe(2); // Successfully removed
    });

    it("should ignore rapid concurrent clicks via exhaustMap", async () => {
      // API delays response to simulate network latency
      mockPlaylistService.deleteEntry.mockReturnValue(
        of(null).pipe(
          await import("rxjs/operators").then(({ delay }) => delay(1000)),
        ),
      );

      // User spams the delete button for two different items
      store.deletePlaylistEntry(102);
      store.deletePlaylistEntry(103);
      TestBed.tick();

      // Assert: Only the first call went through due to exhaustMap locking
      expect(mockPlaylistService.deleteEntry).toHaveBeenCalledTimes(1);
      expect(mockPlaylistService.deleteEntry).toHaveBeenCalledWith(102);

      TestBed.tick(); // Resolve open timers
    });
  });
});
