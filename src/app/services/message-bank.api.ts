import { inject, Injectable } from "@angular/core";
import { Message } from "../models/message";
import { BaseApi } from "./base-api.service";
import { ModelApi } from "./model-api";
import { Observable } from "rxjs";
import { Moment } from "moment-timezone";

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

  newMessage(
    code: string,
    title: string,
    nq: string,
    producer: string,
    duration: number,
    expirydate: string,
    type: string,
  ) {
    return super.create({
      type,
      title,
      nq,
      fldproducer: producer,
      duration,
      expirydate,
      code,
    });
  }

  deleteMessage(code: string) {
    return super.delete({ id: code });
  }

  upload(code: string, file: File) {
    return this.http.upload(`${this.modelName}/${code}/audio`, file);
  }
}
