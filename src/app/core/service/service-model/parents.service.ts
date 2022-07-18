import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BasicService} from '../utils/basic.service';
import {IResponse} from '../model/response.model';
import {ParentInfo} from "../model/parent-info.model";

@Injectable({
  providedIn: 'root',
})
export class ParentService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    }),
  };

  constructor(
    private http: HttpClient
  ) {
    // @ts-ignore
    super();
    const userToken = localStorage.getItem(environment.authTokenKey);
    this.httpOptions.headers.set('Authorization', 'Bearer ' + userToken);
  }

  onSearch(): Observable<any> {
    return this.http.get<ParentInfo>(this.API + 'parents-home');
  }
}
