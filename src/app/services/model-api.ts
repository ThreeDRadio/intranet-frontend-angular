import { Observable } from 'rxjs';

import { Injectable } from '../../../node_modules/@angular/core';
import { BaseApi } from './base-api.service';

export interface ApiModel {
  id: string | number;
}

@Injectable()
export class ModelApi<ResponseType> {
  constructor(readonly modelName, public http: BaseApi) {}
  public list(params: any): Observable<Array<ResponseType>> {
    return <Observable<Array<ResponseType>>>this.http.get(this.modelName);
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
  public delete(object: ApiModel): Observable<any> {
    return this.http.delete(`${this.modelName}/${object.id}`);
  }
}
