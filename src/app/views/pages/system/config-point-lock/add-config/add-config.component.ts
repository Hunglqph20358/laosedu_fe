import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfigPointLockService} from '../../../../../core/service/service-model/config-point-lock.service';
import {DateLockPointComponent} from '../date-lock-point/date-lock-point.component';
import {ToastrService} from 'ngx-toastr';
import {CellPosition} from 'ag-grid-community';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../helpers/constants';
import {TranslateService} from '@ngx-translate/core';

interface TabToNextCellParams {
  // true if the Shift key is also down
  backwards: boolean;

  // true if the current cell is editing (you may want to skip cells that are not editable,
  // as the grid will enter the next cell in editing mode also if tabbing)
  editing: boolean;

  // the cell that currently has focus
  previousCellPosition: CellPosition;

  // the cell the grid would normally pick as the next cell for this navigation
  nextCellPosition: CellPosition;
}

@Component({
  selector: 'kt-add-config',
  templateUrl: './add-config.component.html',
  styleUrls: ['./add-config.component.scss']
})
export class AddConfigComponent implements OnInit {
  rowData = [];
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight=70;

  // Translate
  placeholder;
  sttTranslate;
  typeSubjectTranslate;
  scoreNameTranslate
  dateLockTranslate
  columnDefs

  formAddConfig: FormGroup;

  applyAll = false;

  years: any;
  gradeList: any;
  semesterList: any;
  gradeCurrent: any;
  semesterCurrent: any;

  overlayNoRowsTemplate;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<AddConfigComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private configLockPintService: ConfigPointLockService,
              private toast :ToastrService,
              private translate: TranslateService) {
    this.years = data.years;
    this.semesterList = data.semesterList;
    this.gradeCurrent = data.gradeCurrent;
    this.semesterCurrent = data.semesterCurrent;
    this.translateLanguage();
  }

  ngOnInit(): void {
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
    this.initTable();
    this.formAddConfig = this.fb.group({
      semester: [{value: ''}, Validators.required],
      years: [{value: '', disabled: true}, Validators.required],
      gradeLevel: [null, Validators.required]
    })
    this.formAddConfig.get('gradeLevel').valueChanges.subscribe(val => this.selectGradeLevel(val));
    this.loadFormOption();
    this.loadGridViewAdd();
  }

  initTable() {
    this.columnDefs = [
      {   headerName: this.sttTranslate,
        field: 'make',
        headerClass: 'stt-add-conf',
        valueGetter:'node.rowIndex + 1',
        minWidth:60,
        maxWidth:60,
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '18px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'text-align': 'center',
        },
        suppressMovable: true,
      },
      {   headerName: this.typeSubjectTranslate,
        field: 'typeSubjectName',
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '18px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth:220,
        maxWidth: 220,
        tooltipField: 'typeSubjectName',
        suppressMovable: true,
      },
      { headerName: this.scoreNameTranslate,field:'scoreName',
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '18px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth:190,
        maxWidth: 190,
        tooltipField: 'scoreName',
        suppressMovable: true,
      },
      { headerName: this.dateLockTranslate+ ' (*)',
        headerComponentParams :{
          template:`<div style="font-size:10px; color:#8f95b2;text-align: center;white-space: break-spaces;">${this.dateLockTranslate} <span style="color: red">*</span></div>`,
        },
        field:'entryLockDate',
        cellRendererFramework: DateLockPointComponent,
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '2px',
          display: 'flex',
          'justify-content': 'space-around',
          'flex-direction': 'column',
          'padding-right': '72px'
        },
        maxWidth: 300,
        minWidth: 300,
        suppressMovable: true,
      }
    ]
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.hideOverlay();
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  getGradeList(semester, years) {
    this.configLockPintService.getGradeListUnconfiguredList(semester, years).subscribe(resAPI => {
      this.gradeList = resAPI;
      if (this.gradeList.length === 0) {
        this.toast.warning(this.translate.instant('CONF_LOCK.MSG.ALL_GRADE')+ ' ' + this.semesterCurrent+' ' + this.translate.instant('CONF_LOCK.MSG.CONFIGED_LOCK'));
      }
    });
  }

  loadFormOption() {
    this.formAddConfig.get('semester').setValue(this.semesterCurrent);
    this.formAddConfig.get('years').setValue(this.years);

    this.formAddConfig.get('semester').valueChanges.subscribe(val => this.selectSemester(val));
    this.getGradeList(this.semesterCurrent, this.years);
  }

  applyAllGrade(event) {
    console.log(event);
    if (event.target.checked) {
      this.applyAll = true;
    }else{
      this.applyAll = false;
    }
    console.log(this.applyAll);
  }

  loadGridViewAdd() {
    const semester = this.formAddConfig.get('semester').value;
    const years = this.formAddConfig.get('years').value;
    const gradeCode = this.formAddConfig.get('gradeLevel').value;
    this.configLockPintService.loadGridViewPopupCreateConfigLockPoint(semester, years, gradeCode).subscribe(resAPI => {
      let listData: any = [];
      resAPI.forEach(item => {
        if (item.typeSubject === 0) {
          item.typeSubjectName = this.translate.instant('CONF_LOCK.INPUT_SCORE');
          item.semester = this.formAddConfig.get('semester').value;
        }else if (item.typeSubject === 1) {
          item.typeSubjectName = this.translate.instant('CONF_LOCK.RANK');
          item.semester = this.formAddConfig.get('semester').value;
        }
        listData = [...listData, item];
      });
      this.rowData = listData;
    });
  }

  selectSemester(val) {
    this.getGradeList(val, this.years);
    this.formAddConfig.get('gradeLevel').setValue(null);
    this.loadGridViewAdd();
  }

  selectGradeLevel(event) {
    this.loadGridViewAdd();
  }

  createConfig() {
    if (this.formAddConfig.get('gradeLevel').value === 0) {
      this.toast.error(this.translate.instant('CONF_LOCK.SELECT_GRADE_CONF'));
      return;
    }
    if (this.rowData.length === 0) {
      this.toast.error(this.translate.instant('CONF_LOCK.NOT_DATA'));
      return;
    }
    let checkValid = true;
    let check = true;
    let message;
    const messageList = [];
    this.rowData.forEach((item, index) => {
      console.log(item);
      if (item?.valid === false) {
        checkValid = false;
        message = item.message;
        messageList.push(message);
        return;
      }
      if (item.entryLockDate === undefined || item.entryLockDate === null ) {
        check = false;
        return;
      }
    });
    if(!checkValid) {
      this.toast.error(messageList[0]);
      return;
    }
    if(!check) {
      this.toast.error(this.translate.instant('CONF_LOCK.MSG.FILL_ALL'));
      return;
    }

    const listData = this.rowData.map(item => {
      return {
        ...item,
        gradeCode: this.formAddConfig.get('gradeLevel').value,
        semester: this.formAddConfig.get('semester').value,
        years: this.years,
        typeSubjects: item.typeSubject
      }
    });
    console.log(listData);
    this.configLockPintService.createConfigLock(listData, this.applyAll).subscribe(resAPI => {
      if (resAPI.status === 'OK') {
        this.dialogRef.close({event: 'add', data: resAPI});
      }else{
        this.toast.error(resAPI.message);
      }
    });
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }

  translateLanguage() {
    this.placeholder = this.translate.instant('TRANSFER_STUDENTS.SELECT_PLACEHOLDER');
    this.sttTranslate = this.translate.instant('STUDENT.INFO.NO');
    this.typeSubjectTranslate = this.translate.instant('CONF_LOCK.TYPE_SUBJECT')
    this.scoreNameTranslate = this.translate.instant('CONF_LOCK.SCORE_NAME');
    this.dateLockTranslate = this.translate.instant('CONF_LOCK.DATE_LOCK');
  }
}
