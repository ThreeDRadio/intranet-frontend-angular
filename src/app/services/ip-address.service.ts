import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { BaseApi } from "./base-api.service";

@Injectable({
  providedIn: "root",
})
export class IpAddressService {
  private baseApi = inject(BaseApi);

  getIpAddress(): Observable<string> {
    return this.baseApi.getIp().pipe(map((r) => r as string));
  }

  IsWhitelisted(ip: string) {
    return false;
  }
}
