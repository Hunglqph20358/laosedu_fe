import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {NotiService} from './notification.service';
import {environment} from '../../../../environments/environment';
import {ComparisonOperator, FilterItems, GridParam, SortDirection} from '../model/grid-param';
import {error} from '@angular/compiler/src/util';
import {BasicService} from '../utils/basic.service';
import {HelperService} from '../utils/helper.service';
import { Department } from '../model/department.model';
import { CommonServiceService } from '../utils/common-service.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})

export class DepartmentService extends BasicService{
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private inforFind: GridParam;
  changeData;

  constructor(private http: HttpClient, private notiService: NotiService,private commonService: CommonServiceService,
  public helperService: HelperService) {
    super(http,helperService);
  }


  addDepartment(department: Department) {
    return this.http.post<any>(`${this.API}departments/create`, department);
  }

  updateDepartment(department: Department) {
    return this.http.post<any>(`${this.API}departments/update`, department);
  }

  deleteListDepartment(listId: string[]): Observable<any> {
    return this.http.post(`${this.API}bo-mon/xoa-danh-sach`, listId);
  }
  apiGetAll(){
    return this.http.get(`${this.API}departments/getAll`).toPromise();
  }

  apiGetForUpdate(id : any){
    return this.http.get(`${this.API}departments/getForUpdate/${id}`).toPromise();
  }

  apiGetDataTree(code, name, type, typeSearch){
    // let params = '?';
    // params += !!code ? `code=${code}&` : "";
    // params += !!name ? `name=${name}&` : "";
    // params += !!type ? `type=${type}&` : "";
    // params += !!typeSearch ? `typeSearch=${typeSearch}&` : "";
    let param = {
      code: code,
      name: name,
      type: type,
      typeSearch: typeSearch
    }
    return this.http.post(`${this.API}departments/search`, param).toPromise();
  }

  getTypeUnit(depId: number){
    let params = '?';
    params += !!depId ? `depId=${depId}&` : "";
    return this.http.get(`${this.API}departments/getTypeUnit${params}`).toPromise();
  }

  getTeacherByDept(depId: number){
    let params = '?';
    params += !!depId ? `depId=${depId}&` : "";
    return this.http.get(`${this.API}departments/getTeacherByDept${params}`).toPromise();
  }

  checkExistDept(depId: number){
    return this.http.get(`${this.API}departments/checkExistDept?depId=${depId}`).toPromise();
  }
  checkDelete(id){
    return this.http.get(`${this.API}departments/checkDelete?id=${id}`).toPromise();
  }
  deleteSchool(id){
    return this.http.post(`${this.API}departments/delete?id=${id}`,{});
  }
  exportTemplate(fileName: string = 'DS_donvithuoctruong_') {
    const url = this.API + `departments/exportTemplate`;
     return this.commonService.downloadFile(url, null, null, `${fileName}${moment().format('YYYYMMDD').toString()}`);
  }
  exportData(listData, fileName: string = 'DS_donvithuoctruong_') {
    const url = this.API + `departments/exportData`;
     return this.commonService.downloadFile(url, listData, null, `${fileName}${moment().format('YYYYMMDD').toString()}`);
  }
  getDepartmentForSubject(): Observable<any> {
    return this.http.get<any[]>(`${this.API}departments/deptId`);
  }

  upload(formData: FormData, typeImport) {
    return this.http.post(`${this.API}departments/import?typeImport=${typeImport}`, formData);
  }

  exportDataErrors(listErr: []){
    const url = this.API + `departments/exportDataErrors`;
     return this.commonService.downloadFile(url, listErr, null, `DS_Import_Loi`);
  }
  getDepartmentByCondition(): Observable<any> {
    return this.http.get<any[]>(`${this.API}departments/getListForSubject`);
  }
}
