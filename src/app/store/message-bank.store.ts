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
      expiry: "12-11-2026",
      producer: "producer",
      duration: 10,
    },
  ],
};

export const MessageBankStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => ({})),
  withMethods((store, mbService = inject(MessageBankService)) => ({})),
);
