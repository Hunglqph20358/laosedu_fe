import { DownloadButtonRenderComponent } from './../../official-letter-document/download-button-render/download-button-render.component';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';

import {CommonServiceService} from 'src/app/core/service/utils/common-service.service';
import {GradeLevelService} from 'src/app/core/service/service-model/grade-level.service';
import {ClassroomService} from 'src/app/core/service/service-model/classroom.service';
import {ManageContactService} from 'src/app/core/service/service-model/manage-contact.service';

import {MatDialog} from '@angular/material/dialog';

import * as moment from 'moment';
import {EvaluateConductService} from '../../../../../core/service/service-model/evaluate-conduct.service';
import {EvaluationOfSubjectTeachersComponent} from './evaluation-of-subject-teachers/evaluation-of-subject-teachers.component';
import {AgCheckboxComponent} from './checkbox/ag-checkbox.component';
import {AgSelectComponent} from './ag-select/ag-select.component';
import {AuthService} from '../../../../../core/auth/_services';
import {CheckboxHeaderComponent} from './checkbox-header/checkbox-header.component';
import {ConfirmSaveComponent} from '../../subject-declaration/confirm-save/confirm-save.component';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../helpers/constants';
import {formatDate} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'kt-conduct-assessment',
  templateUrl: './conduct-assessment.component.html',
  styleUrls: ['./conduct-assessment.component.scss'],
})
export class ConductAssessmentComponent implements OnInit {
  conductList;
  ROLE_PARAM = environment.ROLE;
  hasAuth = true;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private gradeLevelService: GradeLevelService,
    private classRoomService: ClassroomService,
    private manageContactService: ManageContactService,
    private evaluateConductService: EvaluateConductService,
    private toast: ToastrService,
    private auth: AuthService,
    private translate: TranslateService,
    // private checkboxHeaderComponent : CheckboxHeaderComponent,
  ) {
    const type = {
      type : 'conduct'
    };

    this.currentUser = this.auth.currentUserValue;
    if (this.currentUser.authorities.includes(this.ROLE_PARAM.HT) ||
      this.currentUser.authorities.includes(this.ROLE_PARAM.ADMIN) ) {

      if (!this.currentUser.authorities.includes(this.ROLE_PARAM.GV_CN)){
        this.hasAuth = false;
        return;
      }
    }

    this.evaluateConductService.getCompetition(type).subscribe(res=>{
      console.log('res Conduct', res);
      console.log('res0', res[0].name);
      this.conductList = res;
      this.initTable(res);
      this.changeDetectorRef.detectChanges();
    })

    this.rowData1 = [];
    this.frameworkComponents = {
      buttonRenderer: DownloadButtonRenderComponent,
    };
  }

  hide;

  disableSelect = true;
  conditionForCheckboxHeader = true;
  checkBoxHeader1=false;
  checkBoxHeader2=false;
  checkBoxHeader3=false;
  checkBoxHeader4=false;
  unsubscribe$ = new Subject<void>();
  @ViewChild('registerPackageModal')
  public registerPackageModal: TemplateRef<any>;
  modalRef: BsModalRef;

  // ag-grid
  gridApi;
  gridColumnApi;
  columnDefs;
  defaultColDef = {
    width: 150,
    lockPosition: true,
    suppressMenu: true,
  };
  rowData;
  rowData1;
  ROW_HEIGHT = 60;
  HEADER_HEIGHT = 32;
  rowStyle;
  rowSelection = 'multiple';
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  frameworkComponents;
  cellStyle = {
    'font-style': 'normal',
    'font-size': '12px',
    'line-height': '20px',
    color: '#101840',
    'align-items': 'center',
    // display: 'flex',
    top: '20px',
    'font-weight': '500',
    'font-family': 'Inter',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
  };
  selectedStudents = [];

  // search form
  dataSearch;
  formSearch: FormGroup;

  subscription: Subscription;

  classRoomName;
  _semester;
  _year;
  temporaryData = [];

  showPagination = true;
  // paging
  perPage = 10;
  currentPage = 1;
  first = 0;
  last = 0;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  currentUser;

  showUpdate = true;
  showSave = false;
  showCancel = false;
  semesterValue;

  currentYear;
  currentYearObj;
  semesterAmount;
  listSemesters = [];

  semestersInCurrentYear;

  listGradeLevel = [];

  listClass;
  selectedClassCode;

  errorMessages;
  packageName;

  rowdataClone;

  checkEnableInSemester = true;

  object;

  mapSemester(value) {
    switch (value) {
      case '1':
        return this.translate.instant(`CONDUCT_ASSESSMENT.SEMESTER1`);
      case '2':
        return this.translate.instant(`CONDUCT_ASSESSMENT.SEMESTER2`);
      case '3':
        return this.translate.instant(`CONDUCT_ASSESSMENT.SEMESTER3`);
      case '4':
        return this.translate.instant(`CONDUCT_ASSESSMENT.SEMESTER4`);
      case '0':
        return this.translate.instant(`CONDUCT_ASSESSMENT.ALL_YEAR`);
      default:
        return value;
    }
  }


  // Custom 50 character
  // Custom tooltip for select


  limitStringCellValue = (params) => {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };

  onSelectionChanged(event) {
    // console.log(event);
    const selectedNodes = event.api.getSelectedNodes();
    this.selectedStudents = selectedNodes.map((node) => ({
      id: node.data.id,
      status: node.data.status,
      semester: node.data.semester,
    }));
    // console.log('this.selectedStudents', this.selectedStudents);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.disableSelect = this.disableSelect;
    this.gridColumnApi = params.columnApi;
    const type = {
      type : 'competition'
    };
    this.evaluateConductService.getCompetition(type).subscribe(res=>{
      this.gridApi.listCompetition = res;
      // console.log(res);
      setTimeout( () => {
        this.resizeTwoLastColumns()
        params.api.sizeColumnsToFit()
      }, 1000)
      this.changeDetectorRef.detectChanges();
    })
    // setTimeout( () => {
    //   this.resizeTwoLastColumns()
    //   params.api.sizeColumnsToFit()
    // }, 500)
  }

  gridSizeChanged(params) {
    console.log('gridSizeChanged',params);
    this.object = params;
    setTimeout( () => {
      params.api.sizeColumnsToFit()
      this.resizeTwoLastColumns()
    }, 500)
    // params.api.sizeColumnsToFit()
    setTimeout(this.removeStyle,1500);
  }

  gridColumnsChanged(params) {
    console.log('gridColumnsChanged',params);
    this.object = params;
    setTimeout( () => {
      params.api.sizeColumnsToFit()
      this.resizeTwoLastColumns()
    }, 500)
    // params.api.sizeColumnsToFit()
  }

  resizeTwoLastColumns(): void {
    const header = (document.querySelector('.ag-pinned-right-header') as HTMLElement)
    const body = (document.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
    // body.style.minWidth = `${header.offsetWidth + 21}px`
    // body.style.minWidth = `${header.offsetWidth}px`
    body.style.minWidth = `${header.offsetWidth+2}px`
    console.log(body)
    console.log(header)
  }

  ngOnInit(): void {
    this.loadCurrentYear();
    this.changeDetectorRef.detectChanges();
    this.currentUser = this.auth.currentUserValue;
    setTimeout(this.removeStyle,1500);
  }

  initTable(res: any[]) {
    this.columnDefs = [
      {
        headerName: this.translate.instant(`CONDUCT_ASSESSMENT.NUMBER`),
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.NUMBER`),
        valueGetter: param => {
          param.api.dataAll = [];
          param.api.dataAll = this.rowData1;
          param.api.stas = this.disableSelect;
          param.api.conditionForCheckboxHeader = this.conditionForCheckboxHeader;
          return param.node.rowIndex + (((this.currentPage - 1) * this.perPage) + 1)
        },
        minWidth: 48,
        maxWidth: 48,
        headerClass: 'custom-merge-header1',
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
          'justify-content': 'center',
        },
      },
      {
        headerName: this.translate.instant(`CONDUCT_ASSESSMENT.STUDENT_CODE`),
        headerClass: 'custom-merge-header1',
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.STUDENT_CODE`),
        field: 'studentCode',
        tooltipField: 'studentCode',
        minWidth: 100,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          color: '#3366FF',
        },
      },
      {
        headerName: this.translate.instant(`CONDUCT_ASSESSMENT.STUDENT_NAME`),
        headerClass: 'custom-merge-header1',
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.STUDENT_NAME`),
        field: 'studentName',
        tooltipField: 'studentName',
        minWidth: 120,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
        },
      },
      {
        headerComponentParams :{
          template:'<span style="font-size:10px; ' +
            'color:#8f95b2;' +
            'white-space: break-spaces;' +
            'text-transform: uppercase">' +
            this.translate.instant(`CONDUCT_ASSESSMENT.COUNT_OFF_NOT_ALLOWED`) +
            '</span>',
        },
        headerClass: 'custom-merge-header1 content-center',
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.COUNT_OFF_NOT_ALLOWED`),
        field: 'totalRestNoReason',
        tooltipField: 'totalRestNoReason',
        minWidth: 100,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          'text-align':'center',
          'justify-content': 'center',
        },
      },
      {
        headerComponentParams :{
          template:'<span style="font-size:10px;  ' +
            'color:#8f95b2;' +
            'white-space: break-spaces;' +
            'text-transform: uppercase">' +
            this.translate.instant(`CONDUCT_ASSESSMENT.COUNT_OFF_ALLOWED`) +
            '</span>',
        },
        headerClass: 'custom-merge-header1 content-center',
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.COUNT_OFF_ALLOWED`),
        field: 'totalRestByReason',
        tooltipField: 'totalRestByReason',
        minWidth: 100,
        // maxWidth: 100,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          'text-align':'center',
          'justify-content': 'center',
        },
      },
      {
        headerName: this.translate.instant(`CONDUCT_ASSESSMENT.ACADEMIC_ABILITY`),
        headerClass: 'custom-merge-header1',
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.ACADEMIC_ABILITY`),
        field: 'abilityName',
        tooltipField: 'abilityName',
        minWidth: 96,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
        },
      },
      {
        // headerComponentParams:{
        //   template:'<span style="font-size:10px; color:#8f95b2; align-items: left";>' +
        //     '<div style="text-align: left; margin-bottom: 6px">ĐÁNH GIÁ CỦA</div>' +
        //     '<div style="text-align: left">GV BỘ MÔN</div> ' +
        //     '</span>',
        // },
        headerComponentParams :{
          template:'<span style="font-size:10px; ' +
            'color:#8f95b2;' +
            'white-space: break-spaces;' +
            'text-transform: uppercase">' +
            this.translate.instant(`CONDUCT_ASSESSMENT.EVALUATE`) +
            '</span>',
        },
        headerClass: 'custom-merge-header1',
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.EVALUATE1`),
        // maxWidth: 118,
        minWidth: 110,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          'font-style': 'normal',
          'font-size': '12px',
          'line-height': '20px',
          color: '#101840',
          'align-items': 'center',
          display: 'flex',
          'font-weight': '500',
          'font-family': 'Inter',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          cursor: 'pointer',
        },
        cellRendererFramework: EvaluationOfSubjectTeachersComponent,
      },
      {
        headerName: this.translate.instant(`CONDUCT_ASSESSMENT.CONDUCT`),
        headerClass: 'header-color',
        children: res.map((e,index) => {
          return {
            headerName: e.name,
            headerComponentFramework: CheckboxHeaderComponent,
            headerTooltip: e.name,
            field: `conduct${index}`,
            minWidth: 110,
            maxWidth: 110,
            suppressMovable: true,
            headerClass: 'header-color header-center header-conduct',
            cellRendererFramework: AgCheckboxComponent,
            pinned: 'right',
            cellStyle: params =>
            (params.column.colId === `conduct${index}` && this.disableSelect !== true) ?
              {
                display: 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'pointer-events': 'auto',
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
                'font-style': 'normal',
                'font-size': '10px',
                'line-height': '16px',
                color: '#8F95B2',
                'font-weight': '600',
                // 'font-family': 'Phetsarath-OT',
              }
              : {
                display: 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'pointer-events': 'none',
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
                'font-style': 'normal',
                'font-size': '10px',
                'line-height': '16px',
                color: '#8F95B2',
                'font-weight': '600',
                // 'font-family': 'Phetsarath-OT',
              }
          }
        })
      },
      {
        headerName: this.translate.instant(`CONDUCT_ASSESSMENT.COMPETITION`),
        headerClass: 'center-header',
        headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.COMPETITION`),
        maxWidth: 140,
        minWidth: 140,
        resizable :true,
        field: 'competitionCode',
        suppressMovable: true,
        pinned: 'right',
        cellRendererFramework: AgSelectComponent,
        cellStyle: params =>
          params.column.colId === 'competitionCode' && this.disableSelect !== true ?
            {
              'align-items': 'center',
              'pointer-events': 'auto',
            } :
            {
              'align-items': 'center',
              // 'pointer-events': 'none',
            }
      },
    ];
  }


  loadCurrentYear() {
    // console.log('year123111', this.currentYear);
    this.classRoomService.yearCurrent$.subscribe((currentYear) => {
      this.currentYear = currentYear;
      if (currentYear) {
        this.loadSemesters();
        // this.getClassroomByUserIdAndYears();
      }
    });
    this.changeDetectorRef.detectChanges();
  }


  loadSemesters() {
    const year = {
      years: this.currentYear
    };
    this.evaluateConductService
      .getSemesterByYear(year)
      .subscribe((listSemesters) => {
        console.log('listSemeester',listSemesters);
        this.semestersInCurrentYear = listSemesters;
        listSemesters.forEach(item => {
          if (item.defaultValue === true) {
           this.semesterValue = item.value;
           // this.checkEnableInSemester = false;
            this.checkUpdateEnable();
           console.log('Current Value'+ item.value);
          }
          item.name = this.mapSemester(item.value);
        })

        // this.loadClassRoom();
        this.getClassroomByUserIdAndYears();
        this.changeDetectorRef.detectChanges();
      });
    this.changeDetectorRef.detectChanges();
  }


  // get class room follow years and userid
  getClassroomByUserIdAndYears() {
    const obj: any = {
      userId: this.currentUser.id,
      years: this.currentYear
    }
    console.log('data call class', obj);
    this.evaluateConductService.getClassroomFollowUserIdAndYears(obj).subscribe((res) => {
      console.log('resClass',res);
      if(res.length !== 0){
        this.listClass = res;
        this.selectedClassCode = res[0].value;
        this.loadData(1);
        for(let i=0; i<this.listClass.length; i++){
          if(this.selectedClassCode === this.listClass[i].value){
            this.classRoomName = this.listClass[i].name;
            for(let j = 0; j< this.semestersInCurrentYear.length; j++){
              if(this.semesterValue === this.semestersInCurrentYear[j].value){
                this._semester = this.semestersInCurrentYear[j].name;
                // this._semester = this.mapSemester(this.semesterValue);
                // console.log("Name of Semester"+this.mapSemester(this.semesterValue));
                break;
              }
            }
            break;
          }
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }
  removeStyle() {
    var removeStyle = document.querySelector('.ag-pinned-right-cols-container') as HTMLElement;
    var removeStyle2 = document.querySelector('.ag-pinned-right-header') as HTMLElement;
    var currentValue =  removeStyle.style.getPropertyValue('min-width');
    var currentValue2 =  removeStyle2.style.getPropertyValue('min-width');
    var newCurrentValueFloat = currentValue.slice(0,-2);
    var newCurrentValueFloat2 = currentValue2.slice(0,-2);
    var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    var newCurrentValueInt2 = Math.round(parseFloat(newCurrentValueFloat2));
    //console.log(newCurrentValueInt);
    //console.log(newCurrentValueInt2);
    if(newCurrentValueInt == 582){
      var newValue = newCurrentValueInt + 17;
    }
    if(newCurrentValueInt2 == 580){
      var newValue2 = newCurrentValueInt + 17;
    }
    removeStyle.style.minWidth=`${newValue}px`;
    removeStyle2.style.minWidth=`${newValue2}px`;
}
  loadClassRoom() {
    // this.selectedClassCode=-1;
    const query: object = {
      gradeLevel: 6,
      years: this.currentYear,
    };
    this.classRoomService.findByGradeLevelAndYear(query).subscribe(res => {
      if (res.status !== 'OK') {
        return;
      }

      this.listClass = res.data.map((_class) => ({
        id: _class.id,
        name: `${_class.code} - ${_class.name}`,
        code: _class.code,
      }));
      this.selectedClassCode = res.data[0].code;
      this.loadData(1);
      this.changeDetectorRef.detectChanges();
    })
  }

  loadData(page: number) {
    // Delete change checkbox rjsx
    this.evaluateConductService.changeCheckboxColumn(null);
    this.evaluateConductService.changeCheckboxHeader(null);

    this.hide = false;
    this.currentPage = page;
      const query: object = {
        years: this.currentYear,
        semester: this.semesterValue,
        classCode: this.selectedClassCode,
        currentPage: page,
        pageSize: this.perPage,
      };
      console.log('querySearch', query);
      this.evaluateConductService.searchEvaluate(query).pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            if(res !== null){
              console.log('resSearch', res);
              const {lstData: data, totalRecord: totalElements} = res;
              this.rowData1 = data.map((dt, _index)=>{
                return {
                  ... dt,
                  abilityName: dt.abilityName?dt.abilityName:'-',
                  currentYear: this.currentYear,
                  semester: this.semesterValue,
                  classCode: this.selectedClassCode,
                  conductCodeTransform: dt.conductCode
                }
              });

              if (totalElements > 0) {
                this.total = totalElements;
                this.totalPage = Math.ceil(this.total / this.perPage);
                this.rangeWithDots = this.commonService.pagination(
                  this.currentPage,
                  this.totalPage
                );
                this.first = this.perPage * (this.currentPage - 1) + 1;
                this.last = this.first + data.length - 1;

              } else {
                this.total = 0;
                this.rangeWithDots = [];
                this.first = 0;
                this.last = 0;
                this.rowData1 = [];
              }
              let count =0;

              // checkbox header
              this.isCheckedAll();

              this.rowData1.forEach(item=>{
                if (item.competitionCode === '') {
                  item.competitionCode = null;
                }

                item.listConduct.forEach((e, i) => {
                  const conduct = `conduct${i}`;
                  item[conduct] = e.value;
                });

                // Check select
                if (item.abilityCode !== '' && item.conductCode !== '') {
                  item.disableSelect = false;
                } else {
                  item.disableSelect = true;
                }

                if(item.abilityName !== '-'){
                  this.conditionForCheckboxHeader=false;
                  count++;
                }
              })
              if(count===0){
                this.conditionForCheckboxHeader=true;
              }
              this.gridApi.refreshHeader();
              this.gridApi.setRowData(this.rowData1);
              this.gridApi.sizeColumnsToFit();
              this.hide=true;
              this.gridColumnsChanged(this.object);
              this.changeDetectorRef.detectChanges();
            }

          },
        });
  }

  isCheckedAll() {
    this.conductList.forEach((element, index) => {
      let countRow = 0;
      let countRowTrue = 0;
      this.rowData1.forEach(e => {
        if (e.abilityCode !== '') {
          countRow++;
          if (e.conductCodeTransform === element.value) {
            countRowTrue++;
          }
        }
      });
      const conduct = `conduct${index}`;
      if (countRow > 0 && countRow === countRowTrue) {
        this.gridApi[conduct] = true;
      } else {
        this.gridApi[conduct] = false;
      }
    });
  }

  checkDisableSelect() {
    console.log(this.rowData1)
    this.rowData1.forEach(item => {
      // Check select
      if (item.abilityCode !== '' && item.conductCodeTransform !== '') {
        item.disableSelect = false;
      } else if (item.abilityCode !== '' && item.conductCodeTransform === '') {
        item.disableSelect = true;
        item.competitionCode = null;
      } else {
        item.disableSelect = true;
      }
    });
  }


  clickUpdate() {
    // this.checkUpdateEnable();
    // console.log('semester', this.semestersInCurrentYear);

    // this.temporaryData = [...this.rowData1];
    // Array.prototype.push.apply(this.temporaryData, this.rowData1);

    this.disableSelect = false;
    this.showUpdate = false;
    this.showSave = true;
    this.showCancel = true;

    // this.checkboxHeaderComponent.checkEnable();

    // this.loadData(this.currentPage);
    // await this.gridApi.setRowData(this.rowData1);
    // await this.gridApi.setColumnDefs(this.columnDefs);
    this.gridApi.disableSelect = this.disableSelect;
    this.gridApi.setRowData(this.rowData1);
    this.changeDetectorRef.detectChanges();

    // this.checkboxHeaderComponent.checkEnable();

    // console.log('lan',this.rowData1);
    // console.log('lan',this.temporaryData);
  }

  clickCancel() {
    // this.rowData1 = this.temporaryData;
    // for(let i =0; i< this.rowData1.length; i++){
    //   this.rowData1[i].conductExcellent = this.temporaryData[i].conductExcellent;
    //   this.rowData1[i].conductGood = this.temporaryData[i].conductGood;
    //   this.rowData1[i].conductMedium = this.temporaryData[i].conductMedium;
    //   this.rowData1[i].conductWeak = this.temporaryData[i].conductWeak;
    // }

    this.showUpdate = true;
    this.disableSelect = true;
    this.showSave = false;
    this.showCancel = false;
    // this.changeDetectorRef.detectChanges();
    // this.loadData(this.currentPage);
    // console.log('lan1',this.rowData1);
    // console.log('lan1',this.temporaryData);
    // await this.gridApi.setColumnDefs(this.columnDefs);
    this.gridApi.checkBoxHeader1 = false
    this.gridApi.checkBoxHeader2 = false
    this.gridApi.checkBoxHeader3 = false
    this.gridApi.checkBoxHeader4 = false
    this.gridApi.disableSelect = this.disableSelect;
    this.loadData(this.currentPage);
    // this.gridApi.setRowData(this.rowData1);
    // this.changeDetectorRef.detectChanges();
  }

  updateData() {

    // const lst = this.rowData1;
    // console.log('data Update',this.rowData1);
    const list = {
      years : this.currentYear,
      semester : this.semesterValue,
      classCode : this.selectedClassCode,
      evaluateConductDataDTOs: this.formatDataSave(this.rowData1),
    }
    console.log('dataUpdate',list);
    const confirm = {
      title: this.translate.instant(`CONDUCT_ASSESSMENT.CONFIRM_TITLE`),
      message: this.translate.instant(`CONDUCT_ASSESSMENT.CONFIRM_MESSAGE`),
    };
    this.matDialog.open(ConfirmSaveComponent, {
      data: confirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.evaluateConductService.updateData(list).subscribe(rs => {
          console.log('rs',rs);
          if (rs.status === 'OK') {
            this.toast.success(rs.message);
            this.disableSelect = true;
            this.gridApi.disableSelect = this.disableSelect;
            this.showSave = false;
            this.showCancel = false;
            this.showUpdate = true;
            this.loadData(this.currentPage);
          } else {
            this.toast.error(rs.message);
          }
        })
      }
    })
  }

  formatDataSave(dtoList) {
    const rs:any = dtoList.map(element => {
      return {
        ...element,
        conductCode: element.conductCodeTransform
      }
    });
    return rs;
  }

  onChangeClass(classCode) {
    this.clickCancel();
    this.classRoomName = undefined;
    this._semester = undefined;

    for(let i=0; i<this.listClass.length; i++){
      if(this.selectedClassCode === this.listClass[i].value){
        this.classRoomName = this.listClass[i].name;
        for(let j = 0; j< this.semestersInCurrentYear.length; j++){
          if(this.semesterValue === this.semestersInCurrentYear[j].value){
            this._semester = this.semestersInCurrentYear[j].name;
            break;
          }
        }
        break;
      }
    }



    // this.selectedClassCode = classCode;
    // this.classRoomName = undefined;
    // this._year = undefined;
    // if(this.selectedClassId !== -1){
    //   this.listClass.forEach(item=>{
    //     if(item.id === this.selectedClassId){
    //       const name = item.name.split('-',2);
    //       console.log('name', name);
    //       this.classRoomName = name[1];
    //       this._year = '(Năm học: '+this.currentYear+')';
    //     }
    //   })
    // }
    this.loadData(1);
    setTimeout(this.removeStyle,1500);
  }


  onChangeSemester(semesterValue){
    this.clickCancel();
    this.classRoomName = undefined;
    this._semester = undefined;


    for(let i=0; i<this.listClass.length; i++){
      if(this.selectedClassCode === this.listClass[i].value){
        this.classRoomName = this.listClass[i].name;
        for(let j = 0; j< this.semestersInCurrentYear.length; j++){
          if(this.semesterValue === this.semestersInCurrentYear[j].value){
            // this._semester = this.semestersInCurrentYear[j].name;
            this._semester = this.mapSemester(this.semesterValue);
            break;
          }
        }
        break;
      }
    }

    this.checkUpdateEnable();

    this.loadData(1);


  }
  checkUpdateEnable(){
    this.checkEnableInSemester = true;

    console.log('this.semestersInCurrentYear',this.semestersInCurrentYear);

    for(let i=0; i<this.semestersInCurrentYear.length; i++){
      if(this.semesterValue === this.semestersInCurrentYear[i].value){
        if(this.semesterValue!=='0' && this.semestersInCurrentYear[i].defaultValue===true){
          this.checkEnableInSemester=false;
        }
        else {
          if(this.semesterValue==='0' && this.semestersInCurrentYear[this.semestersInCurrentYear.length-2].defaultValue===true){
            console.log('Đã vào đây');
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            console.log('new Date(date)',new Date(date));
            console.log('date late', new Date(this.semestersInCurrentYear[this.semestersInCurrentYear.length-2].toDate));
            if(new Date(date) <= new Date(this.semestersInCurrentYear[this.semestersInCurrentYear.length-2].toDate)){
              this.checkEnableInSemester=false;

              console.log('da check dung')
            }
          }
        }
      }
    }
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  dataGrid1(){
    return this.rowData1;
  }


}
