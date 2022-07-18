import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {WardsModel} from "../model/wards.model";

export class WardsData{
  items: WardsModel[]
}

@Injectable({
  providedIn: 'root'
})
export class WardsService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private http: HttpClient) { }

  getAllWards(){
    return this.http.get<WardsModel[]>(`${this.API}danh-muc/xa-phuong/tat-ca`)
  }

  getWardsInDistrict(maHuyen: string) {
    return this.http.get<WardsData>(`${this.API}danh-muc/xa-phuong/${maHuyen}`)
  }
}
