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
    // Guard against null or undefined entries array
    if (!entries || !Array.isArray(entries)) {
      return 0;
    }

    // Guard against null, undefined, or empty type string
    if (!type) {
      return 0;
    }

    const lower = type.toLocaleLowerCase();

    if (lower === "local") {
      return entries.filter((e) => e?.local).length;
    }
    if (lower === "aus") {
      return entries.filter((e) => e?.australian).length;
    }
    if (lower === "female") {
      return entries.filter((e) => e?.female).length;
    }

    return 0;
  }

  private getQuotaMinimum(
    params: QuotaParams,
    entries: PlaylistEntry[],
    type: string,
  ): number {
    // Guard against missing parameters, empty playlists, or missing type
    if (!params || !entries || !type) {
      return 0;
    }

    let quota: number = 0;
    const lower = type.toLocaleLowerCase();

    if (lower === "local") {
      quota = params.localQuota ?? 0;
    }
    if (lower === "aus") {
      quota = params.australianQuota ?? 0;
    }
    if (lower === "female") {
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
