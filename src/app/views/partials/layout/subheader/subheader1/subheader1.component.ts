// Angular
import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
// RxJS
import {Subscription} from 'rxjs';
// Layout
import {SubheaderService} from '../../../../../core/_base/layout';
import {Breadcrumb} from '../../../../../core/_base/layout/services/subheader.service';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {SchoolYearService} from '../../../../pages/system/school-year/school-year.service';
import {Router} from "@angular/router";

@Component({
  selector: 'kt-subheader1',
  templateUrl: './subheader1.component.html',
  styleUrls: ['./subheader1.component.scss'],
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {
  // Public properties
  @Input() fixed = true;
  @Input() clear = false;
  @Input() width = 'fluid';
  @Input() subheaderClasses = '';
  @Input() subheaderContainerClasses = '';
  @Input() displayDesc = false;
  @Input() displayDaterangepicker = true;

  // today: number = Date.now();
  title = '';
  desc = '';
  breadcrumbs: Breadcrumb[] = [];
  notSchoolYear;
  disableYears = false;
  schoolYearList: any;
  years;

  showHeaderTeacherProfile;

  notShowBreadcrumb

  // Private properties
  private subscriptions: Subscription[] = [];

  /**
   * Component constructor
   *
   * @param subheaderService: SubheaderService
   */
  constructor(
      public subheaderService: SubheaderService,
      private schoolYearService: SchoolYearService,
      private changeDetectorRef: ChangeDetectorRef,
      public classroomService: ClassroomService,
  ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.getListSchoolYear();
  }

  /**
   * After view init
   */
  getListSchoolYear() {
    this.schoolYearService.getListSchoolYearHeader().subscribe((resAPI) => {
      this.schoolYearList = resAPI.listSchoolYear;
      this.years = resAPI?.yearCurrent;
      this.changeDetectorRef.detectChanges();
      this.classroomService.changeYearCurrent(this.years);
      this.classroomService.changeListYears(resAPI.listSchoolYear);
    });
  }

  selectYears(event) {
    this.classroomService.changeYearCurrent(this.years);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
        this.subheaderService.title$.subscribe((bt) => {
          // breadcrumbs title sometimes can be undefined
          if (bt) {
            this.title = bt.title;
            this.desc = bt.desc;
          }
        })
    );

    this.subscriptions.push(
        this.subheaderService.breadcrumbs$.subscribe((bc: any) => {

          if (bc && bc.length > 0) {
            console.log(bc[bc.length - 1])
            if (bc[bc.length - 1].page
                && (bc[bc.length - 1].page.indexOf('/system/school/schedule-timetable') > -1
                    || bc[bc.length - 1].page.indexOf('/system/teacher/teaching-timetable') > -1
                    || bc[bc.length - 1].page.indexOf('/system/student/transfer-students') > -1
                    || bc[bc.length - 1].page.indexOf('system/student/students-gradebook') > -1
                    || bc[bc.length - 1].page.indexOf('/system/student/attendance-student') > -1
                    || bc[bc.length - 1].page.indexOf('/system/student/academic-abilities') > -1
                    || bc[bc.length - 1].page.indexOf('/system/student/conduct-assessment') > -1
                    || bc[bc.length - 1].page.indexOf('/system/diligence') > -1
                    || bc[bc.length - 1].page.indexOf('/system/parents/home') > -1
                    || bc[bc.length - 1].page.indexOf('/system/school/inbox-student') > -1
                    || bc[bc.length - 1].page.indexOf('/system/school/view-timetable') > -1
                    || bc[bc.length - 1].page.indexOf('/system/contact-parents/send-mail') > -1
                )
            ) {
              this.disableYears = true;
            } else {
              this.disableYears = false;
            }
          }

          this.breadcrumbs = bc;
          if (location.href.includes('/school-year') ||
              location.href.includes('/teacher-management') ||
              location.href.includes('/student-profile/') ||
              location.href.includes('/create-update-student') ||
              location.href.includes('/teacher-profile/') ||
              location.href.includes('/create-update-teacher') ||
              location.href.includes('/account-management') ||
              location.href.includes('/system/official-letter-document') ||
              location.href.includes('/change-password') ||
              location.href.includes('/contact-group') ||
              location.href.includes('/contact/send-mail')
          ) {
            this.notSchoolYear = false;
          } else {
            this.notSchoolYear = true;
          }

          let bre: Breadcrumb[] = [];
          if (location.href.includes('/teacher-profile/')) {
            bre = [{
              page: '/system/teacher/teacher-management',
              title: 'Giáo viên',
              translate: 'MENU.TEACHER.TITLE'
            }, {
              page: '/system/teacher/teacher-profile/:id',
              title: 'Hồ sơ cán bộ giáo viên',
              translate: 'SUBHEADER.PROFILE_TEACHER'
            }];
            this.breadcrumbs = bre;
          }
          if (location.href.includes('/create-update-teacher')) {
            bre = [{
              page: '/system/teacher/teacher-management',
              title: 'Giáo viên',
              translate: 'MENU.TEACHER.TITLE'
            }, {
              page: '/system/teacher/create-update-teacher',
              title: 'Thêm mới/Cập nhật',
              translate: 'SUBHEADER.ADD_OR_UPDATE'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/student-profile/')) {
            bre = [{
              page: '/system/student/student-management',
              title: 'Học sinh',
              translate: 'MENU.STUDENT.TITLE'
            }, {
              page: '/system/student/student-profile/:id/:year',
              title: 'Hồ sơ học sinh',
              translate: 'SUBHEADER.PROFILE_STUDENT'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/create-update-student')) {
            bre = [{
              page: '/system/student/student-management',
              title: 'Học sinh',
              translate: 'MENU.STUDENT.TITLE'
            }, {
              page: '/system/student/create-update-student',
              title: 'Thêm mới',
              translate: 'COMMON.ADD'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/create-update-student/')) {
            bre = [{
              page: '/system/student/student-management',
              title: 'Học sinh',
              translate: 'MENU.STUDENT.TITLE'
            }, {
              page: '/system/student/create-update-student/:id',
              title: 'Cập nhật',
              translate: 'COMMON.UPDATE'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/account-management')) {
            bre = [{
              page: '/system/account/account-management',
              title: 'Quản lý tài khoản',
              translate: 'ACCOUNT.ACC_MNG'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/change-password')) {
            bre = [{
              page: '/system/account/change-password',
              title: 'Đổi mật khẩu',
              translate: 'ACCOUNT.CHANGE_PW'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/contact/send-mail')) {
            bre = [{
              page: '/system/contact/send-mail',
              title: 'Liên lạc cán bộ giáo viên',
              translate: 'SUBHEADER.CONTACT_TEACHER'
            }, {
              page: '/system/contact/send-mail',
              title: 'Gửi tin nhắn mới',
              translate: 'SUBHEADER.NEW_SEND_MESSAGE'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/contact/contact-group')) {
            bre = [{
              page: '/system/contact/contact-group',
              title: 'Liên lạc cán bộ giáo viên',
              translate: 'SUBHEADER.CONTACT_TEACHER'
            }, {
              page: '/system/contact/contact-group',
              title: 'Danh sách nhóm liên lạc',
              translate: 'SUBHEADER.CONTACT_GROUP_LIST'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/contact-parents/send-mail')) {
            bre = [{
              page: '/system/contact-parents/send-mail',
              title: 'Liên lạc phụ huynh học sinh',
              translate: 'SUBHEADER.CONTACT_STUDENT'
            }, {
              page: '/system/contact-parents/send-mail',
              title: 'Gửi tin nhắn mới',
              translate: 'SUBHEADER.NEW_SEND_MESSAGE'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/contact-parents/contact-group')) {
            bre = [{
              page: '/system/contact-parents/contact-group',
              title: 'Liên lạc phụ huynh học sinh',
              translate: 'SUBHEADER.CONTACT_STUDENT'
            }, {
              page: '/system/contact-parents/contact-group',
              title: 'Danh sách nhóm liên lạc',
              translate: 'SUBHEADER.CONTACT_GROUP_LIST'
            }];
            this.breadcrumbs = bre;
          }

          if (location.href.includes('/parents/student-profile/')) {
            bre = [{
              page: '/system/parents/student-profile/:id/:year',
              title: 'Thông tin hồ sơ',
              translate: 'SUBHEADER.PROFILE_INFO'
            }];
            this.breadcrumbs = bre;
          }

          // Parent Home
          if (location.href.includes('/system/parents/home')) {
            this.notShowBreadcrumb = true;
          }else this.notShowBreadcrumb = false;

        })
    );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
