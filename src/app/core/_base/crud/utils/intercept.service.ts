// Angular
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
// RxJS
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {tap} from 'rxjs/operators';
import {AuthService} from '../../../auth/_services';
import {ToastrService} from "ngx-toastr";
import {NotiService} from "../../../service/service-model/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {NavigationEnd, Router} from "@angular/router";

@Injectable()
export class InterceptService implements HttpInterceptor {
  private returnUrl: string;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
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

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.checkWhiteList(req.url) && !req.url.includes('api/schools/public')) {
      const appBanner = document.getElementsByClassName('k-notification-content');
      if (!this.authService.isAuthorizedUser && appBanner.length === 0) {
        this.notiService.showNoti(this.translate.instant('AUTH.SESSION.EXPIRED'), 'warning');
        this.authService.logout()
        return;
      }
    }

    const authToken = sessionStorage.getItem(environment.authTokenKey);
    const lang = localStorage.getItem('language');
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'Accept-Language': lang
        }
      });
    } else {
      req = req.clone({
        setHeaders: {
          'Accept-Language': lang
        }
      });
    }
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          sessionStorage.setItem(environment.authTokenKey, res.headers.get('Authorization'));
        }
      })
    );

  }

  checkWhiteList(value) {
    if (value.includes('/api/authenticate') || value.includes('/requestOTP') || value.includes('/verifyOTP')){
      return true
    }
    return false;
  }
}
