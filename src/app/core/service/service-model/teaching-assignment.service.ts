import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotiService } from './notification.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
// import { GradeLevelModel } from '../model/grade-level.model';

@Injectable({
  providedIn: 'root',
})
export class TeachingAssignmentService {
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

  doSearch(dataSearch, page, perPage): Observable<any> {
    return this.httpClient.post<any[]>(
      `${this.API}teaching-assignments/do-search?page=${
        page - 1
      }&size=${perPage}`,
      dataSearch,
      this.httpOptions
    );
  }

  downloadSampleFile(currentYear) {
    return this.httpClient.get(
      `${this.API}teaching-assignments/sample-file?year=${currentYear}`,
      { responseType: 'blob' }
    );
  }

  importFile(file: any, currentYear) {
    const formData: FormData = new FormData();
    formData.append('file', file ? file : null);
    formData.append('year', currentYear);

    return this.httpClient.post(
      `${this.API}teaching-assignments/upload-file`,
      formData,
      {
        observe: 'response',
      }
    );
  }

  downloadErrorFile(teachingAssignmentDTO: any) {
    return this.httpClient.post(
      `${this.API}teaching-assignments/get-import-error`,
      teachingAssignmentDTO,
      { responseType: 'blob' }
    );
  }

  export(dataSearch: any, currentYear) {
    return this.httpClient.post(
      `${this.API}teaching-assignments/export?year=${currentYear}`,
      dataSearch,
      { responseType: 'blob' }
    );
  }

  deteleTeachingAssignment(id): Observable<any> {
    return this.httpClient.get<any[]>(
      `${this.API}teaching-assignments/delete/${id}`,
      this.httpOptions
    );
  }

  // Move to teacher services
  getAllTeachers() {
    return this.httpClient.get<any>(`${this.API}teacher/getAll`, this.httpOptions);
  }
  doSearchTeachers(name: string) {
    return this.httpClient.get<any>(`${this.API}teacher/do-search?name=${name}`, this.httpOptions);
  }

  // Move to subject services
  getAllSubjects(classId, year) {
    return this.httpClient.get(
      `${this.API}subject-classes/find-by-class-year/${classId}/${year}/`,
      this.httpOptions
    );
  }

  updateTeachingAssignment(dataUpdate) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.httpClient.post(
      `${this.API}teaching-assignments/save`,
      { ...dataUpdate, user: currentUser.fullName },
      { ...this.httpOptions }
    );
  }
}
