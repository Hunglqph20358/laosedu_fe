import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ParentService} from "../../../../core/service/service-model/parents.service";
import {LstReceivedStudent, ParentInfo, Schedule} from "../../../../core/service/model/parent-info.model";
import {Router} from "@angular/router";
import {ClassroomService} from "../../../../core/service/service-model/classroom.service";
import {ListTeacherSendMailParentsComponent} from "../contact-parents/send-mail/list-teacher-send-mail-parents/list-teacher-send-mail-parents.component";
import {MatDialog} from "@angular/material/dialog";
import {NotificationDetailComponent} from "./notification-detail/notification-detail.component";
import {URL_AVATAR_STUDENT} from "../../../../helpers/constants";
import {InboxManagementService} from "../school/inbox-management.service";
import {SchoolServices} from "../school/school.service";
import {CommonFunction} from "../../../../core/service/utils/common-function";

@Component({
  selector: 'kt-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.scss']
})
export class ParentsComponent implements OnInit {
  parentsInfo: ParentInfo = {};

  regex = /(<([^>]+)>)/ig;
  imageUrl = URL_AVATAR_STUDENT;
  defaultAvt = URL_AVATAR_STUDENT;

  constructor(private parentsService: ParentService,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private classRoomService: ClassroomService,
              private matDialog: MatDialog,
              private schoolServices: SchoolServices,
              private inboxManagementService: InboxManagementService
  ) {
  }

  schedule: Schedule = {};
  notifications: LstReceivedStudent[];
  totalReceived;
  isShowLoading = false;

  ngOnInit(): void {
    this.imageUrl = this.getLogoSchool();
    this.search();
  }

  search() {
    if (!this.isShowLoading) {
      this.isShowLoading = true;
      this.cdr.detectChanges();
    }
    this.parentsService.onSearch().subscribe(res => {
      this.isShowLoading = false;
      this.parentsInfo = res;
      console.log(this.parentsInfo);
      this.schedule = this.parentsInfo.schedule;
      this.schedule.data.length = 5;
      this.notifications = this.parentsInfo?.notifications?.lstReceivedStudent;
      this.notifications.forEach(e => {
        e.contentWebHome = e.contentWeb?.replace(/\s|&nbsp;/g, ' ');
        e.contentWebHome = e.contentWebHome?.replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, ' ');
      });
      this.totalReceived = this.parentsInfo?.notifications?.totalReceivedMailStudent;

      // Update count mail header
      this.inboxManagementService.sendValue(this.parentsInfo?.notifications?.totalReceivedMailStudent);

      this.notifications.forEach(e => {
        if (e.senderAvatar !== '' && e.senderAvatar !== null) {
          // e.senderAvatar = e.senderAvatar.substring(e.senderAvatar.lastIndexOf('/assets'), e.senderAvatar.length);
          e.senderAvatar = this.imageUrl;
        }else e.senderAvatar = this.imageUrl;
      });
      this.cdr.detectChanges();
      console.log(this.parentsInfo);
    })
  }

  navigateToStudentProfile(tab: string) {
    const currentYear = this.classRoomService.yearCurrent.getValue();
    const login = JSON.parse(localStorage.getItem('currentUser')).login;
    this.router.navigate(['/system/parents/student-profile', login, currentYear], {state: {tab}});
  }

  openDialog(notify): void {
    let isDefault = 1;
    if (notify.isOpen === 0) {
      notify.isOpen = 1;
      isDefault = 0;
      this.totalReceived = this.totalReceived - 1;
      this.inboxManagementService.sendValue(this.totalReceived);
    }

    this.isShowLoading = true;

    this.schoolServices.getDetailReceived(isDefault, notify.contactId).subscribe((res: any) => {
      this.isShowLoading = false;
      let dataDetail: any= {};
      dataDetail = res.data;
      dataDetail.senderAvatar = this.imageUrl
      this.cdr.detectChanges();

      this.matDialog.open(NotificationDetailComponent, {
        data: dataDetail,
        disableClose: true,
        hasBackdrop: true,
        autoFocus: false,
        maxHeight: '600px',
        panelClass:'school-year'
      })
    });
  }

  getLogoSchool(): string {
    const logo = CommonFunction.getLogo() ?? this.imageUrl;
    return logo;
  }
}
