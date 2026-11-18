import { inject, Injectable } from "@angular/core";
import { Message } from "../models/message";
import { BaseApi } from "./base-api.service";
import { ModelApi } from "./model-api";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MessageBankApi extends ModelApi<Message> {
  constructor() {
    super("messages", inject(BaseApi));
  }

  getTypes(): Observable<any> {
    return this.http.get(`messages/types`);
  }

  searchMessages(
    mt: string | undefined,
    current: boolean = true,
  ): Observable<any> {
    const { type, ...rest } = { type: mt, current };
    const filteredParams = type !== undefined ? { ...rest, type } : rest;
    return super.list({ responseType: "json", params: filteredParams });
  }
}
