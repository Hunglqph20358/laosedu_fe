import {Component, Inject, OnInit, Optional} from '@angular/core';
import {DateLockPointComponent} from '../date-lock-point/date-lock-point.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfigPointLockService} from '../../../../../core/service/service-model/config-point-lock.service';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-update-conf-lock',
  templateUrl: './update-conf-lock.component.html',
  styleUrls: ['./update-conf-lock.component.scss']
})
export class UpdateConfLockComponent implements OnInit {
  rowData = [];
  gridApi;
  gridColumnApi;
  headerHeight = 36;
  rowHeight=36;
  columnDefs

  confDetail: any;
  confEntryKey: any;
  configLockDate: any;

  fromDate;
  endDate;

  years;
  grade;
  semester;

  notPickDay = false;

  showErr = false;
  message;

  empty = true;
  delete = false;
  dem = 0;
  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<UpdateConfLockComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private configLockPointService: ConfigPointLockService,
              private classroomService: ClassroomService,
              private translate: TranslateService,
              private toast :ToastrService,
              private datePipe: DatePipe) {
    this.confDetail = data;
  }

  ngOnInit(): void {
    this.initTable();
    this.getYears();
    this.getSemester();
    this.getGrade();
    this.getEndDateConfigLock();
  }

  initTable() {
    this.columnDefs = [
      {   headerName: this.translate.instant('COMMON.YEARS'),
        field: 'schoolYear',
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
        minWidth:120,
        maxWidth: 120,
        tooltipField: 'schoolYear',
        suppressMovable: true,
      },
      { headerName: this.translate.instant('COMMON.SEMESTER'),field:'semester',
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          transform: 'translateX(19%)',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth:100,
        maxWidth: 100,
        tooltipField: 'semester',
        suppressMovable: true,
      },
      { headerName: this.translate.instant('CONF_LOCK.SCORE_NAME'),field:'scoreName',
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
        minWidth: 120,
        tooltipField: 'scoreName',
        suppressMovable: true,
      },
      { headerName: this.translate.instant('CONF_LOCK.GRADE'),field:'gradeName',
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
        minWidth: 80,
        tooltipField: 'gradeName',
        suppressMovable: true,
      }
    ]
  }

  getSemester() {
    if (this.confDetail.id !== null) {
      return;
    }
    this.configLockPointService.transferSemester$.subscribe(semester => {
      this.semester = semester;
    });
  }

  getGrade() {
    if (this.confDetail.id !== null) {
      this.loadData();
      return;
    }
    this.configLockPointService.getSchoolYearByYearAndSemester(this.years, this.semester).subscribe(resAPI => {
      this.fromDate = this.datePipe.transform(resAPI.fromDate, 'yyyy-MM-dd');
      this.endDate = this.datePipe.transform(resAPI.toDate,'yyyy-MM-dd');
    });
    this.configLockPointService.transferGrade$.subscribe(gradeCode => {
      this.configLockPointService.getGradeLevelByCode(gradeCode).subscribe(grade => {
        this.grade = grade;
        console.log(grade);
        this.loadData();
      });
    });
  }

  getEndDateConfigLock() {
    if (this.confDetail.id !== null) {
      this.configLockPointService.getEndDateConfigLock(this.confDetail.id).subscribe(resAPI => {
        const endDateDate = new Date(resAPI.toDate);
        this.fromDate = this.datePipe.transform(resAPI.fromDate, 'yyyy-MM-dd');
        this.endDate = this.datePipe.transform(endDateDate,'yyyy-MM-dd');
        console.log(this.endDate);
      });
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.hideOverlay();
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  loadData() {
    if (this.confDetail.id === null) {
      this.confEntryKey = [];
      // tslint:disable-next-line:max-line-length
      this.confDetail ={...this.confDetail, schoolYear: this.years, semester: this.semester, gradeName: this.grade.name, gradeCode: this.grade.code};
      this.confEntryKey.push(this.confDetail);
      return;
    }

    this.configLockPointService.getConfEntryLockByIdDetail(this.confDetail.id).subscribe(resAPI => {
      this.confEntryKey = [];
      resAPI = {...resAPI, scoreName : this.confDetail.scoreName}
      this.confEntryKey.push(resAPI);
      // Validate form date and end Date
      const dateLock = new Date(this.confDetail.entryLockDate);
      this.configLockDate = this.datePipe.transform(dateLock,'yyyy-MM-dd');
    });
  }

  save() {
    if (this.showErr) {
      this.toast.error(this.message);
      return;
    }
    if (this.configLockDate === undefined) {
      this.toast.error(this.translate.instant('CONF_LOCK.MSG.DATE_LOCK_NOT_BLANK'));
      return;
    }
    const dataUpdate = this.confDetail;
    dataUpdate.dayLock = this.configLockDate;
    console.log(dataUpdate);
    this.configLockPointService.updateConfigLock(dataUpdate).subscribe(resAPI => {
      if (resAPI.status === 'OK') {
        this.toast.success(resAPI.message);
        this.dialogRef.close({event: 'update'});
      }else if (resAPI.status === 'BAD_REQUEST') {
        this.toast.error(resAPI.message);
      }
    });
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }

  getYears() {
    if (this.confDetail.id !== null) {
      return;
    }
    this.classroomService.yearCurrent$.subscribe(val => {
      this.years = val;
    });
  }

  validateUpdate() {
    console.log(this.configLockDate);
    if (this.configLockDate === '' || this.configLockDate === undefined) {
      if (this.empty || this.delete) {
        this.showErr = true;
        this.message = this.translate.instant('CONF_LOCK.MSG.DATE_LOCK_NOT_BLANK');
        return;
      }

      this.empty = false;

      this.showErr = true;
      this.message = this.translate.instant('CONF_LOCK.MSG.DATE_LOCK_NOT_EXIST');
      return;
    }
    const valueDate = new Date(this.configLockDate);
    const endDateDate = new Date(this.endDate);
    const fromDate = new Date(this.fromDate);
    console.log(this.endDate);
    const now = this.datePipe.transform(new Date(),'yyyy-MM-dd');

    console.log(fromDate);

    if (valueDate < fromDate) {
      this.showErr = true;
      this.message = this.translate.instant('CONF_LOCK.MSG.DATE_LOCK_BIGGER_START_SEMESTER');
      return;
    }

    if (now > this.configLockDate || now === this.configLockDate) {
      this.showErr = true;
      this.message = this.translate.instant('CONF_LOCK.MSG.DATE_LOCK_BIGGER_NOW');
      return;
    }

    if (valueDate > endDateDate) {
      this.showErr = true;
      this.message = this.translate.instant('CONF_LOCK.MSG.DATE_LOCK_SMALLER_FINISH_SEMESTER');
      return;
    }

    this.showErr = false;
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
}
