import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotiService } from './notification.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BasicService } from '../utils/basic.service';
import { CommonServiceService } from '../utils/common-service.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class StudentsService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  // private API = `${environment.AUTH_SERVER}/api/`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  }

  private changeIsShowUpdate = new BehaviorSubject<boolean>(false);
  changeIsShowUpdate$ = this.changeIsShowUpdate.asObservable();

  private changeValueRank = new BehaviorSubject<any>(null);
  changeValueRank$ = this.changeValueRank.asObservable();

  private isAllSelected = new BehaviorSubject<boolean>(false);
  isAllSelected$ = this.isAllSelected.asObservable();

  // private autoCheckedRow = new BehaviorSubject<boolean>(false);
  // autoCheckedRow$ = this.autoCheckedRow.asObservable();

  private changeScoreGradeBook = new BehaviorSubject<any>(null);
  changeScoreGradeBook$ = this.changeScoreGradeBook.asObservable();

  private checkBoxHeader = new BehaviorSubject<string>('');
  checkBoxHeader$ = this.checkBoxHeader.asObservable();

  constructor(
    private http: HttpClient,
    private notiService: NotiService,
    private commonService: CommonServiceService
  ) {
    // @ts-ignore
    super();
  }
  doSearch(obj): Observable<any> {
    return this.http.post(this.API + 'students/do-search', obj)
  }

  getListSchoolYear(year: any): Observable<any> {
    return this.http.get<any>(`${this.API}school-years/year?year=${year}`, this.httpOptions);
  }

  getSchoolYear(): Observable<any> {
    return this.http.get<any>(`${this.API}school-years/getYear`, this.httpOptions);
  }

  getSemesterOfYearNow(): Observable<any> {
    return this.http.get<any>(`${this.API}school-years/getSemesterOfYearNow`, this.httpOptions);
  }

  getClassOfGrade(classCode: any, year: any): Observable<any> {
    return this.http.get<any>(`${this.API}students/getAllClassRoomOtherOfGrade/${classCode}/${year}`);
  }

  getClassName(studentCode: any, year: any): Observable<any> {
    return this.http.get<any>(`${this.API}students/getClassByStudentCode/${studentCode}/${year}`);
  }

  addRLStudent(RLStudent: any) {
    return this.http.post<any>(`${this.API}reserve-leave-schools`, RLStudent, this.httpOptions);
  }

  getTeacherByClassId(id: any) {
    return this.http.get<any>(`${this.API}class-rooms/${id}/teacher`, this.httpOptions);
  }

  getStudentByIdOrCode(id: string | number, year: string) {

    return this.http.post<any>(`${this.API}students/profile/`, {code: id, years: year} , this.httpOptions);
  }

  createStudent(body: any) {
    return this.http.post<any>(`${this.API}students`, body, this.httpOptions);
  }

  updateStudent(id: any, body: any) {
    return this.http.put<any>(`${this.API}students/${id}`, body, this.httpOptions);
  }

  upload(body: any) {
    return this.http.post<any>(`${this.API}students/upload-image`, body);
  }

  createContactStudent(body: any) {
    return this.http.post<any>(`${this.API}contacts/all`, body, this.httpOptions);
  }

  transferClasses(body: any) {
    return this.http.post<any>(`${this.API}transfer-classes`, body, this.httpOptions);
  }

  importStudent(body: any) {
    const formData: FormData = new FormData();
    formData.append('file', body.file);
    formData.append('isAddNew', body.isAddNew);
    return this.http.post<any>(`${this.API}students/uploadFile`, formData, { observe: 'response' });
  }

  export(query: any) {
    const url = this.API + `students/export`;
    return this.http.post(url, query, { responseType: 'blob' });
  }

  exportSample() {
    const url = this.API + `students/sample-file`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getStudentReserveLatest(studentCode: any, years : any){
    return this.http.get<any>(`${this.API}students/reserve-leave-school/StudentReserve/${studentCode}/${years}`);
  }

  getStudentReserve(studentCode: any, years : any){
    return this.http.post<any>(`${this.API}students/reserve-leave-school/StudentReserve`, {code: studentCode, years: years});
  }

  getStudentStopStudyingLatest(studentCode: any, years : any) {
    return this.http.post<any>(`${this.API}students/reserve-leave-school/StudentStopStudying`, {code: studentCode, years: years});
  }
  exportDataErrors(listErr) {
    const url = this.API + `students/error-student-import`;
    return this.http.post(url, listErr, { responseType: 'blob' });
  }

  // ==================================XEM HỒ SƠ=====================================//
  getRwDcl(data): Observable<any> {
    return this.http.post<any>(`${this.API}rw-dcl-student/student-and-type`, data, this.httpOptions);
  }

  getAllDiscipline(code: any, year: any): Observable<any> {
    return this.http.get<any>(`${this.API}dcl-student/getRwDclStudentProfile/${code}&${year}`, this.httpOptions);
  }

  getAllClassRoomByStudentCode(code: any): Observable<any> {
    return this.http.post<any>(`${this.API}class-room/student-code`, {studentCode: code}, this.httpOptions);
  }

  getAllExemption(code: any, year: any): Observable<any> {
    return this.http.post<any>(`${this.API}subject-exemptions/getSubjectExemptionsOfStudent/student-and-year`, {studentCode: code, schoolYear: year}, this.httpOptions);
  }

  getAllReserve(body: any): Observable<any> {
    return this.http.post<any>(`${this.API}reserve-leave-schools/do-search/type-reserve`, body, this.httpOptions);
  }

  getAllLeaveSchool(body: any): Observable<any> {
    return this.http.post<any>(`${this.API}reserve-leave-schools/do-search/type-leave`, body, this.httpOptions);
  }

  getSemesterGrid(body): Observable<any> {
    return this.http.post<any>(`${this.API}students/student-score/grid/semester`, body, this.httpOptions);
  }

  getScoreGrid(body): Observable<any> {
    return this.http.post<any>(`${this.API}students/student-score/grid/score`, body, this.httpOptions);
  }

  getRankGrid(body): Observable<any> {
    return this.http.post<any>(`${this.API}students/student-score/grid/score-rank`, body, this.httpOptions);
  }

  // ==================================END XEM HỒ SƠ=====================================//

  // ==================================SỔ ĐIỂM=====================================//
  getAllGradebook(body): Observable<any> {
    return this.http.post<any>(`${this.API}gradebooks/on-search?page=${body.page}&page-size=${body.pageSize}`, body, this.httpOptions);
  }

  getAllSemester(): Observable<any> {
    return this.http.get<any>(`${this.API}gradebooks/semester-list`, this.httpOptions);
  }

  getAllSemesterBySubject(query): Observable<any> {
    return this.http.post<any>(`${this.API}gradebooks/semester-list-by-subject`, query, this.httpOptions);
  }

  getAllClassRoom(query): Observable<any> {
    return this.http.post<any>(`${this.API}gradebooks/classroom-list`, query, this.httpOptions);
  }

  getAllSubject(query): Observable<any> {
    return this.http.post<any>(`${this.API}gradebooks/subject-list?semester`, query, this.httpOptions);
  }

  getTimeLockPoint(body): Observable<any> {
    return this.http.post<any>(`${this.API}gradebooks/time-lock-point`, body, this.httpOptions);
  }

  exportGradebooks(query: any) {
    const url = this.API + `gradebooks/export`;
    return this.http.post(url, query, { responseType: 'blob' });
  }

  save(body): Observable<any> {
    return this.http.post<any>(`${this.API}gradebooks/save`, body, this.httpOptions);
  }

  evaluateStudent(body: any): Observable<any> {
    return this.http.post<any>(`${this.API}gradebooks/evaluate`, body, this.httpOptions);
  }

  changeValueScoreRank(value: any) {
    this.changeValueRank.next(value);
  }

  changeIsShowUpdateGradeBook(value:boolean) {
    this.changeIsShowUpdate.next(value);
  }

  changeIsSelectedALl(val: boolean) {
    this.isAllSelected.next(val);
  }

  changeScoreGradeBookValue(val: any) {
    this.changeScoreGradeBook.next(val);
  }

  changeCheckStatusBox(val: string) {
    this.checkBoxHeader.next(val);
  }
  // ==================================END SỔ ĐIỂM=====================================//

  loadImage(imagePath) {
    return this.http.post(`${this.API}students/load-image`, {avatar: imagePath})
  }
}
