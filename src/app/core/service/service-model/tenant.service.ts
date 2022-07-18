import {environment} from '../../../../environments/environment';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TenantListResponse} from '../model/tenant-list.response';
import {HttpClient} from '@angular/common/http';
import {CommonResponseModel} from '../model/common-response.model';


const SERVER_API_URL = environment.API_GATEWAY_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  resourceURL = 'multi-tenancy/tenants';

  constructor(protected http: HttpClient) {
  }

  getAllTenants(): Observable<CommonResponseModel[]> {
    return this.http.get<CommonResponseModel[]>(`${SERVER_API_URL}${this.resourceURL}/all`);
  }
}
