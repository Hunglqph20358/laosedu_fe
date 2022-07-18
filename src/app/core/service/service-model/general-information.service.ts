import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TenantModel} from '../model/tenant.model';

@Injectable({
  providedIn: 'root'
})

export class GeneralInformationService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  constructor(private http: HttpClient) {
  }
  getOneGeneralInformation(id: string):Observable<TenantModel>{
    return this.http.get<TenantModel>(`${this.API}multi-tenancy/tenants/${id}`)
  }

  updateGeneralInformation(id: string, payload: TenantModel) {
    return this.http.put<TenantModel>(`${this.API}multi-tenancy/tenants/${id}`, payload)
  }
}
