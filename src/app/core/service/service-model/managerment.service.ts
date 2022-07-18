import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ItemManagerment} from '../model/item-managerment.model';

@Injectable({
  providedIn: 'root'
})

export class ManagermentService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`
  constructor(private http: HttpClient) {
  }

  getManagerments(): Observable<ItemManagerment> {
    return this.http.get<ItemManagerment>(`${this.API}can-bo/tat-ca`)
  }
}
