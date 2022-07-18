import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubjectDeclarationService{

  constructor(private http: HttpClient,
              private commonService: CommonServiceService) {

  }

  public getGrade(){
    return this.http.get(this.SERVICE_URL+'grade-levels/getAllSort');
  }

  public getDepartment(){
    return this.http.get(this.SERVICE_URL+'departments/getlist');
  }

  public getClassRoom(deptId: number, gradeLevel: number, year: string) {
    return this.http.get<any>(`${this.SERVICE_URL}class-rooms/getlist/${deptId}/${gradeLevel}/${year}`);
  }

  public getData(obj: any, page: any, size: any){
    return this.http.post<any>(`${this.SERVICE_URL}subject-classes/list?page=${page -1}&size=${size}`,obj);
  }

  public exportFile(obj: any){
    const url = this.SERVICE_URL +'subject-classes/export';
    return this.http.post(url, obj, {responseType: "blob"});
      }

  public updateData(obj: any[], saveAllGrade: number, saveAllDept: number, gradeLevel: number, deptId: number){
    return this.http.post<any>(`${this.SERVICE_URL}subject-classes/updatedata`+'?saveAllGrade='+saveAllGrade+'&saveAllDept='+saveAllDept+'&gradeLevel='+gradeLevel+'&deptId='+deptId,obj);
  }

  public saveAllGrade(obj:[], gradeLevel: number){

    return this.http.post<any>(`${this.SERVICE_URL}subject-classes/save-all-grade`+'?gradeLevel='+gradeLevel,obj);
  }

  public saveAllDeptId(obj:[], deptId: number){

    return this.http.post<any>(`${this.SERVICE_URL}subject-classes/save-all-dept`+'?deptId='+deptId,obj);
  }


  get SERVICE_URL(): string{
      return environment.API_GATEWAY_ENDPOINT;
  }
}
