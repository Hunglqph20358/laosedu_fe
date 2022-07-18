import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BasicService} from '../utils/basic.service';
import {IResponse} from '../model/response.model';

@Injectable({
  providedIn: 'root',
})
export class ContactGroupService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}group-teachers`;
  private API_DETAILS = `${environment.API_GATEWAY_ENDPOINT}group-teacher-details`;
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
    const params: any = {groupTeacherDTOList: data.listGroupDelete}
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
    const url = this.API + `/message/send`;
    return this.http.post<any>(url, formData);
  }

  getListTeacherTreeView(searchText?): Observable<HttpResponse<any>> {
    const params: any = {};
    if (searchText) params.keySearch = searchText;
    return this.http.get<HttpResponse<any>>(this.API + '/tree-view/list', {observe: 'response', params});
  }

  getListTreeView(data?: any): Observable<HttpResponse<any>> {
    const params: any = {};
    params.keySearch = data?.keySearch;
    return this.http.get<HttpResponse<any>>(this.API + '/list', {params, observe: 'response'});
  }

  getGroupTeacherDetailsList(data?: any): Observable<IResponse> {
    const params: any = {};

    return this.http.post<IResponse>(this.API_DETAILS + '/list', data, {params});
  }
}
