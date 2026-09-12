import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export class IpAddressService {
  private ipEchoEndpoint = "https://ipify.org";
  private http = inject(HttpClient);

  getIpAddress(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>(this.ipEchoEndpoint);
  }
}
