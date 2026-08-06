import { PlaylistEntry } from "../models/playlist-entry";

export type QuotaParams = {
  localQuota: number | undefined;
  australianQuota: number | undefined;
  femaleQuota: number | undefined;
};
export type QuotaResult = {
  count: number;
  quota: number;
  meets: boolean;
};

export class QuotaService {
  private getQuotaCount(entries: PlaylistEntry[], type: string): number {
    if (type.toLocaleLowerCase() === "local") {
      return entries.filter((e) => e.local).length;
    }
    if (type.toLocaleLowerCase() === "aus") {
      return entries.filter((e) => e.australian).length;
    }
    if (type.toLocaleLowerCase() === "female") {
      return entries.filter((e) => e.female).length;
    }

    return 0;
  }

  private getQuotaMinimum(
    params: QuotaParams,
    entries: PlaylistEntry[],
    type: string,
  ): number {
    let quota: number = 0;

    if (type.toLocaleLowerCase() === "local") {
      quota = params.localQuota ?? 0;
    }
    if (type.toLocaleLowerCase() === "aus") {
      quota = params.australianQuota ?? 0;
    }
    if (type.toLocaleLowerCase() === "female") {
      quota = params.femaleQuota ?? 0;
    }

    const percentage = quota / 100.0;
    return Math.round(entries.length * percentage);
  }

  private getQuota(
    params: QuotaParams,
    entries: PlaylistEntry[],
    type: string,
  ) {
    const c = this.getQuotaCount(entries, type);
    const q = this.getQuotaMinimum(params, entries, type);
    return {
      count: c,
      quota: q,
      meets: c >= q,
    };
  }

  getLocalQuota(params: QuotaParams, entries: PlaylistEntry[]): QuotaResult {
    return this.getQuota(params, entries, "local");
  }

  getAustralianQuota(
    params: QuotaParams,
    entries: PlaylistEntry[],
  ): QuotaResult {
    return this.getQuota(params, entries, "aus");
  }

  getFemaleQuota(params: QuotaParams, entries: PlaylistEntry[]): QuotaResult {
    return this.getQuota(params, entries, "female");
  }
}
