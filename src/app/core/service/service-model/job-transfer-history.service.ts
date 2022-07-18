import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProvinceData} from './province.service';
import {JobTransferHistoryModel} from '../model/job-transfer-history.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobTransferHistoryService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  addJobTransferHistory(jobTransferHistory: JobTransferHistoryModel): Observable<any>{
    return this.httpClient.post(`${this.API}job-transfer-histories`, jobTransferHistory);
  }
}