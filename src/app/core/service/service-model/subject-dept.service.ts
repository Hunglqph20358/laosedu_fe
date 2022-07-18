import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotiService} from './notification.service';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectDeptServiceService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  }

  constructor(private httpClient: HttpClient,
              private notiService: NotiService) {
  }

  url: string = environment.API_GATEWAY_ENDPOINT + '/subjects';

  addSubjectDept(SubjectDept: any) {
    return this.httpClient.post<any>(`${this.API}subjectDept`, SubjectDept, this.httpOptions);
  }

  deleteSubjectDept(SubjectDept: any) {
    return this.httpClient.post<any>(`${this.API}subjectsDept/delete`, SubjectDept, this.httpOptions);
  }

}
