// Angular
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild, ViewRef
} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
// RxJS
import {filter, finalize, takeUntil, tap} from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import {
  LayoutConfigService,
  MenuConfigService,
  MenuHorizontalService,
  MenuOptions,
  OffcanvasOptions
} from '../../../../core/_base/layout';
// HTML Class
import {HtmlClassService} from '../../html-class.service';
import {AuthService} from '../../../../core/auth/_services';
import {environment} from '../../../../../environments/environment';
import {TeachingTimetableService} from '../../../pages/system/teachers/teaching-timetable/shared/services/teaching-timetable.service';
import {SchoolServices} from '../../../pages/system/school/school.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {StorageSessionService} from '../../../../core/auth/_services/storage.session.service';
import {InboxManagementService} from '../../../pages/system/school/inbox-management.service';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';

@Component({
  selector: 'kt-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {
  roleParam = environment.ROLE;
  GV_CN = this.roleParam.GV_CN;
  GV_BM = this.roleParam.GV_BM;
  shoolName: string = environment.SCHOOL_NAME;
  teacherInfo: any;
  schoolInfo: any;
  private offcanvas: any;
  private unsubscribe: Subject<any>;
  @ViewChild('headerMenuOffcanvas', {static: true}) headerMenuOffcanvas: ElementRef;

  @Input() headerLogo: string;
  @Input() headerMenuSelfDisplay: boolean;
  @Input() headerMenuClasses: string;
  // Public properties
  currentRouteUrl: any = '';
  asideSelfDisplay = '';
  rootArrowEnabled: boolean;
  currentUser: any;
  abbName: any = 'HA';
  menuOptions: MenuOptions = {
    submenu: {
      desktop: 'dropdown',
      tablet: 'accordion',
      mobile: 'accordion'
    },
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      expandAll: false // allow having multiple expanded accordions in the menu
    },
    dropdown: {
      timeout: 50
    }
  };
  storageObserver = new BehaviorSubject(null);
  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'header-menu-wrapper',
    closeBy: 'kt_header_menu_mobile_close_btn',
    toggleBy: {
      target: 'kt_header_mobile_toggle',
      state: 'mobile-toggle-active'
    }
  };
  shouldShowGoToAccount = true;
  lStorage = JSON.parse(localStorage.getItem('currentUser'));

  /**
   * Component Conctructor
   *
   * @param inboxManagementService
   * @param el: ElementRef
   * @param htmlClassService: HtmlClassService
   * @param menuHorService: MenuHorService
   * @param menuConfigService: MenuConfigService
   * @param layoutConfigService: LayouConfigService
   * @param router: Router
   * @param render: Renderer2
   * @param cdr: ChangeDetectorRef
   * @param auth
   * @param teachingTimetableService
   * @param schoolServices
   * @param storageSessionService
   * @param classroomService
   */
  constructor(
    public inboxManagementService: InboxManagementService,
    private el: ElementRef,
    public htmlClassService: HtmlClassService,
    public menuHorService: MenuHorizontalService,
    private menuConfigService: MenuConfigService,
    private layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    public auth: AuthService,
    public teachingTimetableService: TeachingTimetableService,
    public schoolServices: SchoolServices,
    public storageSessionService: StorageSessionService,
    public classroomService: ClassroomService
  ) {
    this.unsubscribe = new Subject();
    // this.schoolInfo = this.storageSessionService.getItem(this.storageSessionService.SCHOOL_INFO).subscribe(data => data.value);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser.authorities.includes(environment.ROLE.PH)) {
      this.shouldShowGoToAccount = false;
    }
  }

  totalReceived: number | null = 0;

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * After view init
   */
  ngAfterViewInit(): void {
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.inboxManagementService.totalReceived$.subscribe(value => {
      console.log(value);
      this.totalReceived = value;
      this.cdr.markForCheck();
    });
    this.classroomService.yearCurrent$.subscribe(res => {
      if (res) {
        this.getTotalReceived(res);
      }
    });
    this.currentUser = this.auth.currentUserValue;
    this.getInitials();
    this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.rootArrow');
    this.currentRouteUrl = this.router.url;
    setTimeout(() => {
      this.offcanvas = new KTOffcanvas(this.headerMenuOffcanvas.nativeElement, this.offcanvasOptions);
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRouteUrl = this.router.url;
        this.mobileMenuClose();
        this.cdr.markForCheck();
      });
    this.schoolInfo = this.storageSessionService.get(this.storageSessionService.SCHOOL_INFO);
    if (this.schoolInfo === null) {
      this.fetchInfoSchool();
    } else {
      this.shoolName = this.schoolInfo.abbreviationName;
    }
    this.storageSessionService.watch(this.storageSessionService.SCHOOL_INFO).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.shoolName = data.abbreviationName;
      console.log('ten truong ==>', this.shoolName);
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }    });
  }

  getInitials() {
    const names = this.currentUser.fullName.split(' ');
    this.abbName = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      // this.abbName = names.map((n)=>n[0]).join('')
      this.abbName += names [names.length - 1].substring(0, 1);
    } else if (names.length === 1) {
      this.abbName = names[0].substring(0, 2).toUpperCase();
    }
  }

  /**
   * Return Css Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = 'menu-item';

    if (objectPath.get(item, 'submenu')) {
      classes += ' menu-item-submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-active menu-item-here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-open menu-item-here';
    }

    if (objectPath.get(item, 'resizer')) {
      classes += ' menu-item-resize';
    }

    const menuType = objectPath.get(item, 'submenu.type') || 'classic';
    if ((objectPath.get(item, 'root') && menuType === 'classic')
      || parseInt(objectPath.get(item, 'submenu.width'), 10) > 0) {
      classes += ' menu-item-rel';
    }

    const customClass = objectPath.get(item, 'custom-class');
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (objectPath.get(item, 'icon-only')) {
      classes += ' menu-item-icon-only';
    }

    return classes;
  }

  /**
   * Returns Attribute SubMenu Toggle
   * @param item: any
   */
  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (objectPath.get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (objectPath.get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemMenuSubmenuClass(item) {
    let classes = '';

    const alignment = objectPath.get(item, 'alignment') || 'right';

    if (alignment) {
      classes += ' menu-submenu-' + alignment;
    }

    const type = objectPath.get(item, 'type') || 'classic';
    if (type === 'classic') {
      classes += ' menu-submenu-classic';
    }
    if (type === 'tabs') {
      classes += ' menu-submenu-tabs';
    }
    if (type === 'mega') {
      if (objectPath.get(item, 'width')) {
        classes += ' menu-submenu-fixed';
      }
    }

    if (objectPath.get(item, 'pull')) {
      classes += ' menu-submenu-pull';
    }

    return classes;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    if (item.submenu.items) {
      for (const subItem of item.submenu.items) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (item.submenu.columns) {
      for (const subItem of item.submenu.columns) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (typeof item.submenu[Symbol.iterator] === 'function') {
      for (const subItem of item.submenu) {
        const active = this.isMenuItemIsActive(subItem);
        if (active) {
          return true;
        }
      }
    }

    return false;
  }

  mobileMenuClose() {
    if (KTUtil.isBreakpointDown('lg') && this.offcanvas) { // Tablet and mobile mode
      this.offcanvas.hide(); // Hide offcanvas after general link click
    }
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

  goToChangePass() {
    this.router.navigateByUrl('system/account/change-password');
  }

  getTeacherInfo() {
    this.teachingTimetableService.getLoggedInTeacher().subscribe(res => {
      this.teacherInfo = res;
      localStorage.setItem('teacherInfo', JSON.stringify(res));
      this.router.navigateByUrl('system/teacher/teacher-profile/' + this.teacherInfo.id);
    });
  }

  logout() {
    this.auth.logout();
    // this.store.dispatch(new Logout());
  }

  fetchInfoSchool() {
    const schoolCode = environment.SCHOOL_CODE;
    this.schoolServices.searchSchool(schoolCode).pipe(
      tap(response => {
        console.log('get info school success');
        sessionStorage.setItem('schoolInfo', JSON.stringify(response));
        this.schoolInfo = response;
        this.shoolName = this.schoolInfo.abbreviationName;
      }, error => {
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe();
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }  }

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

  getTotalReceived(years) {
    const role = this.getRole();
    if (!role) {
      return;
    }
    if (role === environment.ROLE.PH) {
      const body = {
        schoolYear: years,
      };
      this.schoolServices.searchTotalReceived(body).subscribe((res: any) => {
        this.totalReceived = res;
        if (!(this.cdr as ViewRef).destroyed) {
          this.cdr.detectChanges();
        }
      });
      return;
    }
    console.log('-----------------')
    if (environment.ROLE.GV_CN === role) {
      const body = {
        schoolYear: years,
        keySearch: null,
        objectReceivedType: null
      };
      this.schoolServices.searchInboxReceived(body).subscribe((res: any) => {
        this.totalReceived = res.totalReceivedMailNotOpen;
        if (!(this.cdr as ViewRef).destroyed) {
          this.cdr.detectChanges();
        }      });
      return;
    }
    if (environment.ROLE.HT === role) {
      const body = {
        schoolYear: years,
        keySearch: '',
        objectReceivedType: 0
      };
      this.schoolServices.searchInboxReceived(body).subscribe((res: any) => {
        this.totalReceived = res.totalReceivedMailNotOpen;
        if (!(this.cdr as ViewRef).destroyed) {
          this.cdr.detectChanges();
        }      });
      return;
    }
    if (environment.ROLE.ADMIN === role) {
      this.totalReceived = 0;
      return;
    }
    const sBody = {
      schoolYear: years,
      keySearch: null,
      objectReceivedType: null
    };
    this.schoolServices.searchInboxReceived(sBody).subscribe((res: any) => {
      this.totalReceived = res.totalReceivedMailNotOpen;
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
    return;
  }
}
