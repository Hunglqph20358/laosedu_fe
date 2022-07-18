// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef } from '@angular/core';
// Layout
import { HtmlClassService } from '../../html-class.service';
import { LayoutConfigService, ToggleOptions } from '../../../../core/_base/layout';
import {environment} from '../../../../../environments/environment';
import { AuthService } from 'src/app/core/auth';
import { Router } from '@angular/router';
import { TeachingTimetableService } from 'src/app/views/pages/system/teachers/teaching-timetable/shared/services/teaching-timetable.service';
import { InboxManagementService } from 'src/app/views/pages/system/school/inbox-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kt-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit, OnDestroy {
  // Public properties

  private unsubscribe$: Subscription

  headerLogo = '';
  asideSelfDisplay = true;
  headerMenuSelfDisplay = true;
  headerMobileClasses = '';
  shouldShowGoToAccount = true
  teacherInfo: any;

  toggleOptions: ToggleOptions = {
    target: KTUtil.getBody(),
    targetState: 'topbar-mobile-on',
    toggleState: 'active'
  };
  lStorage = JSON.parse(localStorage.getItem('currentUser'));
  roleParam = environment.ROLE;
  GV_CN = this.roleParam.GV_CN;
  totalReceived
  currentRouteUrl

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   */
  constructor(
    private layoutConfigService: LayoutConfigService,
    private uiService: HtmlClassService,
    public auth: AuthService,
    private router: Router,
    public teachingTimetableService: TeachingTimetableService,
    private cdr: ChangeDetectorRef,
    public inboxManagementService: InboxManagementService,
  ){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser.authorities.includes(environment.ROLE.PH)) {
      this.shouldShowGoToAccount = false;
    }
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.unsubscribe$ = this.inboxManagementService.totalReceived$.subscribe(value => {
      this.totalReceived = value;
      this.cdr.markForCheck();
    });
    this.headerMobileClasses = this.uiService.getClasses('header_mobile', true).toString();
    this.headerLogo = this.getLogoUrl();
    this.asideSelfDisplay = this.layoutConfigService.getConfig('aside.self.display');
    this.headerMenuSelfDisplay = this.layoutConfigService.getConfig('header.menu.self.display');
    this.currentRouteUrl = this.router.url;
  }

  getLogoUrl() {
    const headerSelfTheme = this.layoutConfigService.getConfig('header.self.theme') || '';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    let result = 'logo_laoedu.png';
    if (!this.asideSelfDisplay) {
      if (headerSelfTheme === 'light') {
        result = 'logo-dark.png';
      }
    } else {
      if (brandSelfTheme === 'light') {
        result = 'logo-dark.png';
      }
    }
    return `./assets/media/logos/${result}`;
  }

  goToAccount() {
    const roleParam = environment.ROLE;
    const ADMIN = roleParam.ADMIN;
    const PH = roleParam.PH;
    const role = this.auth.currentUserValue.authorities;
    if (role.includes(ADMIN)) {
      this.router.navigateByUrl('system/account/account-management');
    } else if (!role.includes(PH)) {
      this.teacherInfo = localStorage.getItem('teacherInfo');
      if (this.teacherInfo == null) {
        this.getTeacherInfo();
      } else {
        this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
        this.router.navigateByUrl('system/teacher/teacher-profile/' + this.teacherInfo.id);
        if (!(this.cdr as ViewRef).destroyed) {
          this.cdr.detectChanges();
        }      }
    }
  }

  getTeacherInfo() {
    this.teachingTimetableService.getLoggedInTeacher().subscribe(res => {
      this.teacherInfo = res;
      localStorage.setItem('teacherInfo', JSON.stringify(res));
      this.router.navigateByUrl('system/teacher/teacher-profile/' + this.teacherInfo.id);
    });
  }

  goToChangePass() {
    this.router.navigateByUrl('system/account/change-password');
  }

  logout() {
    this.auth.logout();
  }

  getRole() {
    if (!this.lStorage) {
      return;
    }
    return this.lStorage && this.lStorage.authorities && this.lStorage.authorities[0];
  }

  getRole1(){
    if(!this.lStorage){
      return;
    }
    if(this.lStorage.authorities.includes(environment.ROLE.ADMIN)){
      return environment.ROLE.ADMIN;
    }else if(this.lStorage.authorities.includes(environment.ROLE.HT)){
      return environment.ROLE.HT;
    }else if(this.lStorage.authorities.includes(environment.ROLE.GV_CN)){
      return environment.ROLE.GV_CN;
    }else if(this.lStorage.authorities.includes(environment.ROLE.HP)){
      return environment.ROLE.HP;
    }else if(this.lStorage.authorities.includes(environment.ROLE.TK)){
      return environment.ROLE.TK;
    }else if(this.lStorage.authorities.includes(environment.ROLE.GV_BM)){
      return environment.ROLE.GV_BM;
    }else if(this.lStorage.authorities.includes(environment.ROLE.PH)){
      return environment.ROLE.PH;
    }
  }

  goToSendMail(){
    const role = this.getRole1();
    if(!role || role === environment.ROLE.GV_BM || role === environment.ROLE.HP || role === environment.ROLE.TK || role === environment.ROLE.PH){
      return;
    }
    if(role === environment.ROLE.ADMIN || role === environment.ROLE.HT || role === environment.ROLE.GV_CN){
      this.router.navigateByUrl('system/contact-parents/send-mail');
    }
  }

  checkRole(){
    const role = this.getRole1();
    if(role === environment.ROLE.ADMIN || role === environment.ROLE.HT || role === environment.ROLE.GV_CN){
      return true;
    }
    return false;
  }

  goToHref() {
    const role = this.getRole();
    if (!role) {
      return;
    }
    if (role === environment.ROLE.PH) {
      this.router.navigateByUrl('system/school/inbox-student');
      return;
    }
    if (role === environment.ROLE.ADMIN) {
      this.router.navigateByUrl('system/school/inbox-admin');
      return;
    }
    const isGv = this.lStorage && this.lStorage.authorities && this.lStorage.authorities && this.lStorage.authorities.length > 1 && this.lStorage.authorities.includes(this.GV_CN);

    if (isGv || [environment.ROLE.HT, environment.ROLE.GV_CN].includes(role)) {
      this.router.navigateByUrl('system/school/inbox-teacher');
      return;
    }
    this.router.navigateByUrl('system/school/inbox-other');
    return;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
