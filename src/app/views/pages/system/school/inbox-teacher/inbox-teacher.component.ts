import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {ToastrService} from 'ngx-toastr';
import {SchoolServices} from '../school.service';
import {MatDialog} from '@angular/material/dialog';
import {NO_ROW_GRID_TEMPLATE, URL_AVATAR_STUDENT} from '../../../../../helpers/constants';
import {ModalSeeMoreComponent} from './modal-see-more-teacher/modal-see-more.component';
import {environment} from '../../../../../../environments/environment';
import {InboxManagementService} from '../inbox-management.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonFunction} from '../../../../../core/service/utils/common-function';

@Component({
  selector: 'kt-inbox-teacher',
  templateUrl: './inbox-teacher.component.html',
  styleUrls: ['./inbox-teacher.component.scss']
})

export class InboxTeacherComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  noRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  indexChoose = 0;
  @ViewChild('file') file: ElementRef;
  totalReceived: number | null = 0;
  formData;
  modalRef: BsModalRef;
  form: FormGroup;
  formReceived: FormGroup;
  dataGrid: any = [];
  dataGridReceived: any = [];
  dataDetail: any = [];
  selectTab = 1;
  dataDetailReceived: any = [];
  subscription;
  years;
  fileName;
  isShowImport = false;
  role;
  fromDate;
  toDate;
  listSubjectTeacher = [];
  seeMores = '';
  logo = CommonFunction.getLogo();
  listReceivedType = [
    {
      label: this.translate.instant("INBOX_ADMIN.STUDENT"),
      value: 1
    },
    {
      label: this.translate.instant("INBOX_ADMIN.TEACHER"),
      value: 2
    }
  ];
  isHT = false;
  isDefault: boolean;
  regex = /(<([^>]+)>)/ig;
  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private commonService: CommonServiceService,
              private toatr: ToastrService,
              private schoolServices: SchoolServices,
              private matDialog: MatDialog,
              private inboxManagementService: InboxManagementService
  ) {
  }

  ngOnInit(): void {
    const lStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.isHT = !!(lStorage && lStorage.authorities && lStorage.authorities.includes(environment.ROLE.HT));
    this.buildForm();
    this.classroomService.yearCurrent$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.years = res;
      if (this.years) {
        this.navChange({nextId: 1});
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      keySearch: [''],
      receivedType: [this.isHT ? 1 : null]
    });
    this.formReceived = this.formBuilder.group({
      keySearch: [''],
      receivedType: [null]
    });
  }

  getData() {
    // forkJoin(.schoolServices.getGradeLevels(),
    // ).subscribe(([resGradeLevels]) => {
    //
    // });
  }

  searchEvent() {
    const data = this.form.value;
    const body = {
      schoolYear: this.years,
      keySearch: data.keySearch,
      objectReceivedType: data.receivedType,
      logo: this.logo
    };
    this.schoolServices.searchInboxAdmin(body).pipe(
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      console.log(res);
      this.dataGrid = [...res.lstSentMail];
      if (this.dataGrid.length > 0) {
        this.detail(this.dataGrid[0], 0);
        this.dataGrid.forEach(it => {
          if (it.contentSms) {
            it.contentWebView = it.contentSms.replace(/\s|&nbsp;/g, ' ');
          }
          if (it.contentWebView) {
            it.contentWebView = it.contentWebView.replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, ' ');
          }
          if (it && it.senderAvatar) {
            it.senderAvatar = CommonFunction.getHost() + it.senderAvatar;
          } else {
            if (it.senderName) {
              if (it.senderName.indexOf('Admin') > -1) {
                it.textAvatar = 'AD';
              } else {
                let names = it.senderName.split(' (');
                names = names[0].split(' ');
                it.textAvatar = names[0].substring(0, 1).toUpperCase();
                if (names.length > 1) {
                  it.textAvatar += names [names.length - 1].substring(0, 1).toUpperCase();
                }
              }
            }
          }
        });
      } else {
        this.dataDetail = null;
      }
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  searchEventReceived() {
    const data = this.formReceived.value;
    const body = {
      schoolYear: this.years,
      keySearch: data.keySearch,
      objectReceivedType: this.isHT ? 0 : data.receivedType,
      logo: this.logo
    };
    this.schoolServices.searchInboxReceived(body).pipe(
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      this.dataGridReceived = [...res.lstReceived];
      this.totalReceived = res.totalReceivedMailNotOpen;
      console.log(this.totalReceived);
      this.inboxManagementService.sendValue(this.totalReceived);

      if (this.dataGridReceived.length > 0) {
        this.detailReceived(this.dataGridReceived[0], 0, true);
        this.dataGridReceived.forEach(it => {
          it.contentWebView = it.content?.replace(/\s|&nbsp;/g, ' ');
          it.contentWebView = it.contentWebView?.replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, ' ');

          if (it && it.senderAvatar) {
            it.senderAvatar = CommonFunction.getHost() + it.senderAvatar;
          } else {
            if (it.senderName) {
              if (it.senderName.indexOf('Admin') > -1) {
                it.textAvatar = 'AD';
              } else {
                let names = it.senderName.split(' (');
                names = names[0].split(' ');
                it.textAvatar = names[0].substring(0, 1).toUpperCase();
                if (names.length > 1) {
                  it.textAvatar += names [names.length - 1].substring(0, 1).toUpperCase();
                }
              }
            }
          }
        });
      } else {
        this.dataDetailReceived = null;
      }
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  detail(it, index) {
    this.indexChoose = index;
    if (it.isOpen === 0) {
      this.totalReceived = this.totalReceived - 1;
      this.dataGrid[index].isOpen = 1;
    }
    this.schoolServices.getDetailReceivedAdmin(it.isContactParent, it.contactId).pipe(
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      this.dataDetail = res.data;
      if (this.dataDetail && this.dataDetail.senderName) {
        const senderName = this.dataDetail.senderName.split('(');
        this.dataDetail.senderNameFirst = senderName[0];
        if (senderName.length > 1) {
          this.dataDetail.senderNameLast = senderName[1];
        }
      }
      if (this.dataDetail && this.dataDetail.lstReceiver.length > 0) {
        console.log('dataDetail',this.dataDetail);
        console.log(this.form.value.receivedType);
        const names = [];
        this.dataDetail.lstReceiver
          .forEach(item =>
            names.push((this.dataDetail.sendType === 3 && this.form.value.receivedType && this.form.value.receivedType !== 1)
            || (this.dataDetail.sendType === 4) ? (item.code + ' - ' + item.name) : item.name));
        this.seeMores = names.join('; ');
      } else {
        this.seeMores = '';
      }
      if (this.dataDetail && this.dataDetail.senderAvatar) {
        this.dataDetail.senderAvatar = CommonFunction.getHost() + this.dataDetail.senderAvatar;
      } else {
        if (this.dataDetail.senderName) {
          if (this.dataDetail.senderName.indexOf('Admin') > -1) {
            this.dataDetail.textAvatar = 'AD';
          } else {
            let names = this.dataDetail.senderName.split(' (');
            names = names[0].split(' ');
            this.dataDetail.textAvatar = names[0].substring(0, 1).toUpperCase();
            if (names.length > 1) {
              this.dataDetail.textAvatar += names [names.length - 1].substring(0, 1).toUpperCase();
            }
          }
        }
      }
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
      this.cdr.detectChanges();
    });
  }

  detailReceived(it, index, isDefault?) {
    this.isDefault = isDefault;
    this.indexChoose = index;
    if (it.isOpen === 0 && !this.isDefault) {
      this.totalReceived = this.totalReceived - 1;
      this.inboxManagementService.sendValue(this.totalReceived);
      this.dataGridReceived[index].isOpen = 1;
    }
    this.schoolServices.getDetailReceivedTeacher(isDefault ? 1 : 0, it.contactId).pipe(
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      this.dataDetailReceived = res.data;
      if (this.dataDetailReceived && this.dataDetailReceived.senderName) {
        const senderName = this.dataDetailReceived.senderName.split('(');
        this.dataDetailReceived.senderNameFirst = senderName[0];
        if (senderName.length > 1) {
          this.dataDetailReceived.senderNameLast = senderName[1];
        }
      }
      if (this.dataDetailReceived && this.dataDetailReceived.lstReceiver.length > 0) {
        const names = [];
        this.dataDetailReceived.lstReceiver
          .forEach(item => names.push(this.dataDetailReceived.sendType === 3 ? (item.code + ' - ' + item.name) : item.name));
        this.seeMores = names.join('; ');
      } else {
        this.seeMores = '';
      }
      if (this.dataDetailReceived && this.dataDetailReceived.senderAvatar) {
        this.dataDetailReceived.senderAvatar = CommonFunction.getHost() + this.dataDetailReceived.senderAvatar;
      } else {
        if (this.dataDetailReceived.senderName) {
          if (this.dataDetailReceived.senderName.indexOf('Admin') > -1) {
            this.dataDetailReceived.textAvatar = 'AD';
          } else {
            let names = this.dataDetailReceived.senderName.split(' (');
            names = names[0].split(' ');
            this.dataDetailReceived.textAvatar = names[0].substring(0, 1).toUpperCase();
            if (names.length > 1) {
              this.dataDetailReceived.textAvatar += names [names.length - 1].substring(0, 1).toUpperCase();
            }
          }
        }
      }
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
      this.cdr.detectChanges();
    });
  }

  getFileName(path) {
    const file: string[] = path.split('/');
    return file.length > 0 ? file[file.length - 1] : null;
  }

  downloadFile(path) {
    const body = {
      pathFileDownload: path
    };
    const fileName = this.getFileName(path);
    this.schoolServices.exportInbox(body, fileName);
  }

  openDialog(type?): void {
    this.matDialog.open(ModalSeeMoreComponent, {
      data: {
        data: type ? this.dataDetailReceived.lstReceiver : this.dataDetail.lstReceiver,
        type: type ? type : (this.isHT ? this.form.value.receivedType : 1)
      },
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      width: '760px'
    }).afterClosed().subscribe(() => {
    });
  }

  cssScroll(template: any) {
    return template.offsetHeight < template.scrollHeight;
  }

  navChange(event) {
    this.seeMores = null;
    this.selectTab = event.nextId;
    event.nextId === 2 ? this.searchEvent() : this.searchEventReceived();
    this.indexChoose = 0;
  }

  shouldShowBtn(listTeacher: any) {
    return listTeacher.offsetWidth < listTeacher.scrollWidth;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

