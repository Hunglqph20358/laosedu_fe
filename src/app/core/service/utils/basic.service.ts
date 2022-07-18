import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {never, Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';
import {HelperService} from './helper.service';

@Injectable()
export class BasicService {
  public serviceUrl: string;
  public module: string;
  public systemCode: string;
  credentials: any = {};
  // toastr = AppModule.Toastr;
  // translateService = AppModule.TranslateSV;

  /**
   * init service from system code and module
   * config value of app-config.ts
   * param systemCode
   * param module
   */
  constructor(
    public httpClient: HttpClient,
    public helperService: HelperService,
  ) {
  }
  /**
   * findAll
   */
  public findAll(url:string): Observable<any> {
    return this.getRequest(url);
  }

  /**
   * findOne
   * param id
   */
  public findOne(id: number,url:string): Observable<any> {
    return this.getRequest(url);
  }


  /**
   * deleteById
   * param id
   */
  public deleteById(id: number,url:string): Observable<any> {
    this.helperService.isProcessing(true);
    return this.deleteRequest(url);
  }

  /*******************************/

  /**
   * handleError
   */
  public handleError(error: any) {
    const errorMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errorMsg);
  }

  /**
   * make get request
   */
  public getRequest(url: string, options?: any, func?): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.get(url, options)
      .pipe(
        tap( // Log the result or error
          (res: any) => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
            if (res?.status?.code && res?.status?.code !== '200') {
              this.helperService.showErrors(res.status.message);
              // tslint:disable-next-line:no-unused-expression
              if (func) func(res);
              throw error(res.status.message);
            }
          },
          errors => {
            this.helperService.APP_TOAST_MESSAGE.next(errors);
            this.helperService.isProcessing(false);
            // this.helperService.showUnknowErrors();
          }
        ),
        catchError(this.customHandler)
      );
  }

  public putRequest(url: string, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.put(url, options)
      .pipe(
        tap( // Log the result or error
          (res: any) => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
            if (res?.status?.code && res?.status?.code !== '200') {
              this.helperService.showErrors(res.status.message);
            }
          },
          err => {
            this.helperService.APP_TOAST_MESSAGE.next(err);
            this.helperService.isProcessing(false);
            // this.helperService.showUnknowErrors();
          }
        ),
        catchError(this.handleError)
      );
  }

  /**
   * make post request
   */
  public postRequest(url: string, data?: any, param?: any, func?): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.post(url, data, {params: param})
      .pipe(
        tap( // Log the result or error
          (res: any) => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
            if (res?.status?.code && res?.status?.code !== '200') {
              this.helperService.showErrors(res.status.message);
              // tslint:disable-next-line:no-unused-expression
              if (func) func(res);
              throw error(res.status.message);
            }
          },
          errors => {
            this.helperService.APP_TOAST_MESSAGE.next(errors);
            this.helperService.isProcessing(false);
            // this.helperService.showUnknowErrors();
          }
        ),
        catchError(this.customHandler)
      );
  }

  public postRequestFullResponse(url: string, data?: any, param?: any, func?): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.post(url, data, {params: param, observe: 'response'})
      .pipe(
        tap( // Log the result or error
          (res: any) => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
            if (res?.status?.code && res?.status?.code !== '200') {
              this.helperService.showErrors(res.status.message);
              // tslint:disable-next-line:no-unused-expression
              if (func) func(res);
              throw error(res.status.message);
            }
            if (res?.body?.status?.code && res?.body?.status?.code !== '200') {
              this.helperService.showErrors(res.body.status.message);
              // tslint:disable-next-line:no-unused-expression
              if (func) func(res);
              throw error(res.body.status.message);
            }
          },
          errors => {
            this.helperService.APP_TOAST_MESSAGE.next(errors);
            this.helperService.isProcessing(false);
            // this.helperService.showUnknowErrors();
          }
        ),
        catchError(this.customHandler)
      );
  }

  /**
   * make post request for file
   */
  public postRequestFile(url: string, data?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.post(url, data, {responseType: 'blob'})
      .pipe(
        tap( // Log the result or error
          res => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
          },
          error => {
            this.helperService.APP_TOAST_MESSAGE.next(error);
            this.helperService.isProcessing(false);
          }
        ),
        catchError(this.handleError)
      );
  }

  /**
   * make get request
   */
  public deleteRequest(url: string): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.delete(url)
      .pipe(
        tap( // Log the result or error
          res => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
          },
          error => {
            this.helperService.APP_TOAST_MESSAGE.next(error);
            this.helperService.isProcessing(false);
          }
        ),
        catchError(this.handleError)
      );
  }

  /**
   * processReturnMessage
   * param data
   */
  public processReturnMessage(data): void {
    this.helperService.APP_TOAST_MESSAGE.next(data);
  }

  /**
   * request is success
   */
  public requestIsSuccess(data: any): boolean {
    let isSuccess = false;
    if (!data) {
      isSuccess = false;
    }
    // if (data.type === 'SUCCESS' || data.type === 'success') {
    if (data.mess.code === 1) {
      isSuccess = true;
    } else {
      isSuccess = false;
    }
    return isSuccess;
  }

  /**
   * request is success
   */
  public requestIsConfirm(data: any): boolean {
    let isConfirm = false;
    if (!data) {
      isConfirm = false;
    }
    if (data.type === 'CONFIRM') {
      isConfirm = true;
    } else {
      isConfirm = false;
    }
    return isConfirm;
  }

  /**
   * confirmDelete
   */
  public confirmDelete(data): void {
    this.helperService.confirmDelete(data);
  }

  public customHandler(err?) {
    return never();
  }
}
