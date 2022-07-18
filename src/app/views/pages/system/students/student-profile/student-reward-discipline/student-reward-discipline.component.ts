import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { SubjectService } from 'src/app/core/service/service-model/subject.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { STUDENTS, TABLE_CELL_STYLE, NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';
import { ClassroomService } from 'src/app/core/service/service-model/classroom.service';
import { convertDateToString } from 'src/app/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-student-reward-discipline',
  templateUrl: './student-reward-discipline.component.html',
  styleUrls: ['./student-reward-discipline.component.scss']
})
export class StudentRewardDisciplineComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  MAX_HEIGHT_GRID = 500
  MIN_HEIGHT_GRID = 170

  columnReward = [];
  rowDataReward = [];

  columnDiscipline = [];
  rowDataDiscipline = [];

  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  overlayNoRowsTemplate

  @Input() studentCode: any;

  rewardStyle = {
    height: `${this.MIN_HEIGHT_GRID}px`,
    marginBottom: '40px'
  }
  disciplineStyle = {
    height: `${this.MIN_HEIGHT_GRID}px`,
    marginBottom: '40px'
  }

  constructor(
    private studentService: StudentsService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    TABLE_CELL_STYLE.display = 'block'
    this.columnReward = [
      {
        headerName: this.translate.instant('STUDENT.INFO.NO'),
        suppressMovable: true,
        field: 'index',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.REWARD.DATE'),
        suppressMovable: true,
        tooltipField: 'rdDate',
        minWidth: 150,
        maxWidth: 150,
        field: 'rdDate',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#3366FF' }
      },
      {
        headerName: this.translate.instant('STUDENT.YEAR'),
        suppressMovable: true,
        tooltipField: 'year',
        minWidth: 100,
        maxWidth: 100,
        field: 'year',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.REWARD.FORMALITY'),
        suppressMovable: true,
        tooltipField: 'formality',
        field: 'formality',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.REWARD.LOCATION'),
        suppressMovable: true,
        tooltipField: 'location',
        field: 'location',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.REWARD.CONTENT'),
        suppressMovable: true,
        tooltipField: 'content',
        field: 'content',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#696F8C' }
      },
    ];

    this.columnDiscipline = [
      {
        headerName: this.translate.instant('STUDENT.INFO.NO'),
        suppressMovable: true,
        tooltipField: 'index',
        field: 'index',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.DISCIPLINE.DCL_DATE'),
        tooltipField: 'rdDate',
        minWidth: 150,
        maxWidth: 150,
        field: 'rdDate',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#3366FF' }
      },
      {
        headerName: this.translate.instant('STUDENT.YEAR'),
        suppressMovable: true,
        tooltipField: 'year',
        minWidth: 100,
        maxWidth: 100,
        field: 'year',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.DISCIPLINE.FORMALITY'),
        suppressMovable: true,
        tooltipField: 'formality',
        field: 'formality',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.DISCIPLINE.LOCATION'),
        suppressMovable: true,
        tooltipField: 'location',
        field: 'location',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.DISCIPLINE.CONTENT'),
        suppressMovable: true,
        tooltipField: 'content',
        field: 'content',
        minWidth: 250,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#696F8C' }
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
    this.loadDataReward();
    this.loadDataDiscipline();
  }

  loadDataReward() {
    let body = {
      studentCode: this.studentCode,
      type: 1
    }
    this.studentService.getRwDcl(body).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        this.calculateHeightGrid(res.length, this.rewardStyle)
        if (res) {
          res.forEach((element) => {
            element.rdDate = convertDateToString(element.rdDate);
          });
          this.rowDataReward = res;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res)
      }
    })
  }

  loadDataDiscipline() {
    let body = {
      studentCode: this.studentCode,
      type: 0
    }
    this.studentService.getRwDcl(body).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        this.calculateHeightGrid(res.length, this.disciplineStyle)
        if (res) {
          res.forEach((element) => {
            element.rdDate = convertDateToString(element.rdDate);
          });
          this.rowDataDiscipline = res;
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