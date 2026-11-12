import { inject } from "@angular/core";
import { MessageBankService } from "../services/message-bank.service";
import {
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { Message } from "../models/message";

type MessageBankState = {
  isLoading: boolean;
  count: number;
  results: Message[];
};

export const initialState: MessageBankState = {
  isLoading: false,
  count: 0,
  results: [
    {
      id: 1,
      messageCode: "MESG",
      messageTitle: "Test Message",
      endCue: "It ends",
      expiry: "2026-11-12",
      producer: "stationuser",
      duration: 10,
    },
    {
      id: 2,
      messageCode: "TEST",
      messageTitle: "Stuff works",
      endCue: "Something about stuff",
      expiry: "2026-11-12",
      producer: "ben",
      duration: 40,
    },
  ],
};

export const MessageBankStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => ({})),
  withMethods((store, mbService = inject(MessageBankService)) => ({})),
);
