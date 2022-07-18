import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TABLE_CELL_STYLE, NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';
import { ClassroomService } from 'src/app/core/service/service-model/classroom.service';
import { convertDateToString } from 'src/app/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-student-reserve',
  templateUrl: './student-reserve.component.html',
  styleUrls: ['./student-reserve.component.scss']
})
export class StudentReserveComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  MAX_HEIGHT_GRID = 500
  MIN_HEIGHT_GRID = 170

  columnReserve = [];
  rowDataReserve = [];
  totalReserve = 0;

  columnLeaveSchool = [];
  rowDataLeaveSchool = [];
  totalLeaveSchool = 0;

  overlayNoRowsTemplate
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;

  @Input() studentCode: any;

  leaveStyle = {
    height: `${this.MIN_HEIGHT_GRID}px`,
    marginBottom: '40px'
  }

  reserveStyle = {
    height: `${this.MIN_HEIGHT_GRID}px`,
    marginBottom: '40px'
  }

  constructor(
    private classRoomService: ClassroomService,
    private studentService: StudentsService,
    private toaStr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {

    TABLE_CELL_STYLE.display = 'block'

    this.columnReserve = [
      {
        headerName: this.translate.instant('STUDENT.INFO.NO'),
        field: 'index',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.RESERVE.DATE'),
        field: 'createdDate',
        tooltipField: 'createdDate',
        minWidth: 210,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.RESERVE.OLD_CLASS'),
        field: 'className',
        tooltipField: 'className',
        minWidth: 180,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.RESERVE.SEMESTER'),
        field: 'semester',
        tooltipField: 'semester',
        minWidth: 180,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.YEAR'),
        field: 'schoolYear',
        tooltipField: 'schoolYear',
        minWidth: 180,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.RESERVE.REASON'),
        field: 'reason',
        tooltipField: 'reason',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
    ];

    this.columnLeaveSchool = [
      {
        headerName: this.translate.instant('STUDENT.INFO.NO'),
        field: 'index',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.LEAVE.DATE'),
        field: 'createdDate',
        tooltipField: 'createdDate',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.RESERVE.OLD_CLASS'),
        field: 'className',
        tooltipField: 'className',
        minWidth: 180,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.SEMESTER'),
        field: 'semester',
        tooltipField: 'semester',
        minWidth: 180,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.YEAR'),
        field: 'schoolYear',
        tooltipField: 'schoolYear',
        minWidth: 180,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.LEAVE.REASON'),
        field: 'reason',
        tooltipField: 'reason',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
    ];
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'))
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  gridSizeChanged(params): void {
    params.api.sizeColumnsToFit();
    this.removeStyle()
  }

  ngOnInit() {
    setTimeout(this.removeStyle, 3000)
    this.loadCurrentYear();
  }

  currentYear;
  loadCurrentYear(): void {
    this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res) {
        this.currentYear = res;
        this.loadDataReserve();
        this.loadDataLeaveSchool();
      }
    })
  }

  loadDataReserve() {
    let body = {
      studentCode: this.studentCode ? this.studentCode : '',
      schoolYear: this.currentYear
    }
    this.studentService.getAllReserve(body).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        this.calculateHeightGrid(res.length, this.reserveStyle)
        if (res) {
          res.forEach((element) => {
            element.createdDate = convertDateToString(element.createdDate);
          });
          this.rowDataReserve = res;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res)
      }
    })
  }

  loadDataLeaveSchool() {
    let body = {
      studentCode: this.studentCode ? this.studentCode : '',
      schoolYear: this.currentYear
    }
    this.studentService.getAllLeaveSchool(body).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        this.calculateHeightGrid(res.length, this.leaveStyle)
        if (res) {
          res.forEach((element) => {
            element.createdDate = convertDateToString(element.createdDate);
          });
          this.rowDataLeaveSchool = res;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res)
      }
    })
  }

  calculateHeightGrid(rowNumber, style) {
    let height = (rowNumber * this.rowHeight) || this.MIN_HEIGHT_GRID
    if (rowNumber > 10) height = this.MAX_HEIGHT_GRID
    if (rowNumber < 4) height = this.MIN_HEIGHT_GRID
    height += this.headerHeight
    style.height = `${height}px`
  }

  removeStyle() {
    var removeStyles = document.querySelectorAll('.student-grid .ag-center-cols-container');
    removeStyles.forEach( (removeStyle: any) => {
      var currentValue =  removeStyle.style.getPropertyValue('width');
      var newCurrentValueFloat = currentValue.slice(0,-2);
      var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
      var newValue = newCurrentValueInt + 16;
      console.log(removeStyle)
      removeStyle.style.width=`${newValue}px`;
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
