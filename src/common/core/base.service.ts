import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseDto } from './dto';
import { HttpClient } from './http-client';

export abstract class BaseService<T extends BaseDto> {

  protected url: string;

  constructor(protected http: HttpClient, resourceName: string) {
    this.url = `/api/${resourceName}`;
  }

  createOne(data: T): Observable<Response> {
    const body = JSON.stringify(data);
    return this.http.post(this.url, body).map((res) => res.json());
  }

  updateOne(data: T): Observable<Response> {
    const body = JSON.stringify(data);
    return this.http.put(`${this.url}/${data._id}`, body).map((res: Response) => res.json());
  }

  removeOneById(id: string): Observable<Response> {
    return this.http.delete(`${this.url}/${id}`).map((res: Response) => res.json());
  }

  removeOneByUri(uri: string): Observable<Response> {
    return this.http.delete(`${uri}`).map((res: Response) => res.json());
  }

  findOneById(id: string): Observable<Response> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json());
  }

  findOneByUri(uri: string): Observable<Response> {
    return this.http.get(`${uri}`).map((res: Response) => res.json());
  }

  find(): Observable<Response> {
    return this.http.get(`${this.url}`).map((res: Response) => res.json());
  }

}

