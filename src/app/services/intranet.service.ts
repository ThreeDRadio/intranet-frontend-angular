import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IntranetService {
  private authToken: string;
  constructor(private http: HttpClient, private baseUrl) {}

  public login(params: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, params).map((response: any) => {
      this.authToken = response.token;
      return response;
    });
  }

  public logout() {
    this.authToken = undefined;
  }

  public setToken(token: string) {
    this.authToken = token;
  }
}
