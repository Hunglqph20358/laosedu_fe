import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SalaryAllowancesModel} from "../model/salary-allowances.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaryAllowancesService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  addSalaryAllowances(salaryAllowance: SalaryAllowancesModel): Observable<any>{
    return this.httpClient.post(`${this.API}salary-allowances`, salaryAllowance);
  }

  getByTeacherCode(teacherCode: any): Observable<any>{
    return this.httpClient.get(`${this.API}salary-allowances/teacher-code?teacherCode=${teacherCode}`);
  }
}
