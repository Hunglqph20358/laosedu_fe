import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {DistrictModel} from '../model/district.model';
import {Observable} from 'rxjs';

export class DistrictData{
  items: DistrictModel[]
}

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  apiGetAllDistrictByIdProvince(idProvince : string): Observable<DistrictData>{
    return this.httpClient.get<DistrictData>(`${this.API}danh-muc/quan-huyen/${idProvince}`);
  }
}
