import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {NotiService} from './notification.service';
import {environment} from '../../../../environments/environment';
import {ComparisonOperator, FilterItems, GridParam, SortDirection} from '../model/grid-param';
import {catchError, map, tap} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';
import {BasicService} from '../utils/basic.service';
import {HelperService} from '../utils/helper.service';
import { CommonServiceService } from '../utils/common-service.service';
import { Teacher } from '../model/teacher.model';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})

export class TeacherService extends BasicService{

  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private inforFind: GridParam;
  private API_TEST = `${environment.API_GATEWAY_ENDPOINT}`;


  constructor(private http: HttpClient, private notiService: NotiService,private commonService: CommonServiceService,
              public helperService: HelperService) {
    super(http,helperService);
  }

  searchData(dto){
    return this.http.post(`${this.API}teachers/search`, dto);
  }

  exportTemplate() {
    const url = this.API + `teachers/exportTemplate`;
    return this.commonService.downloadFile(url, null, null, `DS_CBGV_${moment().format('DDMMYYYY').toString()}`);
  }
  exportData(dto) {
    const url = this.API + `teachers/exportData`;
    return this.commonService.downloadFile(url, dto, null, `DS_CBGV_${moment().format('DDMMYYYY').toString()}`);
  }
  exportDataErrors(listErr: []){
    const url = this.API + `teachers/exportDataErrors`;
    return this.commonService.downloadFile(url, listErr, null, `DS_Import_Loi`);
  }

  getParentDeptNull(){
    return this.http.get(`${this.API}teachers/getParentDeptNull`).toPromise();
  }

  getAllPosition(){
    return this.http.get(`${this.API}teachers/getAllPosition`).toPromise();
  }

  getDeptByParent(id){
    return this.http.get(`${this.API}teachers/getDeptByParent?id=${id}`).toPromise();
  }

  upload(formData: FormData, typeImport) {
    return this.http.post(`${this.API}teachers/import?typeImport=${typeImport}`, formData);
  }

  data(type: string){
    return this.http.get<any>(`${this.API}ap-param?type=${type}`);
  }

  dataDept(role){
    const lStorage: any = JSON.parse(localStorage.getItem('currentUser'))
    const url = role === 2 ? 'departments/getAll' : `teachers/${lStorage.login}/departments/tree`
    return this.http.get<any>(this.API + url);
  }

  onSearch(body) {
    return this.http.post<any>(`${this.API}teacher-rating/do-search`, body);
  }

  fileSelfAssessment(pathFile, fileName) {
    // url = this.API + ( url && true ? url.replace('/api/', '') : url );
    const pathFileSplit = pathFile?.split("/")
    return this.commonService.downloadFile(`${this.API}teacher-rating/download`, {pathFile: pathFile}, null, pathFileSplit[pathFileSplit.length - 1]);
  }

  fileSelfAssessmentTemplate(url, fileName) {
    url = this.API + url;
    return this.commonService.downloadFile(url, null, null, fileName);
  }

  uploadTeacherRatings(formData: FormData, url, score?, year?) {
    if(score){
      formData.append('score', score.toString())
      formData.append('year', year)
    }
    url = this.API + url;
    return this.http.post(url, formData);
  }

  uploadSampleFile(formData: FormData) {
    return this.http.post(`${this.API}teacher-rating/upload/sample-file`, formData);
  }

  reject(data, isApprove: boolean) {
    let url = isApprove ? `${this.API}teacher-rating/reject-approve` : `${this.API}teacher-rating/reject-rate`
    return this.http.post(url, data)
  }

  getCurrentSampleFile() {
    return this.http.get(`${this.API}ap-param?type=RATE_FILE`)
  }

  approve(body) {
    const url = this.API + 'teacher-rating/approve';
    return this.http.post(url, body);
  }

  create(data){
    return this.http.post(`${this.API}teachers/add`, data);
  }

  getInforById(id){
    return this.http.post(`${this.API}teachers/getInforById/${id}`, {}).toPromise();
  }

  getAuthority(): Observable<any>{
      return this.http.get<any>(`${this.API}authority/teacher`);
  }

  getTeacherByCode(code: any): Observable<any>{
    return this.http.get<any>(`${this.API}teacher/getCode/${code}`);
  }

  getTeacherByPhone(phone: any): Observable<any>{
    return this.http.get<any>(`${this.API}teacher/getPhoneNumber?phone=${phone}`);
  }
  getAllTeacher(){
    return this.http.get<any>(`${this.API}teacher/getAll`);
  }

  updateTeacher(id:any, addTeacher: any):Observable<any>{
    return this.http.put(`${this.API}teachers/update/${id}`, addTeacher);
  }

  getDepartmentsById(id: any): Observable<any>{
    return this.http.get(`${this.API}departments/${id}`);
  }

  viewFile(path: any) {
    return this.http
      .post<any>(`${this.API}teacher/profile`, path,{ responseType: 'arraybuffer' as 'json' });
  }

  getTeacherByTeacherCode(code: any): Observable<any>{
    return this.http.get(`${this.API}teacher/${code}`);
  }

  getDepartmentByCode(code: any):Observable<any>{
    return this.http.get(`${this.API}departments/getDepartmentName/${code}`);
  }
}
