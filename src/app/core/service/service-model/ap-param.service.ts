import {Injectable} from "@angular/core";
import {BasicService} from "../utils/basic.service";
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApParamService extends BasicService {

  API = `${environment.API_GATEWAY_ENDPOINT}`

  getByParenCode(parentCode: string): Observable<any> {
    return this.getRequest(`${this.API}ap-param?parentCode=${parentCode}`)
  }

  getById(id: any): Observable<any> {
    return this.getRequest(`${this.API}ap-param/${id}`);
  }

  getByType(type: string): Observable<any> {
    return this.getRequest(`${this.API}ap-param-order-value?type=${type}`)
  }

}
