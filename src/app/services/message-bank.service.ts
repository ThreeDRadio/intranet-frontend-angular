import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { MessageBankApi } from "./message-bank.api";
import { Message, MessageType } from "../models/message";

export class MessageBankSearchResult {
  count: number = 0;
  messages: Message[] = [];
}

@Injectable({
  providedIn: "root",
})
export class MessageBankService {
  private mbApi = inject(MessageBankApi);

  getMessageTypes(): Observable<MessageType[]> {
    const observable = this.mbApi.getTypes();

    return observable.pipe(
      map((response: any) => {
        const list = response.results;

        return list.map((item: any) => {
          return item as MessageType;
        });
      }),
    );
  }

  getMessages(): Observable<Message[]> {
    const observable = this.mbApi.searchMessages(undefined);

    return observable.pipe(
      map((response: any) => {
        const list = response.results;
        console.log(response);

        return list.map((item: any) => {
          return item as Message;
        });
      }),
    );
  }

  searchMessages(
    type: string | undefined,
    current: boolean = true,
  ): Observable<MessageBankSearchResult> {
    const observable = this.mbApi.searchMessages(type, current);

    return observable.pipe(
      map((response: any): MessageBankSearchResult => {
        const messages: Message[] = (response.results || []).map(
          (item: any) => item as Message,
        );

        return {
          count: response.count ?? 0,
          messages,
        };
      }),
    );
  }
}
