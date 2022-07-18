import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {authPasswordFlowConfig} from '../../_config/auth.config';
import * as _ from 'lodash';
import {ConfigurationService} from './configuration.service';
import {UtilityService} from './utility.service';
import {from, Observable} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SecurityService {
  constructor(
    private oauthService: OAuthService,
    private configurationService: ConfigurationService,
    private utilService: UtilityService,
    private router: Router,
    private storageService: StorageService
  ) {
  }

  public Config() {
    // tslint:disable-next-line: max-line-length
    this.oauthService.configure(authPasswordFlowConfig(this.utilService.stripTrailingSlash(this.configurationService.serverSettings.identityUrl)));
    this.oauthService.setStorage(localStorage); // sessionStorage
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.setupAutomaticSilentRefresh();
  }

  public getClaim(): any {
    const dataAccessToken: any = this.getDataFromToken(this.oauthService.getAccessToken());
    const permissions = dataAccessToken.Permission;
    return permissions;
    // return this.oauthService.getIdentityClaims();
  }

  public getEmail(): any {
    const dataAccessToken: any = this.getDataFromToken(this.oauthService.getAccessToken());
    const email = _.values(dataAccessToken.email);
    return email.join('');
    // return this.oauthService.getIdentityClaims();
  }

  public getUserId(): any {
    const dataAccessToken: any = this.getDataFromToken(this.oauthService.getAccessToken());
    const userId = _.values(dataAccessToken.id);
    return userId.join('');
    // return this.oauthService.getIdentityClaims();
  }

  public get IsAuthorized(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public get CurrentUserData(): Observable<any> {
    // return Observable.fromPromise(this.oauthService.loadUserProfile());
    return from(this.oauthService.loadUserProfile());
  }

  public Login(username: string, password: string, id: string): Observable<any> {
    const headers = new HttpHeaders().append('__tenant', id);
    return from(this.oauthService.fetchTokenUsingPasswordFlow(username, password, headers));
  }

  public getToken(): any {
    return this.storageService.retrieve('sessionToken');
  }

  public logoff() {
    this.router.navigate(['/auth/login']);
    document.location.reload();
    this.storageService.remove('sessionToken');
  }

  public isGranted(permission: string): boolean {
    if (!this.IsAuthorized) {
      return false;
    }

    const dataAccessToken: any = this.getDataFromToken(this.oauthService.getAccessToken());
    const permissions = _.values(dataAccessToken.Permission);

    return _.includes(permissions, permission);
  }

  private urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }

    return window.atob(output);
  }

  private getDataFromToken(token: any) {
    let data = {};
    if (typeof token !== 'undefined') {
      const encoded = token.split('.')[1];
      data = JSON.parse(this.urlBase64Decode(encoded));
    }

    return data;
  }
}
