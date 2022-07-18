import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BasicService} from "../utils/basic.service";
import {NotiService} from "./notification.service";
import {CommonServiceService} from "../utils/common-service.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigPointLockService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}conf-entry-keys`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  }
  private lockConf = new BehaviorSubject<boolean>(false);
  lockConf$ = this.lockConf.asObservable();

  private unlockConf = new BehaviorSubject<boolean>(false);
  unlockConf$ = this.unlockConf.asObservable();

  private updateConf = new BehaviorSubject<boolean>(false);
  updateConf$ = this.updateConf.asObservable();

  private transferSemester = new BehaviorSubject<any>('');
  transferSemester$ = this.transferSemester.asObservable();

  private transferGrade = new BehaviorSubject<any>({});
  transferGrade$ = this.transferGrade.asObservable();

  private isConfigLock = new BehaviorSubject<boolean>(false);
  isConfigLock$ = this.isConfigLock.asObservable();

  constructor(private http: HttpClient,
              private notiService: NotiService,
              private commonService: CommonServiceService) {
    // @ts-ignore
    super();
  }

  getListSemesterOfSchoolYear(years:string):Observable<any>{
    return this.http.get<any>(`${this.API}/school-year/semester?year=${years}`, this.httpOptions);
  }

  getListGradeLevelToSearch():Observable<any>{
    return this.http.get<any>(`${this.API}/grade-level-list`, this.httpOptions);
  }

  getGradeListUnconfiguredList(semester:any, years:any):Observable<any>{
    return this.http.get<any>(`${this.API}/grade-level-unconfigured-list?semester=${semester}&years=${years}`, this.httpOptions);
  }

  loadGridView(semester:string, gradeCode:string, years:string, page:any, pageSize:any):Observable<any>{
    return this.http.get<any>(`${this.API}/conf-entry-key-detail-list?semester=${semester}&grade-code=${gradeCode}&years=${years}&page=${page}&page-size=${pageSize}`, this.httpOptions);
  }

  loadGridViewPopupCreateConfigLockPoint(semester:string, years:string, gradeCode:string):Observable<any>{
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`${this.API}/type-subject-and-score-name-list?semester=${semester}&years=${years}&grade-code=${gradeCode}`, this.httpOptions);
  }

  createConfigLock(listData:any, applyAll:boolean):Observable<any>{
    return this.http.post<any>(`${this.API}/config-lock-point?apply-all=${applyAll}`, listData, this.httpOptions);
  }

  unlock(data:any):Observable<any>{
    return this.http.post<any>(`${this.API}/config-lock-point/unlock`, data, this.httpOptions);
  }

  unlockList(data:any):Observable<any>{
    return this.http.post<any>(`${this.API}/config-lock-point/unlock-list`, data, this.httpOptions);
  }

  lock(data:any):Observable<any>{
    return this.http.post<any>(`${this.API}/config-lock-point/lock`, data, this.httpOptions);
  }

  lockList(data:any):Observable<any>{
    return this.http.post<any>(`${this.API}/config-lock-point/lock-list`, data, this.httpOptions);
  }

  getConfEntryLockByIdDetail(id: number) {
    return this.http.get <any>(`${this.API}/conf-entry-key?id-cek-detail=${id}`, this.httpOptions)
  }

  updateConfigLock(data:any):Observable<any>{
    return this.http.post<any>(`${this.API}/update-entry-lock-date`, data, this.httpOptions);
  }

  getEndDateConfigLock(id:any):Observable<any>{
    return this.http.get<any>(`${this.API}/end-date-school-year?id-conf-entry-key-detail=${id}`, this.httpOptions);
  }

  checkNumberDayNotify(numberDay:any):Observable<any>{
    return this.http.get<any>(`${this.API}/number-day-notify?day=${numberDay}`, this.httpOptions);
  }

  configNotify(numberDay:any):Observable<any>{
    return this.http.get<any>(`${this.API}/config-notify?day=${numberDay}`, this.httpOptions);
  }

  getGradeLevelByCode(gradeCode:any):Observable<any>{
    return this.http.get<any>(`${this.API}/get-grade-by-code?code=${gradeCode}`, this.httpOptions);
  }

  getSchoolYearByYearAndSemester(years: any, semester: any) {
    return this.http.get<any>(`${this.API}/get-school-years?years=${years}&semester=${semester}`, this.httpOptions);
  }

  checkIsConfig(years: any, semester: any, grade:any) :Observable<any>{
    return this.http.get<any>(`${this.API}/is-config?years=${years}&semester=${semester}&grade=${grade}`, this.httpOptions);
  }

  getDayBefore() :Observable<any>{
    return this.http.get<any>(`${this.API}/before-notify`, this.httpOptions);
  }
  changeIsLock(value: boolean) {
    this.lockConf.next(value);
    console.log('lockConf changed', value);
  }

  changeIsUnlock(value: boolean) {
    this.unlockConf.next(value);
    console.log('unlockConf changed', value);
  }

  changeIsUpdate(value: boolean) {
    this.updateConf.next(value);
    console.log('update changed', value);
  }

  tranferSemester(value: any) {
    this.transferSemester.next(value);
  }

  transferGradeLevel(value: any) {
    this.transferGrade.next(value);
  }

  changeIsConfig(value: boolean) {
    this.isConfigLock.next(value);
    console.log('isConfigLock changed', value);
  }

  testExport(data) {
    const url = `${environment.API_GATEWAY_ENDPOINT}schedule/export`;
    return this.http.post(url, data, { responseType: 'blob' });
  }
}
