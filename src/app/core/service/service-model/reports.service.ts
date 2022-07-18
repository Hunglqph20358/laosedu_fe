import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotiService} from './notification.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BasicService} from '../utils/basic.service';
import {CommonServiceService} from '../utils/common-service.service';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ReportsService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}reports`;
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
    private commonService: CommonServiceService,
    private translate: TranslateService
  ) {
    // @ts-ignore
    super();
    const userToken = localStorage.getItem(environment.authTokenKey);
    this.httpOptions.headers.set('Authorization', 'Bearer ' + userToken);
  }

  reportSchool(obj: any): Observable<any> {
    return this.http.post(this.API + '/school', obj);
  }

  exportData(listData, year) {
    const url = this.API + `/exportData`;
    // return this.commonService.downloadFile(url, listData, null, `Baocao_namhoc_${year.toString()}`);
    return this.commonService.downloadFile(url, listData, null, `${this.translate.instant('REPORT_SCHOOL.NAME_FILE')}${year.toString()}`);
  }
}
