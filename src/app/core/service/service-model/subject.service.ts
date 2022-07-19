import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotiService} from './notification.service';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {SubjectModel} from '../model/subjects.model';
import {SubjectsReceiveDataModel} from '../model/subjects-receive-data.model';
import * as moment from 'moment';
import {CommonServiceService} from '../utils/common-service.service';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private API = `${environment.API_GATEWAY_ENDPOINT}system/school/`;
  // private API = 'http://13.212.112.239:8083/api/'
  // private API = `http://localhost:8080/api/system/school/`;

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

  findById(id: any): Observable<any>{
    return this.httpClient.get<SubjectModel>(`${this.API}subjects/${id}`);
  }

  findAllSubjectNotConfScoreSubject(gradeLevel: any, supType: any, year: any): Observable<any>{
    const url = this.API + `subjects/all-subject-not-conf-score-subject?grade-level=${gradeLevel}&sup-type=${supType}&year=${year}`
    return this.httpClient.get<any[]>(url);
  }
}
