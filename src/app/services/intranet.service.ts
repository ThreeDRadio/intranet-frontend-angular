import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

export const API_URL = new InjectionToken<string>('Three D API URL');

@Injectable()
export class IntranetService {
  private authToken: string;
  constructor(private http: HttpClient, @Inject(API_URL) private baseUrl) {}

  public login(params: { username: string; password: string }): Observable<any> {
    const form = new FormData();
    form.append('username', params.username);
    form.append('password', params.password);
    return this.http.post(`${this.baseUrl}/auth`, form).pipe(
      map((response: any) => {
        this.authToken = response.token;
        return response;
      })
    );
  }

  public logout() {
    this.authToken = undefined;
    return of(true);
  }

  public setToken(token: string) {
    this.authToken = token;
  }

  public getUser(userId: any) {}
}
