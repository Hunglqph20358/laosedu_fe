import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SelectableSettings} from '@progress/kendo-angular-grid';
import {Subject, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ConfigPointLockService} from '../../../../core/service/service-model/config-point-lock.service';
import {AddConfigComponent} from './add-config/add-config.component';
import {ActionConfLockPointComponent} from './action-conf-lock-point/action-conf-lock-point.component';
import {ConfigNotifyComponent} from './config-notify/config-notify.component';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {formatDate} from '@angular/common';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import {Overlay} from '@angular/cdk/overlay';
import {NO_ROW_GRID_TEMPLATE} from '../../../../helpers/constants';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-config-point-lock',
  templateUrl: './config-point-lock.component.html',
  styleUrls: ['./config-point-lock.component.scss']
})
export class ConfigPointLockComponent implements OnInit,OnDestroy {
  unsubscribe$ = new Subject<void>();
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight=50;
  columnDefs

  // Translate
  sttTranslate;
  typeSubjectTranslate;
  scoreNameTranslate;
  dateLockTranslate;
  statusTranslate;
  lockedTranslate;
  updaterTranslate;
  updateTimeTranslate;

  formSearch: FormGroup;
  years = '2021-2022';
  dataSearch: any ={};
  gradeList: any = [];
  semesterList: any = [];
  listConfEntryKeyDetail: any = [];
  _pageSize = 10;
  _page = 1;
  totalPage = 0;
  first;
  last;
  totalRecord = 0;
  public pageSizes: Array<number> = [10,20];
  selectTableSetting: SelectableSettings = {
    checkboxOnly: true
  }
  rowCheckedList: any = [];
  subscription: Subscription;
  // paging
  rangeWithDots = [];

  overlayNoRowsTemplate;
  constructor(private configPointLockService: ConfigPointLockService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private toastr: ToastrService,
              private classroomService:ClassroomService,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonServiceService,
              private overlay:Overlay,
              private translate: TranslateService) {
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
    this.translateLanguage();
  }

  ngOnInit(): void {
    this.initTable();
    this.buildFormSearch();
    this.getCurrentYear();

    this.listeningIsLock();
    this.listeningIsUnlock();
    this.listeningIsUpdate();
  }

  initTable() {
    this.columnDefs = [
      {
        headerName: '',
        field: 'refunded',
        aggFunc: 'sum',
        minWidth:40,
        maxWidth:40,
        headerCheckboxSelection: true,
        checkboxSelection: true,

      },
      {
        headerName: this.sttTranslate,
        field: 'make',
        valueGetter: param => {
          return param.node.rowIndex + (((this._page - 1) * this._pageSize) + 1)
        },
        minWidth:60,
        maxWidth:60,
        headerClass: 'stt-header',
        cellClass: 'cell-class-style-stt',
        cellStyle:{
          'font-weight': '500',
          display: 'flex',
          'font-size': '12px',
          'justify-content': 'center',
          color: '#101840',
          'align-items': 'center'
        },

      },
      {
        headerName: this.typeSubjectTranslate,
        field: 'typeSubjectName',
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth:140,
        maxWidth:150,
        tooltipField: 'typeSubjectName',
        suppressMovable: true,

      },
      {
        headerName: this.scoreNameTranslate,
        field:'scoreName',
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth:160,
        tooltipField: 'scoreName',
        suppressMovable: true,

      },
      {
        headerName: this.dateLockTranslate,
        field:'entryLockDateFormat',
        cellStyle:{
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
        tooltipField: 'entryLockDateFormat',
        suppressMovable: true,
      },
      { headerName: this.statusTranslate,
        field:'statusName',
        cellStyle:param => {
          console.log(param)
          if (param.data.status === 0) {
            return{
              'font-weight': '600',
              'font-size': '12px',
              'align-items': 'center',
              color: '#D14343',
              display: 'flex',
              'justify-content': 'center',
              transform: 'translateX(-26px)',
            }
          }
          return{
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            color: '#101840',
            display: 'flex',
            'justify-content': 'center',
            transform: 'translateX(-26px)',
          }
        },
        minWidth: 130,
        maxWidth: 130,
        tooltipField: 'statusName',
        suppressMovable: true,
      },
      { headerName: this.updaterTranslate,field:'userUpdate',
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 150,
        tooltipField: 'userUpdate',
        suppressMovable: true,
      },
      { headerName: this.updateTimeTranslate,field:'updatedDateFormat',
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          display: 'flex'
        },
        minWidth:140,
        suppressMovable: true,
        tooltipField: 'updatedDateFormat',
      },
      { headerName: '',
        field:'',
        cellRendererFramework: ActionConfLockPointComponent,
        minWidth:30,
        maxWidth:30,
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          'justify-content': 'center'
        },
        suppressMovable: true,
      },
    ];
  }

  getCurrentYear() {
    this.classroomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.years = res;
      this.getListSemester();
    });
  }

  listeningIsLock() {
    this.configPointLockService.lockConf$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      if (val === true) {
        this.loadGridView();
      }
    });
  }

  listeningIsUnlock() {
    this.subscription = this.configPointLockService.unlockConf$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      if (val === true) {
        this.loadGridView();
      }
    });
  }

  listeningIsUpdate() {
    this.subscription = this.configPointLockService.updateConf$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      if (val === true) {
        this.loadGridView();
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  getListSemester() {
    console.log(this.years);
    if (this.years === '') {
      return;
    }
    this.configPointLockService.getListSemesterOfSchoolYear(this.years).pipe(takeUntil(this.unsubscribe$)).subscribe(resAPI => {
      if (resAPI.length === 0) {
        return;
      }
      this.formSearch.get('semester').setValue(resAPI.semesterNow.semester);
      this.semesterList = resAPI.schoolYearList.map(item => {
        return {
          ...item,
          semesterDisplay: this.mapSemester(item.semester)
        }
      });
      console.log(resAPI);
      this.getListGradeLevel();
    });
  }

  getListGradeLevel() {
    this.configPointLockService.getListGradeLevelToSearch().pipe(takeUntil(this.unsubscribe$)).subscribe(resAPI => {
      this.formSearch.get('gradeLevel').setValue(resAPI[0].code);
      this.gradeList = resAPI;
      console.log(resAPI);
    });
  }

  loadGridView() {
    const semester = this.formSearch.get('semester').value;
    const gradeCode = this.formSearch.get('gradeLevel').value;
    if (semester === '' || gradeCode === '') {
      return;
    }
    this.notChose();
    this.configPointLockService.tranferSemester(semester);
    this.checkIsConfig();
    this.configPointLockService.transferGradeLevel(gradeCode);
    this.configPointLockService.loadGridView(semester, gradeCode, this.years, this._page, this._pageSize).subscribe(resAPI => {
      let listData = [];
      console.log(resAPI);
      resAPI.content.forEach(item => {
        if (item.id === null) {
          item = {...item,
            entryLockDateFormat: '',
          };
        }
        if (item.updatedDate !== null && item.id !== null) {
          item = {...item,
            entryLockDateFormat: this.formatDate(item.entryLockDate),
            updatedDateFormat: this.formatDate(item.updatedDate)
          };
        }
        if(item.updatedDate === null && item.id !==null){
          item = {...item,
            entryLockDateFormat: this.formatDate(item.entryLockDate),
          };
        }
        listData = [...listData, item];
      });
      this.listConfEntryKeyDetail = listData;
      this.totalPage = resAPI.totalPages;
      this.rangeWithDots = this.commonService.pagination(
        this._page,
        this.totalPage
      );
      this.totalRecord = resAPI.totalElements;
      this.first = ((this._page - 1) * this._pageSize) +1;
      this.last = this.first + listData.length -1;
      this.gridApi.setRowData(this.listConfEntryKeyDetail);
      this.changeDetectorRef.detectChanges();
    });
  }

  buildFormSearch() {
    this.formSearch = this.fb.group({
      semester: '',
      gradeLevel: '',
    })
    this.formSearch.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(val => this.changeForm(val));
  }

  changeForm(val) {
    this._page = 1;
    this.loadGridView();
    this.configPointLockService.tranferSemester(val.semester);
    this.configPointLockService.transferGradeLevel(val.gradeLevel);
  }

  openAddDialog(action:string) {
    const dataConfig: any = {};
    dataConfig.years = this.years;
    dataConfig.gradeList = this.gradeList;
    dataConfig.semesterList = this.semesterList;
    dataConfig.gradeCurrent = this.formSearch.get('gradeLevel').value;
    dataConfig.semesterCurrent = this.formSearch.get('semester').value;
    this.matDialog.open(AddConfigComponent, {
      data: dataConfig,
      disableClose: true,
      hasBackdrop: true,
      width: '820px',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'add') {
        console.log(res.data);
        this.getListSemester();
        // this.getListGradeLevel();
        this.toastr.success(res.data.message);
      }
    });

  }

  openConfNotify() {
    const dataConfigNotify:any = {};
    dataConfigNotify.years = this.years;
    dataConfigNotify.semester = this.formSearch.get('semester').value;
    dataConfigNotify.gradeCode = this.formSearch.get('gradeLevel').value;
    this.matDialog.open(ConfigNotifyComponent,{
      data:dataConfigNotify,
      disableClose: true,
      hasBackdrop: true,
      width: '466px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.configPointLockService.configNotify(res.data).pipe(takeUntil(this.unsubscribe$)).subscribe(resAPI => {
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.loadGridView();
          }else{
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  unlockList() {
    if (this.rowCheckedList === null || this.rowCheckedList === undefined || this.rowCheckedList?.length === 0) {
      this.toastr.error(this.translate.instant('CONF_LOCK.MSG.SELECT_GRADE'));
      return;
    }
    let check = true;
    let checkIsConf = true;
    this.rowCheckedList.forEach(item => {
      if (item.id === null) {
        checkIsConf = false;
        return;
      }
      if (item.status === 1) {
        check = false;
        return;
      }
    });
    if (!checkIsConf) {
      this.toastr.error(this.translate.instant('CONF_LOCK.MSG.UNLOCK_FAIL'));
      return;
    }
    if (!check) {
      this.toastr.error(this.translate.instant('CONF_LOCK.MSG.UNLOCK_FAIL2'));
      return;
    }

    const dataConfirm = {
      title: this.translate.instant('CONF_LOCK.CONFIRM_TITLE'),
      message: this.translate.instant('CONF_LOCK.CONFIRM_MSG')
    };
    this.matDialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '418px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.configPointLockService.unlockList(this.rowCheckedList).pipe(takeUntil(this.unsubscribe$)).subscribe(resAPI => {
          this.rowCheckedList = [];
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.loadGridView();
          }else {
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  lockList() {
    if (this.rowCheckedList === null || this.rowCheckedList === undefined || this.rowCheckedList?.length === 0) {
      this.toastr.error(this.translate.instant('CONF_LOCK.MSG.SELECT_CONF'));
      return;
    }
    let check = true;
    let checkIsConf = true;
    this.rowCheckedList.forEach(item => {
      if(item.id === null){
        checkIsConf = false;
        return;
      }
      if (item.status === 0) {
        check = false;
        return;
      }
    });
    if (!checkIsConf) {
      this.toastr.error(this.translate.instant('CONF_LOCK.MSG.LOCK_FAIL'));
      return;
    }
    if (!check) {
      this.toastr.error(this.translate.instant('CONF_LOCK.MSG.LOCK_FAIL2'));
      return;
    }
    this.rowCheckedList.forEach(item => {
      const entryLockDate = formatDate(new Date(item.entryLockDate),'yyyy/MM/dd', 'en');
      const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      console.log(entryLockDate);
      if (today < entryLockDate) {
        check = false;
        return;
      }
    });
    if (!check) {
      this.toastr.error(this.translate.instant('CONF_LOCK.MSG.LOCK_FAIL3'));
      return;
    }
    const dataConfirm = {
      title: this.translate.instant('CONF_LOCK.CONFIRM_TITLE2'),
      message: this.translate.instant('CONF_LOCK.CONFIRM_MSG2')
    };
    this.matDialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '418px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.configPointLockService.lockList(this.rowCheckedList).pipe(takeUntil(this.unsubscribe$)).subscribe(resAPI => {
          this.rowCheckedList = [];
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.loadGridView();
          }else {
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  // Get row selected to transfer classroom to next year
  onRowSelected(event) {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
    this.rowCheckedList = listRowSelected;
  }

  notChose() {
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        row.setSelected(false);
      }
    });
  }

  // ==============================Paging=====================================

  page(page: number): void {
    this._page = page
    this.loadGridView();
    console.log(this._page);
  }

  prev(): void {
    this._page--
    if (this._page < 1) {
      this._page = 1
      return
    }
    console.log(this._page);

    this.loadGridView();
  }

  next(): void {
    this._page++
    if (this._page > this.totalPage) {
      this._page = this.totalPage;
      return;
    }
    console.log(this._page);
    this.loadGridView();
    // this.page(this.currentPage)
  }

  counter(i: number) {
    return new Array(i);
  }


  // ================Format date: dd/mm/yyyy ========================
  formatDate(originalDate: string): string {
    const date = new Date(originalDate)
    return `${('0'+date.getDate()).slice(-2)}/${('0'+(date.getMonth()+1)).slice(-2)}/${date.getFullYear()}`
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  checkIsConfig() {
    const semester = this.formSearch.get('semester').value;
    const grade = this.formSearch.get('gradeLevel').value;
    this.configPointLockService.checkIsConfig(this.years, semester, grade).subscribe(resAPI => {
      if (!resAPI.data) {
        this.toastr.warning(this.translate.instant('CONF_LOCK.MSG.GRADE_NOT_CONF'));
      }
      this.configPointLockService.changeIsConfig(resAPI.data);
    });
  }

  mapSemester(value) {
    if (!value) {
      return;
    }
    switch (value) {
      case '1':
        return this.translate.instant('GRADEBOOK.SEMESTER1');
      case '2':
        return this.translate.instant('GRADEBOOK.SEMESTER2');
      case '3':
        return this.translate.instant('GRADEBOOK.SEMESTER3');
      case '4':
        return this.translate.instant('GRADEBOOK.SEMESTER4');
      case '5':
        return this.translate.instant('GRADEBOOK.SEMESTER5');
      default:
        return value;
    }
  }

  translateLanguage() {
    this.sttTranslate = this.translate.instant('STUDENT.INFO.NO');
    this.typeSubjectTranslate = this.translate.instant('CONF_LOCK.TYPE_SUBJECT')
    this.scoreNameTranslate = this.translate.instant('CONF_LOCK.SCORE_NAME');
    this.dateLockTranslate = this.translate.instant('CONF_LOCK.DATE_LOCK');
    this.statusTranslate = this.translate.instant('STUDENT.INFO.STATUS.TEXT');
    this.lockedTranslate = this.translate.instant('CONF_LOCK.LOCKED');
    this.updaterTranslate = this.translate.instant('CONF_LOCK.UPDATER');
    this.updateTimeTranslate = this.translate.instant('CONF_LOCK.UPDATE_TIME')
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
