import { computed, inject } from "@angular/core";
import { MessageBankService } from "../services/message-bank.service";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { Message, MessageType } from "../models/message";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";

type MessageSearchParams = {
  type: string | undefined;
  current: boolean | undefined;
};

type MessageBankState = {
  isLoadingTypes: boolean;
  isLoadingMessages: boolean;
  types: MessageType[];
  messageCount: number;
  messages: Message[];
};

export const initialState: MessageBankState = {
  isLoadingTypes: false,
  isLoadingMessages: false,
  types: [],
  messageCount: 0,
  messages: [],
};

export const MessageBankStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store, mbService = inject(MessageBankService)) => ({
    fetchTypes: rxMethod<void>(
      pipe(
        tap({
          next: () => patchState(store, { isLoadingTypes: true }),
        }),
        switchMap(() =>
          mbService.getMessageTypes().pipe(
            tapResponse({
              next: (types) => patchState(store, { types }),
              error: (err) => console.error("Failed to fetch types", err),
              finalize: () => patchState(store, { isLoadingTypes: false }),
            }),
          ),
        ),
      ),
    ),

    fetchMessages: rxMethod<void>(
      pipe(
        tap({ next: () => patchState(store, { isLoadingMessages: true }) }),
        switchMap(() => {
          return mbService.getMessages().pipe(
            tapResponse({
              next: (messages) => patchState(store, { messages }),
              error: (err) => console.error("Failed to fetch messages", err),
              finalize: () => patchState(store, { isLoadingMessages: false }),
            }),
          );
        }),
      ),
    ),

    searchMessages: rxMethod<MessageSearchParams>(
      pipe(
        tap({ next: () => patchState(store, { isLoadingMessages: true }) }),
        switchMap((input) => {
          return mbService.searchMessages(input.type, input.current).pipe(
            tapResponse({
              next: (sr) =>
                patchState(store, {
                  messageCount: sr.count,
                  messages: sr.messages,
                }),
              error: (err) => console.error("Failed to fetch messages", err),
              finalize: () =>
                patchState(store, {
                  isLoadingMessages: false,
                }),
            }),
          );
        }),
      ),
    ),

    hasMessageType(mt: string): boolean {
      return store
        .types()
        .some((t) => t.type.toLowerCase() === mt?.toLowerCase());
    },
  })),
);
