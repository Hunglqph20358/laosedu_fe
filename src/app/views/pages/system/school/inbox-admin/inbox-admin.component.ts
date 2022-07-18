import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {ToastrService} from 'ngx-toastr';
import {SchoolServices} from '../school.service';
import {MatDialog} from '@angular/material/dialog';
import {URL_AVATAR_STUDENT} from '../../../../../helpers/constants';
import {ModalSeeMoreTeacherComponent} from './modal-see-more-teacher/modal-see-more-teacher.component';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CommonFunction} from "../../../../../core/service/utils/common-function";

@Component({
  selector: 'kt-inbox-admin',
  templateUrl: './inbox-admin.component.html',
  styleUrls: ['./inbox-admin.component.scss']
})

export class InboxAdminComponent implements OnInit, OnDestroy {
  indexChoose = 0;
  @ViewChild('file') file: ElementRef;
  totalReceived: number | null = 0;
  formData;
  modalRef: BsModalRef;
  form: FormGroup;
  dataGrid: any = [];
  dataDetail: any = [];
  subscription;
  years;
  fileName;
  isUpdate = false;
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
  destroy$ = new Subject();
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
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.classroomService.yearCurrent$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.years = res;
      if (this.years) {
        this.searchEvent();
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      keySearch: [''],
      receivedType: [1],
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
 	    this.dataGrid = res.lstSentMail.map(e => {
        e.contentWebView = e.contentSms?.replace(/\s|&nbsp;/g, ' ');
        e.contentWebView = e.contentWebView?.replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, ' ');
        return e;
      });
      if (this.dataGrid.length > 0) {
        this.dataGrid.forEach(e => {
          if(e.contentSms){
            e.contentWebView = e.contentSms.replace(/\s|&nbsp;/g, ' ');
          }
          if(e.contentWebView){
            e.contentWebView = e.contentWebView.replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, ' ');
          }

        });
        this.detailReceived(this.dataGrid[0], 0);
      } else {
        this.dataDetail = null;
      }
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  detailReceived(it, index) {
    this.indexChoose = index;
    if (it) {

      if (it.isOpen === 0) {
        this.totalReceived = this.totalReceived - 1;
        this.dataGrid[index].isOpen = 1;
      }
      this.schoolServices.getDetailReceivedAdmin(it.isContactParent, it.contactId).pipe(
        takeUntil(this.destroy$)
      ).subscribe((res: any) => {
        console.log(res.data);
        this.dataDetail = res.data;
        if (this.dataDetail && this.dataDetail.senderName) {
          const senderName = this.dataDetail.senderName.split('(')
          this.dataDetail.senderNameFirst = senderName[0];
          if(senderName.length > 1){
            this.dataDetail.senderNameLast = senderName[1];
          }
        }
        if (this.dataDetail && this.dataDetail.lstReceiver.length > 0) {
          const names = [];
          this.dataDetail.lstReceiver.forEach(item => names.push((this.dataDetail.sendType === 3 && this.form.value.receivedType !== 1) || (this.dataDetail.sendType === 4 && this.form.value.receivedType === 1) ? (item.code+' - '+item.name) : item.name));
          this.seeMores = names.join('; ');
        } else {
          this.seeMores = '';
        }

        if(this.dataDetail && this.dataDetail.senderAvatar){
          this.dataDetail.senderAvatar = CommonFunction.getHost() + this.dataDetail.senderAvatar
        } else {
          if(this.dataDetail.senderName){
            if(this.dataDetail.senderName.indexOf('Admin') > -1){
              this.dataDetail.textAvatar = 'AD';
            }else {
              let names = this.dataDetail.senderName.split(' (')
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
  }

  getFileName(path) {
    const file: string[] = path.split('/');
    console.log(file)
    return file.length > 0 ? file[file.length - 1] : null;
  }

  downloadFile(path) {
    const body = {
      pathFileDownload: path
    };
    const fileName = this.getFileName(path);
    this.schoolServices.exportInbox(body, fileName);
  }

  openDialog(): void {
    this.matDialog.open(ModalSeeMoreTeacherComponent, {
      data: {
        data: this.dataDetail.lstReceiver,
        type: this.form.value.receivedType
      },
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      width: '760px'
    }).afterClosed().subscribe(() => {
    });
  }

  shouldShowBtn(listTeacher: any) {
    return listTeacher.offsetWidth < listTeacher.scrollWidth;
  }

  cssScroll(template: any) {
    return template.offsetHeight < template.scrollHeight;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
