import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {NotiService} from './notification.service';
import {environment} from '../../../../environments/environment';
import {GridParam} from '../model/grid-param';
import {BasicService} from '../utils/basic.service';
import {HelperService} from '../utils/helper.service';
import {CommonServiceService} from '../utils/common-service.service';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class AccountService extends BasicService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private inforFind: GridParam;
  private API_TEST = `${environment.API_GATEWAY_ENDPOINT}`;


  constructor(private http: HttpClient, private notiService: NotiService, private commonService: CommonServiceService,
              public helperService: HelperService) {
    super(http, helperService);
  }

  getAllProvince(): Observable<any> {
    return this.getRequest(`${this.API}province/get-all`)
  }

  getProvinceById(id: any): Observable<any> {
    return this.getRequest(`${this.API}province/get-province-by-id/${id}`)
  }

  getDistrictByProvince(prId: string): Observable<any> {
    return this.getRequest(`${this.API}province/get-district-of-province/${prId}`)
  }

}
