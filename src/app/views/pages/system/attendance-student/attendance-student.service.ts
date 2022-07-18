import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AttendanceStudentService {

  constructor(private http: HttpClient,
              private commonService: CommonServiceService) {

  }

  public save(obj: any) {
    return this.http.post<any>(this.SERVICE_URL + 'attendance-diligence/save', obj);
  }

  public getHoliday(obj: any) {
    return this.http.post(this.SERVICE_URL + 'holiday', obj);
  }

  public getClassRoom(deptId: number, gradeLevel: number, year: string) {
    return this.http.get<any>(`${this.SERVICE_URL}class-rooms/getlist/${deptId}/${gradeLevel}/${year}`);
  }

  public getClassroomByUserAndYear(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}classroom-by-user-and-year`, obj);
  }

  public exportFile(obj: any) {
    const url = this.SERVICE_URL + 'exportData';
    return this.http.post(url, obj, {responseType: "blob"});
  }

  public updateData(obj: [], saveAllGrade: number, saveAllDept: number, gradeLevel: number, deptId: number) {
    return this.http.post<any>(`${this.SERVICE_URL}subject-classes/updatedata` + '?saveAllGrade=' + saveAllGrade + '&saveAllDept=' + saveAllDept + '&gradeLevel=' + gradeLevel + '&deptId=' + deptId, obj);
  }

  public search(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}search`, obj);
  }

  public getMonthBySemesterAndYear(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}month-by-semester-and-year`, obj);
  }

  public getSemesterByYear(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}semester-by-year`, obj);
  }

  get SERVICE_URL(): string {
    return environment.API_GATEWAY_ENDPOINT;
  }

  public getClassName(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}classname`, obj);
  }
}
