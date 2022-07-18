import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotiService } from './notification.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GradeLevelModel } from '../model/grade-level.model';

@Injectable({
  providedIn: 'root',
})
export class GradeLevelService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private notiService: NotiService
  ) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    this.httpOptions.headers.set('Authorization', 'Bearer ' + userToken);
  }

  url: string = environment.API_GATEWAY_ENDPOINT + '/grade-levels';

  getGradeLevels(): Observable<any> {
    return this.httpClient.get<GradeLevelModel[]>(
      `${this.API}grade-levels`,
      this.httpOptions
    );
  }

  getGradeLevelOfSubject(): Observable<any> {
    return this.httpClient.get<GradeLevelModel[]>(
      `${this.API}grade-levels/getAllSort`
    );
  }

  getGradeLevelOrderByName(): Observable<any> {
    return this.httpClient.get<GradeLevelModel[]>(
      `${this.API}grade-levels/order-by-name`
    );
  }
}
