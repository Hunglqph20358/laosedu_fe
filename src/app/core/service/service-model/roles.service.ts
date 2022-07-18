import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Roles} from '../../../views/pages/system/role-management/model/Roles';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private API = `${environment.API_GATEWAY_ENDPOINT}identity`;

  constructor(private http: HttpClient) { }
  fetchRoles() {
    return this.http.get<any>(`${this.API}/roles/all`);
  }

  deleteRole(id: string) {
    return this.http.delete(`http://103.226.248.209:65115/api/identity/roles/${id}`);
  }

  addRole(payload: Roles) {
    return this.http.post<Roles>('http://103.226.248.209:65115/api/identity/roles', payload);
  }

  updateRole(payload: Roles, id: string) {
    return this.http.put<Roles>(`http://103.226.248.209:65115/api/identity/roles/${id}`, payload);
  }

}
