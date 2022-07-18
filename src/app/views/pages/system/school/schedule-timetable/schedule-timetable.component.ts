import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../../environments/environment';
import {SchoolServices} from '../school.service';
import {DatePipe, Location} from '@angular/common';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {ModalImportComponent} from './modal-import/modal-import.component';
import {SelectScheduleTimetableComponent} from './select-schedule-timetable/select-schedule-timetable.component';
import {groupBy} from 'lodash';
import {CommonFunction} from '../../../../../core/service/utils/common-function';

export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-schedule-timetable',
  templateUrl: './schedule-timetable.component.html',
  styleUrls: ['./schedule-timetable.component.scss', 'modal-import/modal-import.component.scss']
})

export class ScheduleTimetableComponent implements OnInit {
  @ViewChild('file') file: ElementRef;
  empty = true;
  delete = false;
  emptyUpdate = true;
  deleteUpdate = false;
  formData;
  isSubmit = false;
  formatDate = 'yyyy-MM-dd';
  dropDownDefault: DataDropdown = {
    code: '',
    name: null
  };
  dynamicTable = [];
  textDate;
  applyDateUpdate;
  showErr = false;
  showErrUpdate = false;
  messageErrUpdate: string;
  messageErr;
  modalRef: BsModalRef;
  modalRefApprove: BsModalRef;
  form: FormGroup;
  formImport: FormGroup;
  listGradeLevels = [];
  listClass = [];
  listScoreRatingDefault = [];
  listSemester = [];
  dataGrid: any = [];
  rowCheckedList = [];
  rangeWithDots;

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
  noRowsTemplate = this.translate.instant('INBOX_ADMIN.NO_INFOR');
  total = 0;
  totalPage = 0;
  subscription;
  years;
  fileName;
  fileSize;
  resultImport;
  isMe;
  isUpdate = false;
  isShowImport = false;
  scorePopup;
  applyDateBefore;
  frameworkComponents;
  roleParam = environment.ROLE;
  role;
  fromDate;
  toDate;
  dataGroup;
  listSubjectTeacher = [];
  listSubjectTeacherUpdate = [];
  columnDefs = [
    {
      headerName: 'THỨ NGÀY',
      field: 'dayName',
      minWidth: 150,
      maxWidth: 150,
      headerClass: 'custom-merge-header'
      // rowSpan: this.rowSpan,
      // cellClassRules: {
      //   'cell-span': 'value==="Thứ 2"',
      // },
    },
    {
      headerName: 'TIẾT', field: 'lessonCode',
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
      minWidth: 100,
      maxWidth: 100,
      tooltipField: 'lesson',
      headerClass: 'custom-merge-header'
    }, {
      headerName: 'BUỔI SÁNG',
      cellStyle: {
        'justify-content': 'center',
        'align-items': 'center',
      },
      children: [
        {
          headerName: 'TÊN MÔN HỌC', field: 'subjectCodeAm',
          cellRendererFramework: SelectScheduleTimetableComponent,
          width: '22.5%',
          cellStyle: params =>
            params.column.colId === 'subjectCodeAm' && this.isUpdate === true ?
              {
                'pointer-events': 'auto',
              }
              : {
                'pointer-events': 'none',
              },
          cellRendererParams: {
            onClick: this.clickSubject.bind(this),
          },
        },
        {
          headerName: 'GIÁO VIÊN GIẢNG DẠY', field: 'teacherCodeAm',
          cellRendererFramework: SelectScheduleTimetableComponent,
          width: '22.5%',
          cellStyle: () =>
            this.isUpdate === true ?
              {
                'margin-left': '5px',
              }
              : {
                'margin-left': '5px',
              },
        },
      ]
    }, {
      headerName: 'BUỔI CHIỀU',
      children: [
        {
          headerName: 'TÊN MÔN HỌC', field: 'subjectCodePm',
          cellRendererFramework: SelectScheduleTimetableComponent,
          width: '22.5%',
          cellStyle: params =>
            params.column.colId === 'subjectCodePm' && this.isUpdate === true ?
              {
                'pointer-events': 'auto',
                background: '#F4F6FA'
              }
              : {
                'pointer-events': 'none',
                background: '#ffffff'

              },
          cellRendererParams: {
            onClick: this.clickSubject.bind(this),
          },
        },
        {
          headerName: 'GIÁO VIÊN GIẢNG DẠY', field: 'teacherCodePm',
          cellRendererFramework: SelectScheduleTimetableComponent,
          width: '22.5%',
          cellStyle: () =>
            this.isUpdate === true ?
              {
                'margin-left': '5px',
                background: '#F4F6FA'
              }
              : {
                'margin-left': '5px',
                background: '#F4F6FA'
              },
        },
      ]
    },
  ];
  dataFromClass;
  langKey;
  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private commonService: CommonServiceService,
              private toatr: ToastrService,
              private schoolServices: SchoolServices,
              private datePipe: DatePipe,
              private matDialog: MatDialog,
              private location: Location
  ) {
    this.frameworkComponents = {
      buttonRenderer: SelectScheduleTimetableComponent,
    };
    this.langKey = (localStorage.getItem('language'));
  }

  ngOnInit(): void {
    // a lấy this.dataFromClass.gradeLevel và this.dataFromClass.id đổ vào khối và lớp giúp em nhé
    // e đọc mãi k hiểu cái luồng a chạy thế nào :D
    this.dataFromClass = this.location.getState();
    console.log(this.dataFromClass);
    this.applyDateUpdate = null;
    this.getYear();
    this.lStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.role = this.checkRole();
    this.dropDownDefault.name = this.translate.instant('TEACHER_RATING.ALL');
  }

  buildForm() {
    this.form = this.formBuilder.group({
      classCode: [null, [Validators.required]],
      gradeLevel: ['', [Validators.required]],
      applyDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      semester: ['', [Validators.required]]
    });
    this.cdr.detectChanges();

    this.form.get('semester').valueChanges.subscribe(val => {
      const data = this.listSemester.find(it => it.semester === val);
      if (data) {
        this.fromDate = this.datePipe.transform(data.fromDate, this.formatDate);
        this.toDate = this.datePipe.transform(data.toDate, this.formatDate);
      }
    });
    this.form.get('gradeLevel').valueChanges.subscribe(val => this.getClass(val));
    this.form.get('classCode').valueChanges.subscribe(val => this.getSubject(val));
  }

  clickSubject(api) {
    const isMorning = api.colDef.field === 'subjectCodeAm';
    if (api.value) {
      const data = this.listSubjectTeacher.find(it => it.subjectCode === api.value);
      api.data[`${isMorning ? 'subjectCodeAm' : 'subjectCodePm'}`] = api.value;
      api.data[`${isMorning ? 'teacherCodeAm' : 'teacherCodePm'}`] = data ? data.teacherCode : null;
    } else {
      api.data[`${isMorning ? 'subjectCodeAm' : 'subjectCodePm'}`] = null;
      api.data[`${isMorning ? 'teacherCodeAm' : 'teacherCodePm'}`] = null;
    }
    api.api.refreshCells(api);
  }

  clickSubjectTable(isMorning, idx, value) {
    if (value) {
      const data = this.listSubjectTeacher.find(it => it.subjectCode === value);
      this.dataGrid[idx][`${isMorning ? 'teacherCodeAm' : 'teacherCodePm'}`] = data ? data.teacherCode : null;
    } else {
      this.dataGrid[idx][`${isMorning ? 'teacherCodeAm' : 'teacherCodePm'}`] = null;
    }
  }

  getData() {
    forkJoin(
      this.schoolServices.getGradeLevels(),
    ).subscribe(([resGradeLevels]) => {
      this.listGradeLevels = resGradeLevels;
      if (resGradeLevels.length > 0) {
        if (this.dataFromClass && this.dataFromClass.gradeLevel) {
          this.form.get('gradeLevel').setValue(this.dataFromClass.gradeLevel);
          this.dataFromClass.gradeLevel = null;
        } else {
          this.form.get('gradeLevel').setValue(resGradeLevels[0].id);
        }
      }
    });
  }

  getClass(gradeLevel) {
    const body = {
      gradeLevel,
      years: this.years
    };
    this.schoolServices.getClass(body).subscribe(res => {
      this.listClass = res && res.data ? res.data : [];
      this.listClass.map(it => it.show = it.code + ' - ' + it.name);
      if (this.dataFromClass && this.dataFromClass.code) {
        this.form.get('classCode').setValue(this.dataFromClass.code);
        this.dataFromClass.code = null;
      } else {
        this.form.get('classCode').setValue(res && res.data.length > 0 ? res.data[0].code : null);
      }
    }, () => this.listClass = []);
  }

  getSubject(classCode) {
    const data = this.listClass.find(it => it.code === classCode);
    if (!data) {
      return;
    }
    // tslint:disable-next-line:forin
    const body = {
      classCode,
      semester: this.form.value.semester,
      schoolYear: this.years
    };
    forkJoin(
      this.schoolServices.getSubject(body),
    ).subscribe(([resSubject]) => {
      this.listSubjectTeacher = resSubject ? resSubject : [];
      if (this.listSubjectTeacher.length > 0) {
        this.listSubjectTeacher.map(it => {
          it.nameSubject = it.subjectCode + ' - ' + it.subjectName;
        });
      }
      if (!this.isSubmit) {
        this.searchEvent();
      }
    }, () => {
      this.listSubjectTeacher = [];
    });
  }

  cancelImport() {
    this.modalRef.hide();
  }

  exportFile() {
    const data = this.form.value;
    const grade = this.listGradeLevels.find(it => Number(it.id) === Number(data.gradeLevel));
    // tslint:disable-next-line:forin
    const body = Object.assign({}, data, {
      schoolYear: this.years, appType: 'LESSON', apType: 'DAY',
      gradeLevel: grade ? grade.code : data.gradeLevel,
      langKey: this.langKey
    });
    const fileName = this.translate.instant('SCHEDULE_TIMETABLE.NAME_FILE') + `${data ? data.classCode : ''}_${moment().format('DDMMYYYY').toString()}.xls`;
    this.schoolServices.exportData(body, fileName);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 50);
  }


  onRowSelected(event) {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
    this.rowCheckedList = listRowSelected;
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  // ==============================Paging=====================================

  // tooltip
  formatToolTip(params: any) {
    const lineBreak = false;
    const toolTipString = 'Hello World';
    return {toolTipString, lineBreak};
  }

  searchEvent() {
    this.isSubmit = true;
    const data = this.form.value;
    if (!data.classCode || !data.gradeLevel) {
      return;
    }
    this.changeApplyDate();
    if (this.showErr) {
      if (!this.messageErr) {
        this.dataGrid = [];
        this.noRowsTemplate = this.translate.instant('INBOX_ADMIN.NO_INFOR');
      }
      return;
    }
    const grade = this.listGradeLevels.find(it => Number(it.id) === Number(data.gradeLevel));
    // tslint:disable-next-line:forin
    const body = Object.assign({}, data, {
      schoolYear: this.years,
      appType: 'LESSON',
      apType: 'DAY',
      gradeLevel: grade ? grade.code : data.gradeLevel,
      langKey: this.langKey
    });
    this.schoolServices.onSearch(body).subscribe(res => {
      // res.data = [{name: 'MYTHUAT', subject: 'L6D154'}, {name1: 'HOAHOC07', subject1: 'L6D124'}];
      this.applyDateBefore = null;
      let isConfig = false;
      this.dynamicTable = [];
      for (const it of res) {
        if (it.subjectCodeAm || it.subjectCodePm) {
          isConfig = true;
          break;
        }
      }

      if (!isConfig) {
        const itemClass = this.listClass.find(it => it.code === data.classCode);
        // const message = `${itemClass ? itemClass.show : ''} chưa được cấu hình Thời khoá biểu`;
        // const message = 'Chưa có thông tin';
        const message = this.translate.instant('INBOX_ADMIN.NO_INFOR');
        this.toatr.warning(message);
        this.noRowsTemplate = message;
        this.dataGrid = [];
        this.dataGroup = [];
      } else {
        res.map(it => {
          it.listSubjectTeacher = this.listSubjectTeacher;
          return it;
        });
        for (const it of res) {
          if (it.applyDate && !this.applyDateBefore) {
            this.applyDateBefore = it.applyDate;
          } else if (it.applyDate) {
            const current = new Date(it.applyDate).getTime();
            const before = new Date(this.applyDateBefore).getTime();
            if (current > before) {
              this.applyDateBefore = it.applyDate;
            }
          }
        }

        this.dataGroup = groupBy(res, 'dayCode');

        this.dynamicTable.push(0);
        this.dynamicTable.push(this.dataGroup[`t2`].length);
        this.dynamicTable.push(this.dynamicTable[1] + this.dataGroup[`t3`].length);
        this.dynamicTable.push(this.dynamicTable[2] + this.dataGroup[`t4`].length);
        this.dynamicTable.push(this.dynamicTable[3] + this.dataGroup[`t5`].length);
        this.dynamicTable.push(this.dynamicTable[4] + this.dataGroup[`t6`].length);

        this.dataGrid = res;

      }
      // this.gridApi.sizeColumnsToFit();
      // this.gridApi.setRowData(this.dataGrid);
      this.cdr.detectChanges();
    });
  }

  rowSpan(params) {
    return this.dataGroup && this.dataGroup[params.dayCode].length || 0;
  }


  openModal() {
    this.matDialog
      .open(ModalImportComponent, {
        panelClass: 'school-year',
        data: null,
        disableClose: true,
        hasBackdrop: true,
        maxWidth: '500px',
        minWidth: '500px',
        width: '500px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === true) {
          this.searchEvent();
        }
      });
  }

  upload(file) {

    this.fileName = file[0].name;
    this.fileSize = file[0].size;

    if (file.length === 0) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.BLANK'));
      this.isShowImport = true;
      return;
    }
    if (!(file[0].name.includes('.xlsx') || file[0].name.includes('.xls'))) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.FORMAT'));
      this.isShowImport = true;
      return;
    }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formData = formData;
    this.isShowImport = false;
  }

  checkRole() {
    const roleNormal = [this.roleParam.GV_BM, this.roleParam.GV_CN, this.roleParam.ADMIN];
    const roleTK = [this.roleParam.TK];
    const roleADMIN = [this.roleParam.HP, this.roleParam.HT];

    const role = this.lStorage.authorities;
    if (role.length > 0) {
      for (const data of role) {
        if (roleNormal.includes(data)) {
          return 0;
        }
        if (roleTK.includes(data)) {
          return 1;
        }
        if (roleADMIN.includes(data)) {
          return 2;
        }
      }
    }
    return null;
  }

  changeApplyDate() {
    const dateApply = this.form.value.applyDate;
    if (dateApply === '' || dateApply === undefined) {
      if (this.empty || this.delete) {
        this.showErr = true;
        // this.messageErr = 'Ngày áp dụng không được để trống';
        this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLYDATE_NOT_BLANK');
        return;
      }

      this.empty = false;

      this.showErr = true;
      // this.messageErr = ' Ngày áp dụng không tồn tại';
      this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLYDATE_NOT_REQUIRT');
      return;
    }
    const dateValue = new Date(dateApply).getTime();

    let includeSemester = false;

    for (const it of this.listSemester) {
      const from = new Date(it.fromDate).getTime();
      const to = new Date(it.toDate).getTime();
      if (dateValue > from && dateValue < to) {
        includeSemester = true;
        break;
      }
    }

    if (includeSemester === false) {
      this.showErr = true;
      this.messageErr = null;
      return;
    }

    // check them endDate
    const fromDate = new Date(this.fromDate).getTime();
    const toDate = new Date(this.toDate).getTime();
    if (dateValue < fromDate || dateValue > toDate) {
      this.showErr = true;
      // this.messageErr = `Ngày áp dụng không thuộc học kì đã chọn của năm học ${this.years}`;
      this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLY_DATE_NOT_YEAR') + ' ' + this.years;
      return;
    }
    this.showErr = false;
    this.messageErr = '';
  }

  changeApplyDateUpdate() {
    console.log(this.applyDateUpdate);
    if (this.applyDateUpdate === '' || this.applyDateUpdate === undefined || this.applyDateUpdate === null) {
      if (this.emptyUpdate || this.deleteUpdate) {
        this.showErrUpdate = true;
        // this.messageErrUpdate = 'Ngày áp dụng không được để trống';
        this.messageErrUpdate = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLYDATE_NOT_BLANK');
        return;
      }

      this.emptyUpdate = false;

      this.showErrUpdate = true;
      // this.messageErrUpdate = ' Ngày áp dụng không tồn tại';
      this.messageErrUpdate = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLYDATE_NOT_REQUIRT');
      return;
    } else {

      const dateNow = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      const dateValue = new Date(this.applyDateUpdate).getTime();
      const newDate = new Date().getTime();

      // check them endDate
      const fromDate = new Date(this.fromDate).getTime();
      const toDate = new Date(this.toDate).getTime();
      if (dateValue < fromDate || dateValue > toDate) {
        this.showErrUpdate = true;
        // this.messageErrUpdate = `Ngày áp dụng không thuộc học kì đã chọn của năm học ${this.years}`;
        this.messageErrUpdate = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLY_DATE_NOT_YEAR') + ' ' +  this.years;
        this.cdr.detectChanges();
        return;
      }

      if (dateValue < newDate && dateNow !== this.applyDateUpdate) {
        this.showErrUpdate = true;
        // this.messageErrUpdate = `Ngày áp dụng phải lớn hơn hoặc bằng ngày hiện tại`;
        this.messageErrUpdate = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLY_DATE_TODAY');
        return;
      }
      console.log(this.applyDateBefore);
      console.log(this.applyDateUpdate);
      if (this.applyDateBefore) {
        const applyDateBefore = new Date(this.applyDateBefore).getTime();
        if (dateValue < applyDateBefore) {
          this.showErrUpdate = true;
          // this.messageErrUpdate = `Ngày áp dụng Thời khoá biểu phải lớn hơn hoặc bằng ngày áp dụng của Thời khoá biểu trước đó`;
          this.messageErrUpdate = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLY_DATE_TIMETABLE_BEFOR');
          this.cdr.detectChanges();
          return;
        }
      }

      if (new Date(this.applyDateUpdate).getDay() !== 1) {
        this.showErrUpdate = true;
        // this.messageErrUpdate = 'Ngày áp dụng phải là thứ 2 đầu tuần';
        this.messageErrUpdate = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLYDATE_OF_MONDAY');
        return;
      }
    }

    this.cdr.detectChanges();
    this.showErrUpdate = false;
    this.messageErrUpdate = '';
  }

  getYear() {
    this.classroomService.yearCurrent$.subscribe(res => {
      this.years = res;
      if (!this.form && this.years) {
        this.buildForm();
        this.getData();
      }
      if (this.years) {
        this.getDateToFrom(this.years);
        this.showErr = false;
        this.messageErr = '';
      }
    });
  }

  getDateToFrom(year: any) {
    this.schoolServices.getYear(year).subscribe(res => {
      this.listSemester = res && res.semesterList ? res.semesterList : [];
      if (this.listSemester.length > 0) {
        this.listSemester.map(it => {
          it.label = CommonFunction.mapSemester(it.semester).replace('Học kỳ', this.translate.instant('STUDENT.SEMESTER2'));
          return it;
        })
      }
      this.form.get('semester').setValue(res && res.semesterCurrent ? res.semesterCurrent.semester : null);
    });
  }

  clickUpdate() {
    this.isUpdate = true;

    const item = {
      id: null,
      subjectCode: '',
      teacherCode: '',
      nameSubject: this.translate.instant('TEACHER.PLACEHOLDER_SELECT'),
      teacherName: '',
      subjectName: this.translate.instant('TEACHER.PLACEHOLDER_SELECT')
    };

    const list: any[] = JSON.parse(JSON.stringify(this.listSubjectTeacher));
    list.unshift(item);
    this.dataGrid.map(it => {
      it.subjectCodeAm = it.subjectCodeAm ? it.subjectCodeAm : '';
      it.subjectCodePm = it.subjectCodePm ? it.subjectCodePm : '';
      it.teacherCodeAm = it.teacherCodeAm ? it.teacherCodeAm : '';
      it.teacherCodePm = it.teacherCodePm ? it.teacherCodePm : '';
      it.listSubjectTeacher = list;
      return it;
    });
    this.listSubjectTeacherUpdate = list;
    // this.gridApi.setRowData(this.dataGrid);
  }

  clickCancel() {
    this.isUpdate = false;
    this.searchEvent();
  }

  updateData() {
    this.changeApplyDateUpdate();
    if (this.showErrUpdate) {
      return;
    }

    const dataGrid: any[] = JSON.parse(JSON.stringify(this.dataGrid));
    dataGrid.forEach(it => delete it.listSubjectTeacher);

    const data = this.form.value;
    const grade = this.listGradeLevels.find(it => Number(it.id) === Number(data.gradeLevel));
    // tslint:disable-next-line:forin
    const body = Object.assign({}, data, {
      schoolYear: this.years,
      gradeLevel: grade ? grade.code : data.gradeLevel,
      applyDate: this.applyDateUpdate,
      scheduleConfs: dataGrid
    });

    this.schoolServices.onUpdate(body).subscribe((res: any) => {
      this.toatr.success(this.translate.instant('SCHEDULE_TIMETABLE.UPDATE.UPDATE_MSG'));
      this.isUpdate = false;
      this.modalRefApprove.hide();
      this.searchEvent();
    }, err => {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.ERROR'));
    });
  }

  openModalUpdate(template: TemplateRef<any>) {
    let isCheck = false;
    for (const it of this.dataGrid) {
      if (it.subjectCodeAm || it.subjectCodePm) {
        isCheck = true;
        break;
      }
    }

    if (!isCheck) {
      // this.toatr.error('Thời khóa biểu chưa được cấu hình');
      this.toatr.error(this.translate.instant('SCHEDULE_TIMETABLE.MSG.TIMETABLE_NOT_CONFIG'));
      return;
    }
    this.applyDateUpdate = null;
    this.showErrUpdate = false;
    this.modalRefApprove = this.modalService.show(
      template,
      Object.assign({}, {class: 'addnew-unit-md modal-dialog-custom'})
    );
  }


  getTooltip() {
    const classCode = this.form.value.classCode;
    if (classCode) {
      const item = this.listClass.find(it => it.code === classCode);
      return item ? item.show : '';
    }
    return '';
  }

  change(event) {
    console.log(event);
  }

  keyUpDate(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      this.empty = false;
      this.delete = false;
    }
    if (event.keyCode === 8) {
      this.delete = true;
    }
  }

  keyUpDateUpdate(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      this.emptyUpdate = false;
      this.deleteUpdate = false;
    }
    if (event.keyCode === 8) {
      this.deleteUpdate = true;
    }
  }


  tooltip(value, isTeacher) {
    if (isTeacher) {
      const data = this.listSubjectTeacher.find(it => it.teacherCode === value);
      return data ? data.teacherName : null;
    } else {
      const data = this.listSubjectTeacher.find(it => it.subjectCode === value);
      return data ? data.nameSubject : null;
    }
  }
}
