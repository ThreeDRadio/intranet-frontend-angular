import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const API_URL = new InjectionToken<string>('Three D API URL');

export interface HttpOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams | { [param: string]: any | any[] };
  reportProgress?: boolean;
  responseType: 'json';
  withCredentials?: boolean;
}

@Injectable()
export class BaseApi {
  private authToken: string;
  public userId: number;
  constructor(private http: HttpClient, @Inject(API_URL) private baseUrl) {}

  public login(params: { username: string; password: string }): Observable<any> {
    const form = new FormData();
    form.append('username', params.username);
    form.append('password', params.password);
    return this.http.post(`${this.baseUrl}/auth`, form).pipe(
      map((response: any) => {
        this.authToken = response.token;
        this.userId = response.userId;
        return response;
      })
    );
  }

  public getProfile() {
    return this.get('users/me');
  }

  public logout() {
    this.authToken = undefined;
    return of(true);
  }

  public setToken(token: string) {
    this.authToken = token;
  }

  /**
   * Performs a get request on the API, with authorization when available.
   *
   * @param urlSegment The URL segment from the API base
   * @param options Any options that should be passed to the request
   */
  public get(urlSegment: string, options?: HttpOptions): Observable<Object> {
    const finalOptions = this.completeOptions(options);
    return this.http.get(this.buildUrl(urlSegment), finalOptions);
  }

  /**
   * Performs a put request on the API, with authorization when available.
   *
   * @param urlSegment The URL segment from the API base
   * @param options Any options that should be passed to the request
   */
  public put(urlSegment: string, body: any, options?: HttpOptions): Observable<Object> {
    const finalOptions = this.completeOptions(options);
    return this.http.put(this.buildUrl(urlSegment), body, finalOptions);
  }

  /**
   * Performs a put request on the API, with authorization when available.
   *
   * @param urlSegment The URL segment from the API base
   * @param options Any options that should be passed to the request
   */
  public post(urlSegment: string, body: any, options?: HttpOptions): Observable<Object> {
    const finalOptions = this.completeOptions(options);
    return this.http.post(this.buildUrl(urlSegment), body, finalOptions);
  }

  /**
   * Performs a put request on the API, with authorization when available.
   *
   * @param urlSegment The URL segment from the API base
   * @param options Any options that should be passed to the request
   */
  public delete(urlSegment: string, options?: HttpOptions): Observable<Object> {
    const finalOptions = this.completeOptions(options);
    return this.http.delete(this.buildUrl(urlSegment), finalOptions);
  }

  /**
   * Posts a file using multipart form data.
   *
   * @param urlSegment The url segment relative to the API base
   * @param file The file object to upload
   * @param options Any options that should be passed to the request
   */
  public upload(urlSegment: string, file: File, options?: HttpOptions): Observable<Object> {
    const formData: FormData = new FormData();
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.post(urlSegment, formData);
  }

  /**
   * Creates an HttpOptions object for use in requests.
   * @param baseOptions The http options object to start with
   */
  private completeOptions(baseOptions: HttpOptions = { responseType: 'json' }): HttpOptions {
    const token = `Token ${this.authToken}`;
    let finalHeaders = new HttpHeaders({ Authorization: token });
    if (baseOptions.headers) {
      finalHeaders = baseOptions.headers.set('Authorization', token);
    }
    return { ...baseOptions, headers: finalHeaders };
  }
  private buildUrl(segment: string): string {
    return `${this.baseUrl}/api/${segment}/`;
  }
}
