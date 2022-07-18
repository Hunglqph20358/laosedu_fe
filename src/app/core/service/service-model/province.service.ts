import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ProvinceModel} from '../model/province.model';

export class ProvinceData{
  items: ProvinceModel[]
}

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  apiGetAllProvince(){
    return this.httpClient.get<ProvinceData>(`${this.API}danh-muc/tinh-thanh/tat-ca`);
  }
}
