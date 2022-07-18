import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {SchoolInformation} from './../models/schoolInformation';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  apiGetAll(): Observable<SchoolInformation[]>{
    return this.httpClient.get<SchoolInformation[]>(`${this.API}diem-truong/tat-ca`);
  }

  apiGet(id: string){
    return this.httpClient.get<SchoolInformation[]>(`${this.API}diem-truong/${id}`);
  }

  apiAdd(createData: SchoolInformation): Observable<SchoolInformation>{
    return this.httpClient.post<SchoolInformation>(`${this.API}diem-truong/tao`, createData);
  }

  apiUpdate(id: string, updateData: SchoolInformation): Observable<SchoolInformation>{
    return this.httpClient.put<SchoolInformation>(`${this.API}diem-truong/sua/${id}`, updateData);
  }

  apiDelete(id: string): Observable<any>{
    return this.httpClient.delete(`${this.API}diem-truong/xoa/${id}`);
  }

  apiDeleteMany(id: string){
    return this.httpClient.delete(`${this.API}diem-truong/xoa-danh-sach`)
  }


}
