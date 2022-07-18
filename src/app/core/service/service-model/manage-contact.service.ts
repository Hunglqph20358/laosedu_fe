import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotiService } from './notification.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManageContactService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private SCHOOL_CODE = `${environment.SCHOOL_CODE}`;

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

  doSearchContact(dataSearch): Observable<any> {
    return this.httpClient.post<any[]>(
      `${this.API}searchContact`,
      { ...dataSearch },
      this.httpOptions
    );
  }

  export(dataSearch: any) {
    return this.httpClient.post(
      `${this.API}contacts/export`,
      { ...dataSearch},
      { responseType: 'blob' }
    );
  }

  deteleContactPackage(dataDelete): Observable<any> {
    return this.httpClient.post<any[]>(
      `${this.API}register-packages/cancel`,
      dataDelete,
      this.httpOptions
    );
  }

  getPackagesInYear(semester, year): Observable<any> {
    return this.httpClient.get(
      `${this.API}data-packages/${this.SCHOOL_CODE}/${semester}&${year}`,
      this.httpOptions
    );
  }

  getSemesterByYear(year): Observable<any> {
    return this.httpClient.get(
      `${this.API}school-years/year?year=${year}`,
      this.httpOptions
    );
  }

  // http://localhost:8080/api/register-packages/history
  getHistoryPackageByStudent(data): Observable<any> {
    return this.httpClient.post(
      `${this.API}register-packages/history`,
      data,
      this.httpOptions
    );
  }

  // http://localhost:8080/api/register-packages/add
  registerPackage(dataUpdate) {
    return this.httpClient.post(
      `${this.API}register-packages/add`,
      dataUpdate,
      { ...this.httpOptions }
    );
  }


  checkRegisterPackagePass(dataUpdate) {
    return this.httpClient.post(
      `${this.API}register-packages/checkSemester`,
      dataUpdate,
      { ...this.httpOptions }
    );
  }

  // http://localhost:8084/api/register-packages/add
  registerPackageUnitel(dataUpdate) {
    return this.httpClient.post(
      `${this.API}unitel/register-packages/add`,
      dataUpdate,
      { ...this.httpOptions }
    );
  }

  // registerPackageUnitel(data) {
  //   const formData: FormData = new FormData();
  //   if (data) {
  //     const rqStr = JSON.stringify(data);
  //     formData.append('dto', new Blob([rqStr], {type: 'application/json'}))
  //   }
  //   return this.httpClient.post(`${this.API}unitel/register-packages/add`, formData);
  // }

  getSemesterByYearNow(): Observable<any> {
    return this.httpClient.get(
      `${this.API}school-years/getYear`,
      this.httpOptions
    );
  }



}
