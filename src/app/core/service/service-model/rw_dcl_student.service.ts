import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotiService} from './notification.service';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {SubjectModel} from '../model/subjects.model';
import {SubjectsReceiveDataModel} from '../model/subjects-receive-data.model';
import * as moment from 'moment';
import {CommonServiceService} from '../utils/common-service.service';
@Injectable({
  providedIn: 'root'
})
export class RwDclStudentService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  }
  constructor(private httpClient: HttpClient,
              private notiService: NotiService,
              private commonService: CommonServiceService) {
  }



  addRwDclStudent(RwDclStudent: any) {
    return this.httpClient.post<any>(`${this.API}rw-dcl-students`, RwDclStudent, this.httpOptions);
  }

  getRwStudentProfile(studentCode : string, year : string){
    return this.httpClient.get<any>(`${this.API}rw-student/getRwDclStudentProfile/${studentCode}&${year}`);
  }
  getDclStudentProfile(studentCode : string, year : string){
    return this.httpClient.get<any>(`${this.API}dcl-student/getRwDclStudentProfile/${studentCode}&${year}`);
  }
}
