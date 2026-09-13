import { inject, Injectable } from "@angular/core";
import { BaseApi } from "./base-api.service";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IpAddressService {
  private baseApi = inject(BaseApi);

  isWhitelisted(): Observable<boolean> {
    return this.baseApi.isWhitelisted();
  }
}
