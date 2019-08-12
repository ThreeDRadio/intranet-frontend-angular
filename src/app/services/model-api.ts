import { Observable } from 'rxjs';

import { Injectable } from '../../../node_modules/@angular/core';
import { BaseApi, HttpOptions } from './base-api.service';
import { HttpParams } from '@angular/common/http';

export interface ApiModel {
  id: string | number;
}

@Injectable()
export class ModelApi<ResponseType> {
  constructor(readonly modelName, public http: BaseApi) {}
  public list(options: HttpOptions = { responseType: 'json' }): Observable<any> {
    return <Observable<any>>this.http.get(this.modelName, options);
  }
  public get(id: string | number): Observable<ResponseType> {
    return <Observable<ResponseType>>this.http.get(`${this.modelName}/${id}`);
  }
  public create(object: Object): Observable<ResponseType> {
    return <Observable<ResponseType>>this.http.post(this.modelName, object);
  }
  public update(object: ApiModel): Observable<ResponseType> {
    return <Observable<ResponseType>>this.http.put(`${this.modelName}/${object.id}`, object);
  }
  public partialUpdate(object: ApiModel): Observable<ResponseType> {
    return <Observable<ResponseType>>this.http.patch(`${this.modelName}/${object.id}`, object);
  }
  public delete(object: ApiModel): Observable<any> {
    return this.http.delete(`${this.modelName}/${object.id}`);
  }
}
