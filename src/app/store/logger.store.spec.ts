import { TestBed, tick } from "@angular/core/testing";
import { beforeAll, describe, expect, it } from "vitest";
import { initialState, LoggerStore } from "./logger.store";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";
import { PlaylistService } from "../services/playlist.service";
import { ShowService } from "../services/show.service";
import { getState } from "@ngrx/signals";
import { from } from "rxjs";

describe("LoggerStore", () => {
  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
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
    ];

    const mockPlaylistService = {
      getPlaylistPage: (page: number) => {
        if (page === 1) {
          return from([fakePlaylistsP1]);
        } else if (page === 2) {
          return from([fakePlaylistsP2]);
        }
      },
    };

    const mockShowService = {
      getShows: (ids: number[]) => {
        if (ids.find((id) => id === 1) >= 0) {
          return from([fakeShows]);
        }
      },
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        LoggerStore,
        { provide: PlaylistService, useValue: mockPlaylistService },
        { provide: ShowService, useValue: mockShowService },
      ],
    });
  });

  it("should be empty to begin with", () => {
    const store = TestBed.inject(LoggerStore);
    expect(store).toBeDefined();
    expect(getState(store)).toStrictEqual(initialState);
  });

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

  it("should be updated with a show from the service", () => {});
});
