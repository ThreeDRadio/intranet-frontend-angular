import { ApiModel } from "../services/model-api";

export interface Message extends ApiModel {
  code: string;
  title: string;
  nq: string;
  expirydate: string;
  fldproducer: string;
  duration: number | null | undefined;
  type: string;
}

export interface MessageType {
  type: string;
  schedules: boolean;
  description: string;
}
