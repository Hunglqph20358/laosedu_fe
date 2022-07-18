import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {IdentityUser} from '../model/identityUser';
import {Observable} from 'rxjs';

export class IdentityUserData{
  items: IdentityUser[]
}

@Injectable({
  providedIn: 'root'
})
export class IdentityUserService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  apiGetAllIdentityUserByTenantId(tenantId: string): Observable<IdentityUser[]>{
    return this.httpClient.get<IdentityUser[]>(`${this.API}identity/users/tenant/${tenantId}`);
  }
}
