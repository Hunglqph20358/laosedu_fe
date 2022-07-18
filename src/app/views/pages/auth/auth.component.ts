// Angular
import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
// Layout
import {LayoutConfigService, SplashScreenService, TranslationService} from '../../../core/_base/layout';
// Auth
import {AuthNoticeService} from '../../../core/auth';
import {environment} from '../../../../environments/environment';
import {SchoolServices} from "../system/school/school.service";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {NotiService} from "../../../core/service/service-model/notification.service";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {StorageSessionService} from "../../../core/auth/_services/storage.session.service";

@Component({
  selector: 'kt-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  shoolNameDefault: string = environment.SCHOOL_NAME;
  shoolName: any;
  school: any;
  // Public properties
  today: number = Date.now();
  headerLogo: string;
  innerHeight: any;
  schoolInfo: any;
  private unsubscribe: Subject<any>;

  /**
   * Component constructor
   *
   * @param el
   * @param render
   * @param layoutConfigService: LayoutConfigService
   * @param authNoticeService: authNoticeService
   * @param translationService: TranslationService
   * @param splashScreenService: SplashScreenService
   */
  constructor(
    private el: ElementRef,
    private render: Renderer2,
    private layoutConfigService: LayoutConfigService,
    public authNoticeService: AuthNoticeService,
    private translationService: TranslationService,
    private translate: TranslateService,
    private schoolServices: SchoolServices,
    private notiService: NotiService,
    private cdr: ChangeDetectorRef,
    private splashScreenService: SplashScreenService,
    private storageSessionService: StorageSessionService,
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    // this.translationService.setLanguage(this.translationService.getSelectedLanguage());
    this.headerLogo = this.layoutConfigService.getLogo();

    this.splashScreenService.hide();
    this.schoolInfo = null;
    // localStorage.setItem('language', 'la')
    // this.storageSessionService.setItem(this.storageSessionService.SCHOOL_INFO, JSON.stringify(response));
    this.schoolInfo = this.storageSessionService.get(this.storageSessionService.SCHOOL_INFO);
    if (this.schoolInfo !== null) {
      this.storageSessionService.set(this.storageSessionService.SCHOOL_INFO, this.schoolInfo);
      this.shoolName = this.schoolInfo.name != null ? this.schoolInfo.name : this.shoolNameDefault;
    } else {
      this.fetchSchool();
    }
  }

  fetchSchool() {
    const schoolCode = environment.SCHOOL_CODE;
    this.schoolServices.searchSchool(schoolCode).pipe(
      tap(response => {
        console.log('get info school success');
        this.storageSessionService.set(this.storageSessionService.SCHOOL_INFO, response);
        this.school = response;
        this.shoolName = this.school.name != null ? this.school.name : this.shoolNameDefault;
      }, error => {
        if (error.error.status === 404 || error.error.status === 500) {
          this.notiService.showNoti(this.translate.instant('SYSTEM.CONNECT_FAILURE_UNITEL'), 'error');
        } else {
          this.notiService.showNoti(error.error.message, 'error');
        }
        console.log('get info school failure');
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe();
    this.cdr.detectChanges();
  }

  /**
   * Load CSS for this specific page only, and destroy when navigate away
   * @param styleUrl
   */
  private loadCSS(styleUrl: string) {
    return new Promise((resolve, reject) => {
      const styleElement = document.createElement('link');
      styleElement.href = styleUrl;
      styleElement.type = 'text/css';
      styleElement.rel = 'stylesheet';
      styleElement.onload = resolve;
      this.render.appendChild(this.el.nativeElement, styleElement);
    });
  }
}
