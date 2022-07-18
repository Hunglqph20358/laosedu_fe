import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BasicService} from '../utils/basic.service';
import {IResponse} from '../model/response.model';

@Injectable({
  providedIn: 'root',
})
export class ContactGroupParentService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}group-parents`;
  private API_DETAILS = `${environment.API_GATEWAY_ENDPOINT}group-parents-details`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    }),
  };
  private delete = new BehaviorSubject<boolean>(false);
  delete$ = this.delete.asObservable();

  private update = new BehaviorSubject<boolean>(false);
  update$ = this.update.asObservable();

  constructor(
    private http: HttpClient
  ) {
    // @ts-ignore
    super();
    const userToken = localStorage.getItem(environment.authTokenKey);
    this.httpOptions.headers.set('Authorization', 'Bearer ' + userToken);
  }

  onSearch(data?: any): Observable<HttpResponse<IResponse>> {
    let api = '/search?page=' + data.page + '&size=' + data.size;
    if (data.field && data.direction) {
      api += '&sort=' + data.field + ',' + data.direction;
    }
    return this.http.post<IResponse>(this.API + api, data, {
      observe: 'response',
    });
  }

  doSearch(data?: any): Observable<IResponse> {
    const params: any = {page: data.page - 1, size: data.size};

    params.sort = data.sort;

    return this.http.post<IResponse>(this.API + '/do-search', data, {params});
  }

  doSearchDetails(data?: any): Observable<IResponse> {
    const params: any = {page: data.page - 1, size: data.size};

    params.sort = data.sort;

    return this.http.post<IResponse>(this.API_DETAILS + '/search', data, {params});
  }

  deleteContactGroup(data: any) {
    const url = this.API + `/delete`;
    const params: any = {groupParentsDTOList: data.listGroupDelete}
    return this.http.post<any>(url, params, this.httpOptions);
  }

  changeIsDelete(value: boolean) {
    this.delete.next(value);
    console.log('delete changed', value);
  }

  changeUpdate(value: boolean) {
    this.update.next(value);
    console.log('delete changed', value);
  }

  add(data: any) {
    const url = this.API + `/create`;
    return this.http.post<any>(url, data, this.httpOptions);
  }

  sendMail(formData: FormData) {
    const url = environment.API_GATEWAY_ENDPOINT + `history-contact-parents/message/send`;
    return this.http.post<any>(url, formData);
  }

  getListParentTreeView(currentYear): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.API + '/school/class/details?currentYear='+currentYear, {observe: 'response'});
  }

  getListTreeView(data?: any): Observable<HttpResponse<any>> {
    const params: any = {};
    params.currentYear = data?.currentYear;
    return this.http.get<HttpResponse<any>>(this.API + '/contact-group/details', {params, observe: 'response'});
  }

  countMess(groupCode: string, currentYear: string): Observable<any>{
    const url = environment.API_GATEWAY_ENDPOINT + `history-contact-parents/mess-sent/count?groupCode=${groupCode}&currentYear=${currentYear}`;
    return this.http.get<any>(url);
  }

  findAllClassRoomOfGrade(listId: any){
    return this.http.post<any>(`${environment.API_GATEWAY_ENDPOINT}` + 'classRoom/count', listId, this.httpOptions);
  }

}
