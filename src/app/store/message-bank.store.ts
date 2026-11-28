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
import {
  catchError,
  concat,
  concatMap,
  EMPTY,
  from,
  Observable,
  pipe,
  switchMap,
  tap,
} from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { Id3Service } from "../services";

export interface NewMessage {
  code: string;
  title: string;
  nq: string;
  expirydate: string;
  fldproducer: string;
  mt: MessageType;
  file: File;
}

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
  withMethods(
    (
      store,
      mbService = inject(MessageBankService),
      id3Service = inject(Id3Service),
    ) => ({
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
                next: (sr) =>
                  patchState(store, {
                    messageCount: sr.count,
                    messages: sr.messages,
                  }),
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

      uploadNewMessage: rxMethod<NewMessage>(
        pipe(
          concatMap((input) =>
            from(id3Service.getDuration(input.file)).pipe(
              concatMap((duration) =>
                mbService.createHeader(input, duration as number),
              ),
              concatMap((nm) =>
                mbService
                  .uploadMessage(nm.code, input.file)
                  .pipe(tap((p) => console.log(p))),
              ),
              catchError((err) => {
                console.error("Stream failed:", err);
                return mbService.deleteHeader(input.code);
              }),
            ),
          ),
        ),
      ),

      hasMessageType(mt: string): boolean {
        return store
          .types()
          .some((t) => t.type.toLowerCase() === mt?.toLowerCase());
      },
    }),
  ),
);
