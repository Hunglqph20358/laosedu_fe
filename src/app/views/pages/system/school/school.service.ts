import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NotiService} from '../../../../core/service/service-model/notification.service';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import {HelperService} from '../../../../core/service/utils/helper.service';
import {BasicService} from '../../../../core/service/utils/basic.service';
import {environment} from '../../../../../environments/environment';
import {GradeLevelModel} from '../../../../core/service/model/grade-level.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolServices extends BasicService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  public loading = new BehaviorSubject<any>('next')
  public sideBar = new BehaviorSubject<any>(false)

  constructor(private http: HttpClient, private notiService: NotiService, private commonService: CommonServiceService,
              public helperService: HelperService) {
    super(http, helperService);
  }

  exportData(body, fileName) {
    const url = this.API + `schedule/export`;
    return this.commonService.downloadFile(url, body, null, fileName);
  }

  scheduleExport(body, fileName) {
    const url = this.API + `parents/schedule/export`;
    return this.commonService.downloadFile(url, body, null, fileName);
  }

  exportInbox(body, fileName) {
    const url = this.API + `mailbox/download`;
    return this.commonService.downloadFile(url, body, null, fileName);
  }

  downloadTemplate(year, gradeId, fileName) {
    const url = this.API + `schedule/sample-file?years=${year}&grade-id=${gradeId}`;
    return this.commonService.downloadFileUsingGet(url, null, fileName);
  }

  getYear(year: any): Observable<any> {
    return this.httpClient.get<any>(`${this.API}gradebooks/semester-list`);
  }

  getGradeLevels(): Observable<any> {
    return this.httpClient.get<GradeLevelModel[]>(`${this.API}grade-levels/getAllSort`);
  }

  getClass(body): Observable<any> {
    return this.httpClient.post<any>(`${this.API}class-rooms/find-grade-level-and-years`, body);
  }

  getSubject(body): Observable<any> {
    return this.httpClient.post<any>(`${this.API}schedule/list-subject/autoget-teacher`, body);
  }

  getTeacher(classId): Observable<any> {
    return this.httpClient.post<any>(`${this.API}teaching-assignments/getall?class_id=${classId}`, {});
  }

  onSearch(body) {
    return this.httpClient.post<any>(`${this.API}schedule/search`, body);
  }

  onSearchViewTimeTable(body) {
    return this.httpClient.post<any>(`${this.API}parents/schedule`, body);
  }

  getClassViewTimeTable(body) {
    return this.httpClient.post<any>(`${this.API}parents/getCodeClass`, body);
  }

  onUpdate(body) {
    return this.httpClient.post<any>(`${this.API}schedule/save`, body);
  }

  exportDataErrors(listErr: []) {
    const url = this.API + `schedule/error-import`;
    return this.commonService.downloadFile(url, listErr, null, `DS_Import_Loi.xls`);
  }

  uploadFile(formData: FormData, data) {
    if (data) {
      formData.append('schoolYear', data.years)
      formData.append('semester', data.semester)
      formData.append('gradeLevel', data.gradeLevel)
      formData.append('applyDate', data.applyDate)
    }
    const url = this.API + 'schedule/uploadFile';
    return this.http.post(url, formData);
  }

  searchSchool(code) {
    return this.http.get(`${this.API}schools/public/get-school-by-code/` + code);
  }

  public get schoolInfo() {
    const info = sessionStorage.getItem('schoolInfo')
    return info !== null ? JSON.parse(info) : null;
  }

  updateSchoolInfo(data, file) {
    const formData: FormData = new FormData();
    if (data) {
      const rqStr = JSON.stringify(data);
      formData.append('dto', new Blob([rqStr], {type: 'application/json'}))
      formData.append('logo', file);
    }
    return this.http.post(`${this.API}schools/update-by-code`, formData);
  }

  searchInboxStudent(body) {
    return this.http.post(`${this.API}mailbox-student/received-search`, body);
  }

  searchInboxAdmin(body) {
      return this.http.post(`${this.API}mailbox/sent-search`, body);
  }

  searchInboxReceived(body) {
      return this.http.post(`${this.API}mailbox/received-search`, body);
  }

  getDetailReceived(isDefault, id) {
    return this.http.get(`${this.API}mailbox-student/detail-received/${isDefault}/${id}`);
  }

  getDetailReceivedAdmin(isContactParent, id) {
    return this.http.get(`${this.API}mailbox/detail-sent/${isContactParent}/${id}`);
  }

  getDetailReceivedTeacher(isDefault, id) {
    return this.http.get(`${this.API}mailbox/detail-received/${isDefault}/${id}`);
  }

  searchTotalReceived(body) {
    return this.http.post(`${this.API}mailbox-student/total-received`, body);
  }

  downloadSampleFile(year, gradeId, fileName) {
    const url = this.API + `schedule/sample-file?years=${year}&grade-id=${gradeId}`;
    return this.httpClient.get(
      url,
      { responseType: 'blob' }
    );
  }
}
