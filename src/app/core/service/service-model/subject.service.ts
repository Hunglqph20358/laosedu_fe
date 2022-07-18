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

  // url: string = environment.API_GATEWAY_ENDPOINT + '/subjects';
  // url1: string = environment.API_GATEWAY_ENDPOINT + '/subjects';

 //  getAllSubject():Observable<any>{
 //    return this.httpClient.get<SubjectModel[]>(`${this.API}subjects`);
 //  }
 //
 // getSubjects():Observable<any>{
 //    return this.httpClient.get<SubjectsReceiveDataModel[]>(`${this.API}subjectsAll`);
 //  }

  searchSubject(searchObject:any, page: any, pageSize :any ):Observable<any>{
    return this.httpClient.post<any>(`${this.API}subjects/search1?page=${page}&pageSize=${pageSize}`,searchObject,this.httpOptions);
  }

  // searchSubject(searchObject:any, page: any, pageSize :any ):Observable<any>{
  //   return this.httpClient.post<any>(`${this.API}subjects/search`,searchObject,this.httpOptions);
  // }

  apiGetAllSubjectByGradeLevel(gradeLevel : number): Observable<SubjectModel[]>{    return this.httpClient.get<SubjectModel[]>(`${this.API}subjects/gradeLevel/${gradeLevel}`);
  }
  getTypeSubject():Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}subjects/typeSubjects`);
  }

  // tslint:disable-next-line:ban-types
  getDetailSubject(code : any):Observable<any>{
    return this.httpClient.get<any>(`${this.API}subjects/detail?code=${code}`);
  }
  addSubject(Subject: any) {
    return this.httpClient.post<any>(`${this.API}subjects/add`, Subject, this.httpOptions);
  }
 updateSubject(Subject: any) {
    return this.httpClient.post<any>(`${this.API}subjects/update`, Subject, this.httpOptions);
  }
  deleteSubject(Subject: any) {
    return this.httpClient.post<any>(`${this.API}subjects/delete`, Subject, this.httpOptions);
  }
  // getSubjectByGradeLevel(gradelevel: any, subType:any): Observable<any>{
  //   return this.httpClient.get<any[]>(`${this.API}subject/grade-level?sup_type=${gradelevel}&grade_level=${subType}`);
  // }
  export(searchData: any){
    const url = this.API + `subjects/export`;
    // const url = `http://localhost:8080/api/students/export`;
    // const url = `http://13.212.112.239:8083/api/students/export`;
    // const url = this.API + `contacts/export`;
    // const url = `http://localhost:8080/api/contacts/export`;
    return this.httpClient.post(url, searchData,{responseType: 'blob'});
  }


  downloadSampleFile() {
    const url = this.API + `subjects/sample-file`;
    // const url =`http://localhost:8080/api/students/sample-file`;
    return this.httpClient.get(url, {responseType: 'blob'});
  }
  findById(id: any): Observable<any>{
    return this.httpClient.get<SubjectModel>(`${this.API}subjects/${id}`);
  }

  importFile(file: any, isAddNew: any) {
    const url = this.API +`subjects/uploadFile`;
    // const url =`http://localhost:8080/api/students/uploadFile`;
    const formData: FormData = new FormData();
    formData.append('file', file ? file : null);
    formData.append('isAddNew', isAddNew);
    return this.httpClient.post(url, formData, {
      observe: 'response'
    });
  }


  downloadErrorFile(classroomDTO: any) {
    const url = this.API +`subjects/error-subject-import`;
    // const url =`http://localhost:8080/api/students/error-student-import`;
    return this.httpClient.post(url, classroomDTO, {responseType: 'blob'});
  }

  // getListSchoolYear(year : any):Observable<any>{
  //   return this.httpClient.get<any>(`${this.API}school-years/year?year=${year}`);
  // }

  findAllSubjectNotConfScoreSubject(gradeLevel: any, supType: any, year: any): Observable<any>{
    const url = this.API + `subjects/all-subject-not-conf-score-subject?grade-level=${gradeLevel}&sup-type=${supType}&year=${year}`
    return this.httpClient.get<any[]>(url);
  }
}
