import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotiService } from './notification.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BasicService } from '../utils/basic.service';
import { CommonServiceService } from '../utils/common-service.service';
import { SubjectDeclarationComponent } from '../../../views/pages/system/subject-declaration/subject-declaration.component';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}class-rooms`;
  private httpOptions = {
    headers: new HttpHeaders({
        Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    }),
  };

  private update = new BehaviorSubject<boolean>(false);
  update$ = this.update.asObservable();

  private delete = new BehaviorSubject<boolean>(false);
  delete$ = this.delete.asObservable();

  public yearCurrent = new BehaviorSubject<any>('');
  yearCurrent$ = this.yearCurrent.asObservable();

  public listYears = new BehaviorSubject<any>([]);
  listYears$ = this.listYears.asObservable();

  public get isUpdate(): boolean {
    return this.update.getValue();
  }

  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

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

  getAllClassroom(): Observable<any> {
    return this.http.get<any>(this.API, this.httpOptions);
  }
  autoSearchDept(deptDTO: any): Observable<any> {
    const url = this.API + `/auto-search-dept`;
    return this.http.post<any>(url, deptDTO, this.httpOptions);
  }
  autoSearchSubject(subject: any, deptId: number): Observable<any> {
    const url = this.API + `/auto-search-subject?dept-id=${deptId}`;
    return this.http.post<any>(url, subject, this.httpOptions);
  }
  autoSearchTeacher(data): Observable<any> {
    const url = this.API + `/auto-search-teacher`;
    return this.http.post<any>(url,data,  this.httpOptions);
  }
  onSearch(classroomDTO: any, page: number, pageSize: number): Observable<any> {
    const url = this.API + `/search?page=${page}&page-size=${pageSize}`;
    return this.http.post<any>(url, classroomDTO, this.httpOptions);
  }
  export(classroomDTO: any) {
    const url = this.API + `/export`;
    return this.http.post(url, classroomDTO, { responseType: 'blob' });
    // return this.commonService.downloadFile(url, classroomDTO, null, `DS_lophoc_${moment().format('YYYYMMDD').toString()}`);
  }

  addClassroom(classroom: any) {
    const url = this.API;
    return this.http.post<any>(url, classroom, this.httpOptions);
  }
  updateClassroom(classroom: any) {
    const url = this.API + `/update`;
    return this.http.post<any>(url, classroom, this.httpOptions);
  }

  deleteClassroom(id: number) {
    const url = this.API + `/delete/${id}`;
    return this.http.post<any>(url, null, this.httpOptions);
  }

  transferClassroom(
    classroomList: any[],
    year: any,
    nextYear: any
  ) {
    const url =
      this.API +
      `/transfer?year=${year}&next-year=${nextYear}`;
    return this.http.post(url, classroomList, this.httpOptions);
  }

  preTransferClassroom(
    classroomList: any[],
    year: any,
    nextYear: any
  ) {
    const url =
      this.API +
      `/pre-transfer?year=${year}&next-year=${nextYear}`;
    return this.http.post(url, classroomList, this.httpOptions);
  }

  downloadSampleFile() {
    const url = this.API + `/sample-file`;
    return this.http.get(url, { responseType: 'blob' });
  }

  importFile(file: any, isAddNew: any, years: any) {
    const url = this.API + `/uploadFile`;
    const formData: FormData = new FormData();
    formData.append('file', file ? file : null);
    formData.append('isAddNew', isAddNew);
    formData.append('year', years);
    return this.http.post(url, formData, {
      observe: 'response',
    });
  }

  downloadErrorFile(classroomDTO: any) {
    const url = this.API + `/error-classroom-import`;
    return this.http.post(url, classroomDTO, { responseType: 'blob' });
  }

  changeIsUpdate(value: boolean) {
    this.update.next(value);
    console.log('isUpdateClose changed', value);
  }

  changeIsDelete(value: boolean) {
    this.delete.next(value);
    console.log('delete changed', value);
  }

  changeYearCurrent(value: any) {
    this.yearCurrent.next(value);
    // console.log('yearCurrent changed', value);
  }

  changeListYears(value: any) {
    this.listYears.next(value);
    console.log('listYears changed', value);
  }

  findByGradeLevelAndYear(obj: any): Observable<any> {
    return this.http.post(this.API + '/find-grade-level-and-years', obj);
  }

  findByGradeLevelAndYearAndDeptId(obj: any): Observable<any> {
    return this.http.post(this.API + '/grade-years-dept', obj);
  }
  public isLoading(state: boolean): void {
    this.loading.next(state);
  }

  getSubjects(classId: number): Observable<any> {
    return this.http.get(`${this.API}/${classId}/subjects`);
  }

  getByCode(code: any): Observable<any>{
    return this.http.get(`${this.API}/${code}`);
  }

  getByTeacherCodeAndYear(teacherCode: any, year: any): Observable<any>{
    return this.http.get(`${this.API}/findByTeacher?teacherCode=${teacherCode}&year=${year}`);
  }
}
