import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CheckboxColumnComponent, SelectableSettings} from '@progress/kendo-angular-grid';
import {MatDialog} from '@angular/material/dialog';
import {ActionShoolComponent} from '../school/action-shool/action-shool.component';
import {AttendanceStudentService} from "./attendance-student.service";
import {AgGridCheckboxComponent} from "./ag-grid-checkbox/ag-grid-checkbox.component";
import {ConfirmSaveComponent} from "./confirm-save/confirm-save.component";
import {ToastrService} from "ngx-toastr";
import {AgGridSelectComponent} from "./ag-grid-select/ag-grid-select.component";
import {placeholdersToParams} from "@angular/compiler/src/render3/view/i18n/util";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Subject, Subscription} from "rxjs";
import {SchoolYearService} from "../school-year/school-year.service";
import {createUrlResolverWithoutPackagePrefix} from "@angular/compiler";
import {AuthService} from "../../../../core/auth/_services";
import * as moment from "moment";
import {takeUntil} from "rxjs/operators";
import {NO_ROW_GRID_TEMPLATE} from "../../../../helpers/constants";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'attendance-student',
  templateUrl: './attendance-student.component.html',
  styleUrls: ['./attendance-student.component.scss']
})
export class AttendanceStudentComponent implements OnInit, AfterViewInit {
  unsubscribe$ = new Subject<void>();
  defaultColDef;
  loading = false;
  columnDefs = [
    {
      headerName: this.translate.instant(`ATTENDANCE_STUDENT.NUMBER`),
      field: 'no',
      valueGetter: param => {
        return param.node.rowIndex + (((this.currentPage - 1) * this.pageSize) + 1)
      },
      headerClass:'custom-merge-header-as',
      minWidth: 80,
      maxWidth: 80,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        top: '15px',
        color: '#101840',
        'justify-content': 'center',
        'left': '6px',
      },
      suppressMovable: true,
      pinned: 'left'

    },
    {
      headerName: this.translate.instant(`ATTENDANCE_STUDENT.STUDENT_CODE`),
      field: 'studentCode',
      headerClass:'custom-merge-header-as',
      minWidth: 160,
      maxWidth: 160,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#3366FF',
        // display: 'flex',
        top: '15px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden'
      },
      tooltipField: 'studentCode',
      suppressMovable: true,
      pinned: 'left'
    },
    {
      headerName: this.translate.instant(`ATTENDANCE_STUDENT.STUDENT_NAME`),
      field: 'studentName',
      headerClass:'custom-merge-header-as',
      minWidth: 160,
      maxWidth: 160,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'line-height': '20px',
        'align-items': 'center',
        color: '#101840',
        // display: 'flex',
        top: '15px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden'
      },
      tooltipField: 'studentName',
      suppressMovable: true,
      pinned: 'left'
    },
    {
      headerName: 'C',
      field: 'totalGoingSchool',
      headerClass:'custom-merge-header-as',
      minWidth: 50,
      maxWidth: 50,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'margin-left':'0',
        color: '#101840',
        // display: 'flex',
        top: '15px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
        'text-align':'center'
      },
      pinned: 'right',
      suppressMovable: true
    },
    {
      headerName: 'P',
      field: 'totalRestByReason',
      headerClass:'custom-merge-header-as',
      minWidth: 50,
      maxWidth: 50,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        // display: 'flex',
        top: '15px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
        'text-align':'center'
      },
      pinned: 'right',
      suppressMovable: true
    },
    {
      headerName: 'K',
      field: 'totalRestNoReason',
      headerClass:'custom-merge-header-as',
      minWidth: 50,
      maxWidth: 50,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        // display: 'flex',
        top: '15px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
        'text-align':'center'
      },
      pinned: 'right',

      suppressMovable: true
    },
    {
      headerName: 'TS',
      field: 'totalCount',
      headerClass:'custom-merge-header-as',
      minWidth: 50,
      maxWidth: 50,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        // display: 'flex',
        top: '15px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
        'text-align':'center'
      },
      pinned: 'right',
      suppressMovable: true
    }
  ];
  subscription: Subscription;
  semester;
  dataSemester;
  dataMonth;
  month;
  dataClassRoom;
  classRoom;
  schoolYear;
  rowSelect;
  currentUser;
  dataHoliday;
  formSearch: any = {};
  rowData = [];
  data;
  currentPage = 1;
  pageSize = 10;
  gridApi;
  headerHeight = 50;
  rowHeight = 56;
  gridColumnApi;
  cacheBlockSize = 10;
  setColumn;
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));;
  titleHead;
  rowDataChange = [];
  beforeData = [];
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  checkYear = true;
  yearSemester;
  constructor(private attendanceStudentService: AttendanceStudentService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private toast: ToastrService,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private classRoomService: ClassroomService,
              private translate: TranslateService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.getHoliday();
    this.loadCurrentYear();
  }

  loadCurrentYear(): void {
    this.subscription = this.classRoomService.yearCurrent$.subscribe(
      (currentYear) => {
        this.classRoom = null;
        this.semester = null;
        this.changeDetectorRef.detectChanges();
        this.schoolYear = currentYear;
        if (currentYear !== '') {
          const splitSchoolYear: any = this.schoolYear.split('-');
          const nowDate = new Date();
          for(let i = 0; i < splitSchoolYear.length; i++){
            if(splitSchoolYear[i] == nowDate.getFullYear()){
              this.checkYear = true;
              break;
            }
            else{
              this.checkYear = false;
            }
          }
          this.getSemester();
        }
      }
    );

  }

  getHoliday() {
    const obj: any = {type: 'holiday'};
    this.attendanceStudentService.getHoliday(obj).subscribe(res => {
      this.dataHoliday = res;
    })
  }
  goToPage(page: number) {
    for(let i=0;i<this.beforeData.length;i++){
      for(let j=0;j<this.rowData.length;j++){
        if(this.rowData[j].studentCode == this.beforeData[i].studentCode){
          this.checkRowChange(this.rowData[j]);
        }
      }
    }
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.search(page);
    }
  }
  checkRowChange(obj:any){
    if(this.rowDataChange.length>0){
      for (let i = 0; i< this.rowDataChange.length;i++) {
        for (let j = 0; j < obj.attendanceDetailDTOs.length; j++) {
          if (obj.attendanceDetailDTOs[j].studentCode == this.rowDataChange[i].studentCode) {
            this.rowDataChange.splice(i, 1);
            this.rowDataChange.push(...obj);
          }
          if (i == this.rowDataChange.length - 1 && obj.studentCode !== this.rowDataChange[i].studentCode) {
            this.rowDataChange.push(...obj);
          }
        }
      }
    }
    else{
      this.rowDataChange.push(...obj);
    }
  }

  getDateMonth() {
    const nowDate = new Date();
    const currentYear = nowDate.getFullYear();
    const currentDate: number = nowDate.getDate();
    const checkMonth: number = +nowDate.getMonth();
      const fromSemester = this.data.fromDate;
      const toSemester = this.data.toDate;
      const from = new Date(fromSemester);
      const to = new Date(toSemester);
      const fromDate: number = from.getDate();
      const fromMonth: number = from.getMonth();
      const toDate: number = to.getDate();
      const toMonth: number = to.getMonth();
    const month1: number = +this.month;
    const currentYearNumber: number = currentYear;
    const yearFromSemesterNumber: number = from.getFullYear();
    const yearToSemesterNumber: number = from.getFullYear();
    const date = month1 < 10 ? this.yearSemester + '-0' + month1 : this.yearSemester + '-'+month1;
    const getDaysInMonth = moment(date, 'YYYY-MM').daysInMonth();
    this.setColumn = [...this.columnDefs];
    for (let i = 1; i <= getDaysInMonth; i++) {
      const j = i < 10 ? '0' + i : i;
      const getDate = date + '-' + j;
      const printDate = new Date(date + '-' + j);
      const checkDateOld:number = +printDate.getDate();
      const checkMonthOld: number = +printDate.getMonth();
      let day = '';
      switch (printDate.getDay()) {
        case 0:
          day = this.translate.instant(`ATTENDANCE_STUDENT.SUNDAY`);
          break;
        case 1:
          day = this.translate.instant(`ATTENDANCE_STUDENT.MONDAY`);
          break;
        case 2:
          day = this.translate.instant(`ATTENDANCE_STUDENT.TUESDAY`);
          break;
        case 3:
          day = this.translate.instant(`ATTENDANCE_STUDENT.WEDNESDAY`);
          break;
        case 4:
          day = this.translate.instant(`ATTENDANCE_STUDENT.THURSDAY`);
          break;
        case 5:
          day = this.translate.instant(`ATTENDANCE_STUDENT.FRIDAY`);
          break;
        case 6:
          day = this.translate.instant(`ATTENDANCE_STUDENT.SATURDAY`);
          break;
      }
      for (let d = 0; d < this.dataHoliday.length; d++) {
        if (getDate === this.dataHoliday[d]) {
          this.rowSelect = {
            headerName: `${j + '/' + ((printDate.getMonth() + 1) < 10 ? '0'+(printDate.getMonth() + 1) :  (printDate.getMonth() + 1))}`,
            headerClass:'custom-merge-header-as1',
            minWidth: 100,
            maxWidth: 100,
            children: [{
              headerName: `${day}`,
              headerClass:'custom-merge-header-as1',
              field: `${printDate.getDate() + '/' + printDate.getMonth()}`,
              minWidth: 100,
              maxWidth: 100,
              cellStyle: {
                backgroundColor: '#F4B6B6'
              }
            }]
          };
          break;
        } else {
          if (printDate.getDay() !== 0 && printDate.getDay() !== 6) {
            if(checkDateOld > currentDate || checkDateOld <= Math.ceil(currentDate - 8) || checkMonthOld !== checkMonth || this.checkYear == false
                || i < fromDate && (fromMonth+1) == month1  && currentYearNumber >= yearFromSemesterNumber || i > toDate && (toMonth+1) == month1  && currentYearNumber <= yearToSemesterNumber){
              this.rowSelect = {
                headerName: `${j + '/' + ((printDate.getMonth() + 1) < 10 ? '0'+(printDate.getMonth() + 1) :  (printDate.getMonth() + 1))}`,
                headerClass:'custom-merge-header-as1',
                minWidth: 100,
                maxWidth: 100,
                children: [{
                  headerName: `${day}`,
                  headerClass:'custom-merge-header-as1',
                  minWidth: 90,
                  maxWidth: 90,
                  valueGetter: params => {
                    params.api.currentDate = getDate;
                    return params;
                  },
                  field: `${getDate}`,
                  cellRenderer: params =>{
                    for(let q =0; q < params.data.attendanceDetailDTOs.length; q++){
                      if(i < fromDate && (fromMonth+1) == month1 ||  i > toDate && (toMonth+1) == month1){
                        return '';
                      }
                      if(params.data.attendanceDetailDTOs[q].date == getDate){
                        return `<select class="select-op-as" disabled="true" ng-reflect-model="${params.data.attendanceDetailDTOs[q].checkDate}"><option value="${params.data.attendanceDetailDTOs[q].checkDate}">${params.data.attendanceDetailDTOs[q].checkDate}</option></select>`;
                      }
                      if(q == params.data.attendanceDetailDTOs.length - 1){
                        return `<select class="select-op-as" disabled="true"><option>-</option></select>`;
                      }
                    }
                  },
                  cellStyle: i < fromDate && (fromMonth+1) == month1  || i > toDate && (toMonth+1) == month1  ?{
                    backgroundColor: '#EDEFF5',
                    'padding-left': '15px'
                  } : {
                    'padding-left': '15px'
                  }
                }],
                suppressMovable: true
              };
            }
            else{
            this.rowSelect = {
              headerName: `${j + '/' + ((printDate.getMonth() + 1) < 10 ? '0'+(printDate.getMonth() + 1) :  (printDate.getMonth() + 1))}`,
              minWidth: 100,
              maxWidth: 100,
              headerClass: currentDate == printDate.getDate() ?'current-date':'custom-merge-header-as1',
              children: [{
                headerName: `${day}`,
                headerClass: currentDate == printDate.getDate() ?'current-date':'custom-merge-header-as1',
                valueGetter: params => {
                  params.api.currentDate = getDate;
                  return params;
                },
                field: `${getDate}`,
                minWidth: 100,
                maxWidth: 100,
                cellRendererFramework: AgGridSelectComponent,
                cellStyle: {
                  'margin-left': '10px'
                }
              }],
              suppressMovable: true
            };
            }
          } else if (printDate.getDay() == 0) {
            this.rowSelect = {
              headerName: `${j + '/' + ((printDate.getMonth() + 1) < 10 ? '0'+(printDate.getMonth() + 1) :  (printDate.getMonth() + 1))}`,
              headerClass:'custom-merge-header-as1',
              minWidth: 100,
              maxWidth: 100,
              children: [{
                headerName: `${day}`,
                headerClass:'custom-merge-header-as1',
                field: `${printDate.getDate() + '/' + printDate.getMonth()}`,
                minWidth: 100,
                maxWidth: 100,
                cellStyle: {
                  backgroundColor: '#DCF2EA'
                }
              }],
              suppressMovable: true
            };
          } else if (printDate.getDay() == 6) {
            this.rowSelect = {
              headerName: `${j + '/' + ((printDate.getMonth() + 1) < 10 ? '0'+(printDate.getMonth() + 1) :  (printDate.getMonth() + 1))}`,
              headerClass:'custom-merge-header-as1',
              minWidth: 100,
              maxWidth: 100,
              children: [{
                headerName: `${day}`,
                headerClass:'custom-merge-header-as1',
                field: `${printDate.getDate() + '/' + printDate.getMonth()}`,
                minWidth: 100,
                maxWidth: 100,
                cellStyle: {
                  backgroundColor: '#FFEFD2'
                }
              }],
              suppressMovable: true
            };
          }
        }
      }
      this.setColumn.push(this.rowSelect);
    }
    this.gridApi.setColumnDefs(this.setColumn);
    this.changeDetectorRef.detectChanges();
  }

  search(page: number) {
    this.loading = true;
    this.currentPage = page;
    this.formSearch.years = this.schoolYear;
    this.formSearch.semester = this.semester;
    this.formSearch.month = this.month;
    this.formSearch.currentClassCode = this.classRoom;
    this.formSearch.currentPage = this.currentPage;
    this.formSearch.pageSize = this.pageSize;
    this.attendanceStudentService.search(this.formSearch).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.loading= false;
      this.data = res;
      this.rowData = res.lstData;
      this.yearSemester = res.currentYear;
      for (let i = 0; i < this.rowDataChange.length; i++) {
        for (let j = 0; j < this.rowData.length; j++) {
          if (this.rowDataChange[i].studentCode == this.rowData[j].studentCode) {
              this.rowData[j] = this.rowDataChange[i];
          }
        }
      }

      if (res.totalRecord > 0) {
        this.total = res.totalRecord;
        this.totalPage = Math.ceil(this.total / this.pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this.currentPage,
          this.totalPage
        );
        this.first = this.pageSize * (this.currentPage - 1) + 1;
        this.last = this.first + res.lstData.length - 1;
      } else{
        this.total = 0;
        this.rangeWithDots = [];
        this.first = 0;
        this.last = 0;
        this.rowData = [];
      }
      this.changeDetectorRef.detectChanges();
      this.getDateMonth();
    });
    this.attendanceStudentService.search(this.formSearch).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.beforeData = res.lstData;
    });
  }

  getSemester() {
    const obj: any = {};
    obj.years = this.schoolYear;
    this.attendanceStudentService.getSemesterByYear(obj).subscribe(res => {
      this.dataSemester = res;
      // set default value semester
      if(res.length > 0){
      res.forEach(item => {
        if (item.defaultValue) {
          this.semester = item.value;
        }
      })
      if (this.semester == null) {
        this.semester = res[0].value;
      }

      }
      this.getMonth();
      this.changeDetectorRef.detectChanges();
    });
  }

  updateData() {
    this.loading = true;
    for(let i=0;i<this.beforeData.length;i++){
      for(let j=0;j<this.rowData.length;j++){
        if(this.rowData[j].studentCode == this.beforeData[i].studentCode){
          this.checkRowChange(this.rowData[j]);
        }
      }
    }
    const date = new Date();
    this.data.month = this.month < 10 ? '0' + this.month : this.month;
    this.data.semester = this.semester;
    this.data.currentYear = date.getFullYear();
    this.data.years = this.schoolYear;
    this.data.lstData = this.rowDataChange;
    this.attendanceStudentService.save(this.data).subscribe(res => {
      this.loading = false;
      if (res.status == 'OK') {
        this.toast.success(res.message);

      } else {
        this.toast.error(res.message);
      }
      this.rowDataChange = [];
      this.search(1);
    });
  }

  getMonth() {
    const obj: any = {};
    obj.years = this.schoolYear;
    obj.semester = this.semester;
    this.attendanceStudentService.getMonthBySemesterAndYear(obj).subscribe(res => {
      this.dataMonth = res;
      // set default value month
      if(res !== null){
      res.forEach(item => {
        if (item.defaultValue) {
          this.month = item.value;
        }
      })
      if (this.month == null) {
        this.month = res[0].value;
      }

      }
      this.getClassRoom();
      this.search(1);
      this.changeDetectorRef.detectChanges();

    })
  }

  getClassRoom() {
    const obj: any = {};
    obj.userId = this.currentUser.id;
    obj.years = this.schoolYear;
    this.attendanceStudentService.getClassroomByUserAndYear(obj).subscribe(res => {
      this.titleHead = null;
      this.dataClassRoom = res;
      if(res.length > 0){
      this.classRoom = res[0].value;
      this.titleHead = res[0].name + ' ('+this.translate.instant(`ATTENDANCE_STUDENT.NOTE1`)+')';
      }
      this.search(1);
      this.changeDetectorRef.detectChanges();
    });
  }

  selectMonth(event) {
    this.month = event.value;
    this.changeDetectorRef.detectChanges();
  }

  selectSemester(event) {
    this.semester = event.value;
    this.month = null;
    this.getMonth();
  }

  selectClass(event) {
    this.classRoom = event.value;
    this.titleHead = event.name + this.translate.instant(`ATTENDANCE_STUDENT.NOTE1`);
    this.search(1);
  }

  ngAfterViewInit() {
  }
  gridColumnsChanged(param) {
    setTimeout( () => {
      this.resizeTwoLastColumns()
      param.api.sizeColumnsToFit()
    }, 500)
  }
  gridSizeChanged(params) {
    setTimeout( () => {
      params.api.sizeColumnsToFit()
      this.resizeTwoLastColumns()
    }, 500)
  }
  resizeTwoLastColumns(): void {
    const header = (document.querySelector('.ag-pinned-right-header') as HTMLElement)
    const body = (document.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
    body.style.minWidth = `${header.offsetWidth}px`
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      this.resizeTwoLastColumns()
    }, 500);
  }

  exportFile() {
    this.formSearch.years = this.schoolYear;
    this.formSearch.semester = this.semester;
    this.formSearch.month = this.month;
    this.formSearch.currentClassCode = this.classRoom;
    this.attendanceStudentService.exportFile(this.formSearch).subscribe((responseMessage) => {
      const file = new Blob([responseMessage], {type: 'application/vnd.ms-excel'});
      const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const anchor = document.createElement('a');
      anchor.download = this.translate.instant('ATTENDANCE_STUDENT.EXCEL_FILE_NAME')+this.classRoom;
      anchor.href = fileURL;
      anchor.click();
    });

  }


}
