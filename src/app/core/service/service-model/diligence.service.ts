import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotiService} from './notification.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BasicService} from '../utils/basic.service';
import {CommonServiceService} from '../utils/common-service.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DiligenceService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    }),
  };

  constructor(
    private http: HttpClient,
    private notiService: NotiService,
    private commonService: CommonServiceService
  ) {
    // @ts-ignore
    super();
    const userToken = localStorage.getItem(environment.authTokenKey);
    this.httpOptions.headers.set('Authorization', 'Bearer ' + userToken);
  }

  getAllDiligence(obj: any): Observable<any> {
    return this.http.post(this.API + 'get-attendance-by-month', obj);
  }

  getMonth(obj: any): Observable<any> {
    return this.http.post(this.API + 'month-by-semester-and-year', obj);
  }

  exportData(listData) {
    const url = this.API + `/exportData`;
    return this.commonService.downloadFile(url, listData, null, `BaoCao_NamHoc_${moment().format('YYYYMMDD').toString()}`);
  }
}
