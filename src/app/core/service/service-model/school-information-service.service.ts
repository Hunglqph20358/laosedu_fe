import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {SchoolInformation} from './../models/schoolInformation';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolInformationServiceService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  apiGetAll(): Observable<SchoolInformation[]>{
    return this.httpClient.get<SchoolInformation[]>(`${this.API}diem-truong/tat-ca`);
  }

  apiGet(id: string){
    return this.httpClient.get<SchoolInformation[]>(`${this.API}diem-truong/${id}`);
  }

  apiAdd(createData: SchoolInformation){
    return this.httpClient.post<SchoolInformation>(`${this.API}diem-truong`, createData);
  }

  apiUpdate(id: string, updateData: SchoolInformation){
    return this.httpClient.put<SchoolInformation>(`${this.API}diem-truong/${id}`, updateData);
  }

  apiDelete(id: string){
    return this.httpClient.delete(`${this.API}diem-truong/xoa/${id}`);
  }

  apiDeleteMany(id: string){
    return this.httpClient.delete(`${this.API}diem-truong/xoa-danh-sach`)
  }
}
