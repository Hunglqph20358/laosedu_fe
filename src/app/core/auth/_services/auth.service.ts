import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../_models/user.model';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {NavigationEnd, Router} from '@angular/router';
import {NotiService} from '../../service/service-model/notification.service';
import {TranslateService} from "@ngx-translate/core";
import {CommonFunction} from '../../service/utils/common-function';

const API_USERS_URL = 'api/users';
const API_REQUEST_OTP_URL = 'user/requestOTP';
const API_VERIFY_OTP_URL = 'user/verifyOTP';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';
const REFRESH_ENDPOINT = '/api/refreshToken';
const CURRENT_NAME = 'currentUser';

@Injectable()
export class AuthService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private returnUrl: string;
  private currentUserSubject: any;
  public currentUser: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notiService: NotiService,
    private translate: TranslateService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    })
  }

  public get currentUserValue() {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    // this.currentUser = this.currentUserSubject.asObservable();
    if (this.currentUser) {
      localStorage.setItem('currentUser', this.currentUser);
    }
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const user = CommonFunction.getCurrentUser();
        // login successful if there's a jwt token in the response
        if (user && user.jwttoken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(CURRENT_NAME, JSON.stringify(user.currentUser));
          sessionStorage.setItem(environment.authTokenKey, user.jwttoken);
          this.currentUser = JSON.stringify(user.currentUser);
        }
        return user;
  }

  public logout() {
    sessionStorage.setItem(environment.authTokenKey,null);
    // sessionStorage.removeItem(environment.authTokenKey);
    // remove user from local storage to log user out
    localStorage.removeItem(CURRENT_NAME);
    // localStorage.removeItem('language')
    // localStorage.removeItem(CURRENT_NAME);
    this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.returnUrl}});
    // document.location.reload();
  }

  public refreshToken(): Observable<boolean> {
    if (!sessionStorage.getItem(CURRENT_NAME)) {
      // TODO: redirect to login?
      console.log('loi');
      return;
    }

    return this.http.post(REFRESH_ENDPOINT, sessionStorage.getItem(CURRENT_NAME))
      .pipe(
        map(res => {
            sessionStorage.setItem(CURRENT_NAME, JSON.stringify(res));
            return null;
          }
        ))
  }

  getUserByToken(): Observable<User> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userToken);
    return this.http.get<User>(API_USERS_URL, {headers: httpHeaders});
  }

  getAuthToken(): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_NAME));

    if (currentUser != null) {
      return currentUser.accessToken;
    }

    return null;
  }

  register(user: User): Observable<any> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<User>(API_USERS_URL, user, {headers: httpHeaders})
      .pipe(
        map((res: User) => {
          return res;
        }),
        catchError(err => {
          return null;
        })
      );
  }

  public get isAuthorized(): boolean {
    return sessionStorage.getItem(environment.authTokenKey) ? true : false;
  }

  /*
   * Submit forgot password request
   *
   * @param {string} email
   * @returns {Observable<any>}
   */
  public requestPassword(email: string): Observable<any> {
    return this.http.get(API_USERS_URL + '/forgot?=' + email)
      .pipe(catchError(this.handleError('forgot-password', []))
      );
  }

  /*
   * Handle Http operation that failed.
   * Let the app continue.
    *
  * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }

  public requestOTP(phone: string): Observable<HttpResponse<any>> {
    return this.http.get(this.API + API_REQUEST_OTP_URL + '/' + phone, {observe: 'response'});
  }

  public verifyOTP(phone: string, otp: string): Observable<HttpResponse<any>> {
    return this.http.get(this.API + API_VERIFY_OTP_URL + '/' + phone + '/' + otp, {observe: 'response'});
  }

  public changePassword(currentPassword, newPassword) {
    return this.http.post(this.API + 'account/change-password', {currentPassword, newPassword}).pipe(map(res => {
      // login successful if there's a jwt token in the response
      return res;
    }));
    ;
  }

  public get isAuthorizedUser(): boolean {
    return localStorage.getItem('currentUser') ? true : false;
  }
}
