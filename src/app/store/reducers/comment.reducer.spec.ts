import { TestBed } from "@angular/core/testing";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { CommentState, reducer } from "./comment.reducer";
import { CommentActions } from "../actions/comment.actions";

import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";

describe("Remove Comment", () => {
  let store: MockStore;
  const initialState: CommentState = {
    entities: {
      1: {
        id: 100,
        comment: "Test comment 1",
        author: {
          id: 1,
          first_name: "Test",
          last_name: "Commenter 1",
          gravatarUrl: "",
        },
        visible: true,
      },
      2: {
        id: 101,
        comment: "Test comment 2",
        author: {
          id: 2,
          first_name: "Test",
          last_name: "Commenter 2",
          gravatarUrl: "",
        },
        visible: true,
      },
    },
    ids: [1, 2],
    loading: false,
    releaseEntities: { 100: ["1", "2"] },
  };

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideMockStore({ initialState })],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
  });

  it("Should remove from all state when comment removed.", () => {
    const newState1: CommentState = {
      entities: {
        2: {
          id: 101,
          comment: "Test comment 2",
          author: {
            id: 2,
            first_name: "Test",
            last_name: "Commenter 2",
            gravatarUrl: "",
          },
          visible: true,
        },
      },
      ids: [2],
      loading: true,
      releaseEntities: { 100: ["2"] },
    };

    const action = new CommentActions.RequestModeratorRemoveComment({
      commentId: 1,
    });
    const state = reducer(initialState, action);
    expect(state).toEqual(newState1);
    expect(state).not.toBe(initialState);
  });
});
