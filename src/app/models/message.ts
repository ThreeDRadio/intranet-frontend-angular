import { ApiModel } from "../services/model-api";

export class Message implements ApiModel {
  id: number;
  messageCode: string;
  messageTitle: string;
  endCue: string;
  expiry: string;
  producer: string;
  duration: number;
}
