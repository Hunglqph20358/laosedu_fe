import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {ToastrService} from 'ngx-toastr';
import {SchoolServices} from '../school.service';
import {URL_AVATAR_STUDENT} from '../../../../../helpers/constants';
import {InboxManagementService} from '../inbox-management.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonFunction} from '../../../../../core/service/utils/common-function';

@Component({
  selector: 'kt-inbox-student',
  templateUrl: './inbox-student.component.html',
  styleUrls: ['./inbox-student.component.scss']
})

export class InboxStudentComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  isDefault;
  indexChoose = 0;
  @ViewChild('file') file: ElementRef;
  totalReceived: number | null = 0;
  formData;
  modalRef: BsModalRef;
  form: FormGroup;
  dataGrid: any = [];
  dataDetail: any = {};
  subscription;
  years;
  fileName;
  isUpdate = false;
  isShowImport = false;
  role;
  fromDate;
  toDate;
  listSubjectTeacher = [];
  logo = CommonFunction.getLogo();
  regex = /(<([^>]+)>)/ig;
  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private commonService: CommonServiceService,
              private toatr: ToastrService,
              private schoolServices: SchoolServices,
              private inboxManagementService: InboxManagementService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.classroomService.yearCurrent$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.years = res;
      if (this.years) {
        this.getTotalReceived();
        this.searchEvent();
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      keySearch: [''],
    });
  }

  getData() {
    // forkJoin(.schoolServices.getGradeLevels(),
    // ).subscribe(([resGradeLevels]) => {
    //
    // });
  }

  getTotalReceived() {
    const body = {
      schoolYear: this.years,
    };
    this.schoolServices.searchTotalReceived(body).pipe(
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      this.totalReceived = res;
      this.inboxManagementService.sendValue(res);
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }    });
  }

  searchEvent() {
    const body = {
      schoolYear: this.years,
      keySearch: this.form.value.keySearch,
      logo: this.logo
    };
    this.schoolServices.searchInboxStudent(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
      console.log(res);
      this.dataGrid = res.lstReceivedStudent;
      if (this.dataGrid.length > 0) {
        this.detailReceived(this.dataGrid[0], 0, true);
        this.dataGrid.forEach(it => {
          it.contentWebView = it.contentWeb?.replace(/\s|&nbsp;/g, ' ');
          it.contentWebView = it.contentWebView?.replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, ' ');
          if(it && it.senderAvatar){
            it.senderAvatar = CommonFunction.getHost() + it.senderAvatar
          } else {
            if(it.senderName){
              if(it.senderName.indexOf('Admin') > -1){
                it.textAvatar = 'AD';
              }else {
                let names = it.senderName.split(' (')
                names = names[0].split(' ');
                it.textAvatar = names[0].substring(0, 1).toUpperCase();
                if (names.length > 1) {
                  it.textAvatar += names [names.length - 1].substring(0, 1).toUpperCase();
                }
              }
            }
          }
        })
      } else {
        this.dataDetail = null
      }
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  detailReceived(it, index, isDefault?) {
    this.isDefault = isDefault;
    this.indexChoose = index
    if (it.isOpen === 0 && !isDefault) {
      this.totalReceived = this.totalReceived - 1;
      this.inboxManagementService.sendValue(this.totalReceived);
      this.dataGrid[index].isOpen = 1;
    }
    this.schoolServices.getDetailReceived(isDefault ? 1: 0, it.contactId).pipe(
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      this.dataDetail = res.data;
      if (this.dataDetail && this.dataDetail.senderName) {
        const senderName = this.dataDetail.senderName.split('(')
        this.dataDetail.senderNameFirst = senderName[0];
        if(senderName.length > 1){
          this.dataDetail.senderNameLast = senderName[1];
        }
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
      }    });
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

  cssScroll(template: any) {
    return template.offsetHeight < template.scrollHeight;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
