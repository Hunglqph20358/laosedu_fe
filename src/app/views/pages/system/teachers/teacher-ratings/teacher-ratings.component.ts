import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {TeacherService} from '../../../../../core/service/service-model/teacher.service';
import {TranslateService} from '@ngx-translate/core';
import {TooltipComponent} from '../../class-room/tooltip/tooltip.component';
import {ICellRendererParams} from 'ag-grid-community';
import {SelectActionComponent} from '../../class-room/select-action/select-action.component';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {constant} from '@progress/kendo-data-query/dist/npm/funcs';
import {ButtonRendererComponent} from './button-renderer/button-renderer.component';
import {Department} from '../../../../../core/service/model/department.model';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../../environments/environment';
import { ReasonRendererComponent } from './reason-renderer/reason-renderer.component';
import { NO_ROW_GRID_TEMPLATE, INVALID, TEACHER, MAX_FILE_SIZE_UPLOAD } from 'src/app/helpers/constants';
import { ButtonRendererComponent2 } from './button-renderer-2/button-renderer.component2';
import { take } from 'rxjs/operators';
export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-teacher-ratings',
  templateUrl: './teacher-ratings.component.html',
  styleUrls: ['./teacher-ratings.component.scss']
})

export class TeacherRatingsComponent implements OnInit {
  @ViewChild('file') file: ElementRef;
  formData;
  valueDefault;
  isSubmitImport = false;
  dropDownDefault: DataDropdown = {
    code: '',
    name: null
  };
  dropDownImport: DataDropdown = {
    code: '',
    name: this.translate.instant('TEACHER.PLACEHOLDER_SELECT')
  };
  modalRef: BsModalRef;
  modalRefApprove: BsModalRef;
  form: FormGroup;
  listRate = [];
  listScoreRating = [];
  listScoreRatingDefault = [];
  listDept = [];
  dataGrid = [];
  rowCheckedList = [];
  rangeWithDots;
  columnDefs = [];

  _pageSize = 10;
  _page = 1;
  lStorage;
  headerHeight = 56;
  rowHeight = 50;
  rowData;
  gridApi;
  gridColumnApi;
  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  subscription;
  years;
  fileName: string;
  fileSize: any;
  resultImport;
  isMe;
  isShowImport = false;
  scorePopup;
  frameworkComponents;
  roleParam = environment.ROLE;
  role;
  isApprove
  reason
  overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'))
  currentSampleFile
  currentSampleFileName
  extFile
  isUploadSampleFile
  isLoading

  MNG_RATE_VALID = ["Approved", "Rated", "NotApprove"]

  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private teacherService: TeacherService,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private commonService: CommonServiceService,
              private toatr: ToastrService,
              private changeDetectorRef: ChangeDetectorRef
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      buttonRenderer2: ButtonRendererComponent2,
      reasonRenderer: ReasonRendererComponent
    };
  }


  ngOnInit(): void {
    this.lStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.role = this.checkRole();
    this.buildForm();
    this.getData();
    this.dropDownDefault.name = this.translate.instant('TEACHER_RATING.ALL');
    this.subscription = this.classroomService.yearCurrent$.subscribe(val => {
      this.years = val;
      this._page = 1;
      if(this.form && this.valueDefault){
        this.form.patchValue(this.valueDefault)
        this.searchEvent(1)
      }
    });
    this.columnDefs = [
      {
        headerName: '',
        field: 'refunded',
        aggFunc: 'sum',
        minWidth: 40,
        maxWidth: 40,
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      {
        headerName: this.trans('GRID.NO'),
        field: 'make',
        valueGetter: param => {
          return param.node.rowIndex + (((this._page - 1) * this._pageSize) + 1);
        },
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'margin-left': '8px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
      },
      {
        headerName: this.trans('GRID.TEACHER_CODE'),
        headerTooltip: this.trans('GRID.TEACHER_CODE'),
        field: 'teacherCode',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 120,
        maxWidth: 120,
        tooltipField: 'teacherCode'
      },
      {
        headerName: this.trans('GRID.TEACHER_NAME'), field: 'fullName',
        headerTooltip: this.trans('GRID.TEACHER_NAME'),
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 160,
        maxWidth: 160,
        tooltipField: 'fullName',
      },
      {
        headerName: this.trans('GRID.DEPT_NAME'), field: 'deptName',
        headerTooltip: this.trans('GRID.DEPT_NAME'),
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 180,
        maxWidth: 180,
        tooltipField: 'deptName'
      },
      {
        headerName: this.trans('GRID.STATUS'), 
        headerTooltip: this.trans('GRID.STATUS'),
        cellStyle: params => {
          const statusCode = params.data.statusCode;
          const statusFound = TEACHER.TEACHER_RATING_STATUS.find(v => v.code.toUpperCase() == statusCode.toUpperCase())
          const color = statusFound?.color || '#000000';
          return {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            'color': color,
            'top': '12px',
          };
        },
        minWidth: 160,
        maxWidth: 160,
        tooltipField: `statusName${this.translate.currentLang.toUpperCase()}`,
        cellRenderer: 'reasonRenderer'
      },
      {
        headerName: this.trans('GRID.SCORE'),
        headerTooltip: this.trans('GRID.SCORE'),
        cellRenderer: param => {
          const score = param.data[`scoreName${this.translate.currentLang.toUpperCase()}`]
          if (score && this.MNG_RATE_VALID.includes(param.data.statusCode)) {
            return score;
          } else {
            return '-';
          }
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 120,
        maxWidth: 120,
        tooltipField: `scoreName${this.translate.currentLang.toUpperCase()}`
      },
      {
        headerName: this.trans('GRID.FILE_SELF'),
        headerTooltip: this.trans('GRID.FILE_SELF'),
        field: 'pathFile',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.downloadFileSelfAssessment.bind(this),
        },
        tooltipValueGetter: params => {
          const rated = params.data.statusCode != 'not_rate'
          params.data.rated = rated
          return rated ? this.translate.instant('TEACHER_RATING.FILE_SELF_ASSESSMENT') : null
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'color': '#101840',
          'top': '11px'
        },
        minWidth: 156,

      },
      {
        headerName: this.trans('GRID.FILE_MNG'),
        headerTooltip: this.trans('GRID.FILE_MNG'),
        field: 'mngPathFile',
        cellRenderer: 'buttonRenderer2',
        cellRendererParams: {
          onClick: this.downloadFileSelfAssessment.bind(this),
        },
        tooltipValueGetter: params => {
          const mngRateValid = this.MNG_RATE_VALID.includes(params.data.statusCode)
          params.data.isValid = mngRateValid
          return mngRateValid ? this.translate.instant('TEACHER_RATING.FILE_MNG_ASSESSMENT') : null
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'color': '#101840',
          'top': '11px'
        },
        minWidth: 156,

      },
    ];
  }

  buildForm() {
    this.form = this.formBuilder.group({
      deptId: [null],
      score: [''],
      status: [''],
      teacherName: ['']
    });
    this.cdr.detectChanges();
  }

  downloadFileSelfAssessment(path) {
    console.log(path)
    // const fileName = `Danhgialaodong_${this.years}.doc`;
    this.teacherService.fileSelfAssessment(path.value, '');
  }

  getData() {
    forkJoin(
      [this.teacherService.data('RATE'),
       this.teacherService.data('SCORE_RATING'),
       this.teacherService.dataDept(this.role),]
    ).subscribe(([resRate, resScoreRating, resDept]) => {
      this.listDept = resDept;
      this.listRate = resRate.map( rate => {
        if (this.translate.currentLang != 'vn') 
          rate.name = rate[`name${this.translate.currentLang.toUpperCase()}`]
        return rate
      });
      this.listScoreRating = resScoreRating.map(score => {
        if (this.translate.currentLang != 'vn') 
          score.name = score[`name${this.translate.currentLang.toUpperCase()}`]
        return score
      });
      this.listScoreRatingDefault = JSON.parse(JSON.stringify(resScoreRating));
      if (resDept.length > 0) {
        this.form.get('deptId').setValue(resDept[0].key);
      }
      this.listRate.unshift(this.dropDownDefault);
      this.listScoreRating.unshift(this.dropDownDefault);
      this.listScoreRatingDefault.unshift(this.dropDownImport);
      this.valueDefault = this.form.value
      this.searchEvent(1);
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 50);
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
  }

  onRowSelected(event) {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
    this.rowCheckedList = listRowSelected;
    console.log(this.rowCheckedList)
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  // ==============================Paging=====================================

  page(page: number): void {
    this._page = page;
    this.searchEvent(page);
  }

  prev(): void {
    this._page--;
    if (this._page < 1) {
      this._page = 1;
      return;
    }

    this.searchEvent(this._page);
  }

  next(): void {
    this._page++;
    if (this._page > this.totalPage) {
      this._page = this.totalPage;
      return;
    }
    this.searchEvent(this._page);
    // this.page(this.currentPage)
  }

  searchEvent(page: number) {
    this.changeLoading(true)
    this._page = page;
    // tslint:disable-next-line:forin
    const data = Object.assign({}, this.form.value, {
      years: this.years,
      teacherCode: this.role === 0 ? this.lStorage.login : null
    });
    const body = {
      data,
      page,
      pageSize: this._pageSize,
    };
    this.teacherService.onSearch(body).subscribe(res => {
      this.changeLoading(false)
      this.rowCheckedList = [];
      this.dataGrid = res.data;
      // this.deptList = res.departmentList;
      this.totalRecord = res.total;
      this.first = ((page - 1) * this._pageSize) + 1;
      this.last = this.first + this.dataGrid.length - 1;
      if (this.totalRecord % this._pageSize === 0) {
        this.totalPage = Math.floor(this.totalRecord / this._pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      } else {
        this.totalPage = Math.floor(this.totalRecord / this._pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }
      this.gridApi.sizeColumnsToFit();
      this.gridApi.setRowData(this.dataGrid);
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }    });
  }

  openModal(template: TemplateRef<any>, isMe: boolean) {
    this.closeModalRef()
    this.scorePopup = '';
    this.isSubmitImport = false;
    this.isMe = isMe;
    this.resultImport = null;
    this.removeFile();
    this.getSampleFile()
    this.modalRef = this.modalService.show(
      template,
      {class: 'modal-center'}
    );
    // const interval = setInterval(() => {
    //   const el = document.getElementById('cancelBtn');
    //   if (el) {
    //     el.focus();
    //     clearInterval(interval);
    //   }
    // }, 200);
  }

  disableIsMe() {
    if (this.rowCheckedList.length) {
      const { teacherCode, statusCode } = this.rowCheckedList[0]
      return !(this.rowCheckedList.length === 1 && (statusCode === 'not_rate' || statusCode === 'NotRate')
        && this.lStorage.login.toUpperCase() === teacherCode.toUpperCase());
    }
    return true;
  }

  disableNotMe() {
    if (this.rowCheckedList.length) {
      const { teacherCode, statusCode } = this.rowCheckedList[0]
      return !(this.rowCheckedList.length === 1 && (statusCode === 'self_rate' || statusCode === 'NotApprove')
        && this.lStorage.login.toUpperCase() !== teacherCode.toUpperCase());
    }
    return true;
  }

  disableApprove() {
    if (this.rowCheckedList.length == 1) {
      const data = this.rowCheckedList.find(it => this.lStorage.login.toUpperCase() === it.teacherCode.toUpperCase() || it.statusCode !== 'Rated');
      if (data) {
        return true;
      }
      return false;
    }
    return true;
  }

  openModalApprove(template: TemplateRef<any>) {
    // this.closeModalRef()
    this.nestedModal = true
    if (this.rowCheckedList)

      this.modalRefApprove = this.modalService.show(
        template,
        Object.assign({}, {class: 'center modal-dialog-custom'})
      );

      this.modalRefApprove.onHide.pipe(take(1)).subscribe(x => {
        this.nestedModal = false
      })

    // const interval = setInterval(() => {
    //   const el = document.getElementById('cancelBtnApprove');
    //   if (el) {
    //     el.focus();
    //     clearInterval(interval);
    //   }
    // }, 200);
  }

  removeFile() {
    this.resultImport = null;
    this.file = null;
    this.fileName = null;
    this.fileSize = null;
    this.formData = null
    if (this.currentFile) {
      this.currentFile.value = null
      this.currentFile = null
    }
  }

  exportTemplate() {
    const path = {
      value: this.rowCheckedList[0] ? this.rowCheckedList[0].pathFile : null
    };

    if (this.isMe &&  INVALID.includes(this.currentSampleFile)) {
      this.toatr.error(this.trans('IMPORT.SAMPLE_FILE.HAS_NOT'))
      return
    }

    this.isMe ? this.teacherService.fileSelfAssessmentTemplate(`teacher-rating/sample-file`, this.currentSampleFileName)
      : this.downloadFileSelfAssessment(path);
  }

  downloadFile(isFileMng: boolean) {
    const path = {
      value: isFileMng ? this.rowCheckedList[0].mngPathFile : this.rowCheckedList[0].pathFile
    };
    this.downloadFileSelfAssessment(path);
  }

  currentFile: any
  upload(file, f) {
    if (file.length == 0) return
    this.currentFile = f
    this.fileName = file[0].name;
    this.fileSize = (file[0].size/1024).toFixed(0);

    if (file.length === 0) {
      this.fileName = null
      this.fileSize = null
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.BLANK'));
      this.isShowImport = true;
      f.value = null
      return;
    }

    if (this.fileSize > MAX_FILE_SIZE_UPLOAD) {
      this.fileName = null
      this.fileSize = null
      this.toatr.error(this.trans('IMPORT.NOTIFY.SIZE'))
      f.value = null
      return
    }

    if (!this.isUploadSampleFile && !this.fileName.endsWith(this.extFile?.trim())) {
      this.fileName = null
      this.fileSize = null
      this.toatr.error(this.trans('IMPORT.NOTIFY.FORMAT'))
      f.value = null
      return
    }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formData = formData;
    this.isShowImport = false;
  }

  // exportDataErrors() {
  //   if (this.resultImport === undefined) {
  //     this.toatr.error('Chưa có file data lỗi, cần import trước')
  //     return;
  //   }
  //   if (this.resultImport.listErrors.length > 0) {
  //     this.teacherService.exportDataErrors(this.resultImport.listErrors);
  //   } else {
  //     this.toatr.warning('Không có data lỗi!')
  //   }
  // }
  importFile() {
    this.isSubmitImport = true;
    if (!this.isMe && !this.scorePopup) {
      return;
    }
    if (this.isMe ? this.disableIsMe() : this.disableNotMe()) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.NOT'));
      return;
    }
    if (!this.fileName) {
      this.toatr.error(this.isMe ? this.trans('IMPORT.IS_ME.BLANK') : this.trans('IMPORT.NOT_ME.BLANK'));
      return;
    }

    this.changeLoading(true)

    this.teacherService.uploadTeacherRatings(this.formData, this.isMe ? `teacher-rating/${this.rowCheckedList[0].teacherCode}/self-rate/${this.years}` : `teacher-rating/${this.rowCheckedList[0].teacherCode}/rate-management`, this.isMe ? null : this.scorePopup, this.years).subscribe((res: any) => {
      this.changeLoading(false)
      this.modalRef.hide();
      this.resultImport = res;
      this.file = null;
      this.toatr.success(this.translate.instant(this.isMe ?  'TEACHER_RATING.IMPORT.IS_ME.SUCCESS' : 'TEACHER_RATING.IMPORT.NOT_ME.SUCCESS'));
      this.searchEvent(1);
    }, err => {
      this.changeLoading(false)
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.ERROR'));
    });
  }

  approve() {
    if (this.disableApprove()) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.NOT'));
      return;
    }
    this.changeLoading(true)
    this.teacherService.approve(this.rowCheckedList).subscribe((res: any) => {
      this.changeLoading(false)
      this.toatr.success(this.translate.instant('TEACHER_RATING.IMPORT.APPROVE.SUCCESS'));
      this.searchEvent(1);
      this.closeModalRef()
    }, err => {
      this.changeLoading(false)
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.ERROR'));
    });
  }

  justAdmin
  checkRole() {
    const roleNormal = [this.roleParam.GV_BM, this.roleParam.GV_CN];
    const roleTK = [this.roleParam.TK];
    const roleADMIN = [this.roleParam.HP, this.roleParam.HT, this.roleParam.ADMIN];


    const role = this.lStorage.authorities;
    if (role.length == 1 && role.includes(this.roleParam.ADMIN)) {
      this.justAdmin = true
    }

    if (role.length > 0) {

      if (roleADMIN.some(value => role.includes(value))) {
        return 2
      }

      if (roleTK.some(value => role.includes(value))) {
        return 1
      }

      if (roleNormal.some(value => role.includes(value))) {
        return 0
      }

    }
    return null;
  }

  getSampleFile() {
    this.teacherService.getCurrentSampleFile().subscribe({
      next: resp => {
        this.currentSampleFile = resp[0].value
        const pathSplit = this.currentSampleFile?.split('/')
        this.currentSampleFileName = pathSplit[pathSplit.length - 1]
        const a= this.currentSampleFile?.split('.')
        this.extFile = a[a.length - 1]
      },
      error: resp => {
        console.log(resp)
      }
    })
  }

  uploadSampleFile() {
    if (this.formData == undefined)  {
      this.toatr.error(this.trans('IMPORT.SAMPLE_FILE.BLANK'))
      return
    }

    this.changeLoading(true)

    this.teacherService.uploadSampleFile(this.formData).subscribe(
      (resp: any) => {
        if (resp.status === 'OK') {
          this.toatr.success( this.translate.instant('COMMON.UPDATE_SUCCESS') )
          this.closeModalRef()
        } else {
          this.toatr.error(resp.message)
        }
        this.changeLoading(false)
        this.changeDetectorRef.detectChanges()
      },
      (resp: any) => {
        this.changeLoading(false)
        this.toatr.error(resp)
      }
    )
  }

  openModalUploadSampleFile(template: TemplateRef<any>) {
    this.openModalTemplate(template)
    this.isMe = true
    this.isUploadSampleFile = true
  }

  openModalTemplate(template: TemplateRef<any>,) {
    this.closeModalRef()
    this.nestedModal = false

    this.isMe = false
    this.isUploadSampleFile = false
    this.getSampleFile()
    this.modalRef = this.modalService.show(
      template,
      {class: 'modal-center'}
    )
  }

  modalRejectRef: BsModalRef
  nestedModal
  openModalReject(template: TemplateRef<any>, isApprove: boolean) {
    this.isApprove = isApprove
    this.reason = ''
    this.nestedModal = true
    // this.closeModalRef()
    this.modalRejectRef = this.modalService.show(
      template,
      {class: 'modal-center'}
    )

    this.modalRejectRef.onHide.pipe(take(1)).subscribe( x => {
      this.nestedModal = false
    })

  }

  closeModalRef() {
    if (this.modalRef) {
      this.modalRef.hide()
      this.modalRef = null
      this.removeFile()
      this.resetFile()
    }

    if (this.modalRefApprove) {
      this.modalRefApprove.hide()
      this.modalRefApprove = null
      this.nestedModal = false
    }

    if (this.modalRejectRef) {
      this.modalRejectRef.hide()
      this.modalRejectRef = null
      this.nestedModal = false
    }
  }

  resetFile() {
    this.fileName = null
    this.fileSize = null
  }

  reject() {
    if (INVALID.includes(this.reason?.trim())) {
      this.toatr.error(
        this.isApprove
        ? this.trans('REJECT.APPROVE_BLANK')
        : this.trans('REJECT.RATE_BLANK')
      )
      return
    }
    this.changeLoading(true)
    this.reason = this.reason.trim()
    const teacherSelected = this.rowCheckedList[0]
    const data: any = {
      teacherCode: teacherSelected.teacherCode,
      years: this.years
    }

    if (this.isApprove) {
      data.reasonForNotApprove = this.reason
    } else {
      data.reasonForNotRating = this.reason
    }
    this.teacherService.reject(data, this.isApprove).subscribe({
      next: (resp: any) => {
        this.changeLoading(false)
        if (resp.status === 'OK') {
          this.toatr.success(this.isApprove ? this.trans('REJECT.APPROVE_SUCCESS') : this.trans('REJECT.RATE_SUCCESS'))
          this.searchEvent(this._page)
          this.closeModalRef()
        } else {
          this.toatr.error(resp.message )
        }
      },
      error: resp => {
        this.changeLoading(false)
        this.toatr.error(resp.message)
      }
    })
  }

  trans(key): string {
    return this.translate.instant(`TEACHER_RATING.${key}`)
  }

  changeLoading(open) {
    this.isLoading = open
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }  }
}

