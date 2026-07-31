import { TestBed } from "@angular/core/testing";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
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
    let fakePlaylist1 = {
      id: 1,
      show: 1,
      showname: "",
      host: "Test Host 1",
      date: "01-01-2025",
      notes: "This is a test playlist (1)",
      tracks: "",
      complete: true,
      fillin: false,
      femaleQuota: 40,
      localQuota: 20,
      australianQuota: 20,
    };
    const mockPlaylistService = {
      getPlaylistPage: (page: number) => from([fakePlaylist1]),
    };

    const mockShowService = { getStep: () => 3 };

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
    expect(store).toBeDefined();
    store.fetchPlaylists(1);
    TestBed.tick();
    expect(store.isLoading()).toBeFalsy();
    expect(store.playlists().length).toBeGreaterThan(0);
  });
});
