import {style} from '@angular/animations';
import {template} from 'lodash';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef, ElementRef,
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
import {ActionManageContactComponent} from './action-manage-contact/action-manage-contact.component';
import {HistoryContactPackageComponent} from './history-contact-package/history-contact-package.component';

import * as moment from 'moment';
import {formatDate} from '@angular/common';
import {environment} from '../../../../../../environments/environment';
import {SchoolService} from '../../../../../core/service/service-model/school.service';
import {EvaluateConductService} from '../../../../../core/service/service-model/evaluate-conduct.service';
import {NO_ROW_GRID_TEMPLATE, TABLE_CELL_STYLE} from '../../../../../helpers/constants';
import {getTabIndex} from 'ag-grid-community/dist/lib/utils/browser';
import {ConfirmSaveComponent} from '../../subject-declaration/confirm-save/confirm-save.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-manage-contact',
  templateUrl: './manage-contact.component.html',
  styleUrls: ['./manage-contact.component.scss'],
})
export class ManageContactComponent implements OnInit {
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
    private schoolService: SchoolService,
    private evaluateConductService: EvaluateConductService,
    private translate: TranslateService,
  ) {
    this.columnDefs=[];
    this.rowData = [];
  }

  unsubscribe$ = new Subject<void>();
  @ViewChild('registerPackageModal')
  public registerPackageModal: TemplateRef<any>;

  @ViewChild('agGridAngularManageContact') agGridAngular: ElementRef;
  modalRef: BsModalRef;

  private SCHOOL_CODE = `${environment.SCHOOL_CODE}`;

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
  ROW_HEIGHT = 50;
  HEADER_HEIGHT = 32;
  rowStyle;
  rowSelection = 'multiple';
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  cellStyle = {
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
  };

  selectedStudents = [];
  booleanSemester = true;
  setColumn;
  showPagination = true;

  // search form
  dataSearch;
  formSearch: FormGroup;

  subscription: Subscription;

  classRoomName;
  _year;
  title;
  // paging
  perPage = 10;
  currentPage = 1;
  first = 0;
  last = 0;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  hide;

  listStatus = [
    {id: 0, name: this.translate.instant(`MANAGE_CONTACT.UNREGISTER`)},
    {id: 1, name: this.translate.instant(`MANAGE_CONTACT.REGISTER`)},
    {id: 2, name: this.translate.instant(`MANAGE_CONTACT.ACTIVATED`)},
    {id: 3, name: this.translate.instant(`MANAGE_CONTACT.PAUSE`)},
  ];

  selectedStatusId = null;

  currentYear;
  currentYearObj;
  semesterAmount;
  listSemesters = [];

  semestersInCurrentYear;
  semestersInCurrentYear1;
  semesterValue;

  listGradeLevel = [];
  selectedGradeLevelId = null;

  listClass = [];
  selectedClassId = null;

  mappingRelationships = {
    0: this.translate.instant(`MANAGE_CONTACT.FATHER`),
    1: this.translate.instant(`MANAGE_CONTACT.MOTHER`),
    2: this.translate.instant(`MANAGE_CONTACT.GRANDPARENTS`),
    3: this.translate.instant(`MANAGE_CONTACT.SIBLINGS`),
    4: this.translate.instant(`MANAGE_CONTACT.AUNTIE`),
    5: this.translate.instant(`MANAGE_CONTACT.GUARDIANS`),
  };
  mappingStatus = {
    0: '-',
    1: this.translate.instant(`MANAGE_CONTACT.REGISTER`),
    2: this.translate.instant(`MANAGE_CONTACT.ACTIVATED`),
    3: this.translate.instant(`MANAGE_CONTACT.PAUSE1`),
  };
  mappingStyleStatus = {
    0: 'unregistered',
    1: 'registered',
    2: 'actived',
    3: 'canceled',
  };
  mappingDurations = {
    0: this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`),
    1: this.translate.instant(`MANAGE_CONTACT.SEMESTER1`),
    2: this.translate.instant(`MANAGE_CONTACT.SEMESTER2`),
    3: this.translate.instant(`MANAGE_CONTACT.SEMESTER3`),
    4: this.translate.instant(`MANAGE_CONTACT.SEMESTER4`),
    5: this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`),
  };

  mappingSemester = {
    0: '-',
    1: this.translate.instant(`MANAGE_CONTACT.SEMESTER1_1`),
    2: this.translate.instant(`MANAGE_CONTACT.SEMESTER2_1`),
    3: this.translate.instant(`MANAGE_CONTACT.SEMESTER3_1`),
    4: this.translate.instant(`MANAGE_CONTACT.SEMESTER4_1`),
  };

  mappingUnits = {
    1: 'VND',
    2: 'USD',
    3: 'KIP'
  }


  errorMessages;

  selectedSemester;

  selectedPackage;
  packageName;
  packageCode;
  packageDescription;
  registerStudendIds= [];
  registerStudendCodes=[];
  listPhoneRegister=[];
  listStudentName=[];
  updateStatus;
  // updateStatus1;
  // updateStatus2;
  // updateStatus3;
  // updateStatus4;
  // updateStatusFullYear;
  fromPackageDate;
  toPackageDate;
  selectedSemesterId;

  schoolInfo = JSON.parse(sessionStorage.getItem('schoolInfo'));

  dataUpdate;

  disableSave = false;

  listSemesterRegistered = [];
  selectedSemesterRegistered;

  checkDisplayRegister =false;
  checkDisplayCancel = false;

  classRoomNameDisplay;

  listDataPackage = [];

  limitStringCellValue = (params) => {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };
  onSelectionChanged(event) {
    this.checkDisplayRegister=false;
    this.checkDisplayCancel = false;
    console.log('event', event);
    const selectedNodes = event.api.getSelectedNodes();
    console.log('selectedNodes', selectedNodes);
    this.selectedStudents = selectedNodes.map((node) => ({
      id: node.data.id,
      code: node.data.studentCode,
      status1: node.data.status1,
      status2: node.data.status2,
      status3: node.data.status3,
      status4: node.data.status4,
      statusFullYear: node.data.statusFullYear,
      phoneParent : node.data.phoneNumber,
      studentName : node.data.studentName,
      // semester: node.data.semester,
    }));
    console.log('this.selectedStudents', this.selectedStudents);
    console.log('semestersInCurrentYear1',this.semestersInCurrentYear1);

    this.semestersInCurrentYear1.forEach(item=>{
      if(item.defaultValue === true){
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        if(new Date(date) <= new Date(this.semestersInCurrentYear1[this.semestersInCurrentYear.length-1].toDate)
          && new Date(date) >= new Date(this.semestersInCurrentYear1[0].fromDate)
        ){
          this.checkDisplayRegister=true;
        }
      }
    })
    if(this.selectedStudents.length >0){
      let count =0;
      this.selectedStudents.forEach(item=>{
        if(item.status1===1 || item.status1===2 ||
          item.status2===1 || item.status2===2 ||
          item.status3===1 || item.status3===2 ||
          item.status4===1 || item.status4===2 ||
          item.statusFullYear===1 || item.statusFullYear===2
        ){
          count++;
        }
      })
      if(this.selectedStudents.length=== count){
        this.checkDisplayCancel = true;
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadCurrentYear();
    setTimeout( () => {
      this.resizeTwoLastColumns()
      params.api.sizeColumnsToFit()
    }, 500)
  }

  gridSizeChanged(params) {
    setTimeout( () => {
      this.resizeTwoLastColumns()
      params.api.sizeColumnsToFit()
    }, 500)
  }

  ngOnInit(): void {
    this.buildFormSearch();
  }

  buildFormSearch() {
    this.formSearch = this.fb.group({
      studentName: '',
    });
  }

  loadCurrentYear(): void {
    console.log('loadCurrentYear');

    this.selectedStudents = [];
    this.listSemesters = [];
    this.subscription = this.classRoomService.listYears$.subscribe(
      (listYears) => {
        this.classRoomService.yearCurrent$.subscribe((currentYear) => {
          console.log('currentYear', currentYear);
          this.currentYear = currentYear;
          this.currentYearObj = listYears.find(
            (_year) => _year.years === this.currentYear
          );

          this.semesterValue = null;
          this.selectedStatusId = null;
          this. buildFormSearch();


          if (this.currentYearObj) {
            this.semesterAmount = this.currentYearObj.semesterAmount;
            this.loadSemesters();
            this.loadGradeLevel();

            this.changeDetectorRef.detectChanges();
          }
          this.changeDetectorRef.detectChanges();
        });
      }
    );
  }

  initGrid() {
    return [
      {
        headerName: '',
        minWidth: 52,
        maxWidth: 52,
        headerClass: 'custom-merge-header1',
        // headerClass: 'custom-merge-header-checkbox-gradebook',
        suppressMovable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        pinned: 'left',
        lockPosition: true,
      },
      {
        headerName: this.translate.instant(`MANAGE_CONTACT.NUMBER`),
        headerTooltip: this.translate.instant(`MANAGE_CONTACT.NUMBER`),
        // headerClass: 'sy-header-center',
        field: 'index',
        tooltipField: 'index',
        minWidth: 48,
        maxWidth: 48,
        headerClass: 'center custom-merge-header1',
        // headerClass :'custom-merge-header-stt',
        pinned: 'left',
        suppressMovable: true,
        cellStyle: {
          // ...this.cellStyle,
          ...TABLE_CELL_STYLE,
          'justify-content': 'center',
        },
      },
      {
        headerName: this.translate.instant(`MANAGE_CONTACT.STUDENT_CODE`),
        headerClass: 'custom-merge-header1',
        headerTooltip: this.translate.instant(`MANAGE_CONTACT.STUDENT_CODE`),
        field: 'studentCode',
        tooltipField: 'studentCode',
        minWidth: 100,
        // maxWidth: 100,
        pinned: 'left',
        suppressMovable: true,
        cellStyle: {
          // ...this.cellStyle,
          ...TABLE_CELL_STYLE,
          color: '#3366FF',
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        headerName: this.translate.instant(`MANAGE_CONTACT.STUDENT_NAME`),
        headerClass: 'custom-merge-header1',
        headerTooltip: this.translate.instant(`MANAGE_CONTACT.STUDENT_NAME`),
        field: 'studentName',
        tooltipField: 'studentName',
        minWidth: 120,
        // maxWidth: 120,
        pinned: 'left',
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        headerName: this.translate.instant(`MANAGE_CONTACT.CLASS`),
        headerClass: 'custom-merge-header1',
        headerTooltip: this.translate.instant(`MANAGE_CONTACT.CLASS`),
        pinned: 'left',
        field: 'className',
        tooltipField: 'className',
        minWidth: 80,
        maxWidth: 80,
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
      },
      //   ],
      // },
      {
        headerName: this.translate.instant(`MANAGE_CONTACT.REGISTER_INFORMATION`),
        headerClass: 'header-color header-color1',
        children: [
          {
            headerName: this.translate.instant(`MANAGE_CONTACT.PARENT_NAME`),
            headerTooltip: this.translate.instant(`MANAGE_CONTACT.PARENT_NAME`),
            field: 'parentName',
            tooltipField: 'parentName',
            minWidth: 130,
            maxWidth: 130,
            suppressMovable: true,
            headerClass: 'header-color margin-left-0',
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
          {
            headerName: this.translate.instant(`MANAGE_CONTACT.RELATIVE`),
            headerTooltip: this.translate.instant(`MANAGE_CONTACT.RELATIVE`),
            field: 'relationLabel',
            tooltipField: 'relationLabel',
            maxWidth: 80,
            minWidth: 80,
            suppressMovable: true,
            headerClass: 'header-color margin-left-0',
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
          {
            headerName: this.translate.instant(`MANAGE_CONTACT.PHONE`),
            headerTooltip: this.translate.instant(`MANAGE_CONTACT.PHONE`),
            field: 'phoneNumber',
            tooltipField: 'phoneNumber',
            maxWidth: 100,
            minWidth: 100,
            suppressMovable: true,
            headerClass: 'header-color margin-left-0',
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
        ],
      },
    ];
  }

  loadSemesters(): void {
    this.listDataPackage = [];
    this.setColumn = null;
    // console.log('setColumn1', this.setColumn);
    // console.log('columnDefs1', this.columnDefs);
    const year = {
      years: this.currentYear
    };

    // const listChildPackage = this.schoolInfo.childPackage;
    // const listDataPackageOfSemester = [];

    this.evaluateConductService.getSemesterByYear(year)
      .subscribe((listSemesters) => {
        console.log('listSemesters',listSemesters);
        this.semestersInCurrentYear1 = listSemesters.map((item) => ({
          defaultValue: item.defaultValue,
          fromDate : item.fromDate,
          name: this.mappingDurations[item.value],
          toDate: item.toDate,
          value: item.value,
        }));
        this.semestersInCurrentYear1.pop();
        console.log('semestersInCurrentYear1',this.semestersInCurrentYear1);
        const i = 0;
        this.setColumn = this.initGrid();
        console.log('columnDefs', this.setColumn);

        // check hoc ky thuoc nam hien tai khong, de gan gia tri mac dinh
        // listSemesters.forEach(item => {
        //   if (item.defaultValue === true) {
        //     this.semesterValue = item.value;
        //     i++;
        //   }
        // })
        // if (i === 0) {
        //   this.semesterValue = listSemesters[0].value;
        // }

        const listChildPackage = this.schoolInfo.schoolPackage.childPackage;
        const listDataPackageOfSemester = [];
        console.log('listChildPackage',listChildPackage);
        console.log('listSemesters',listSemesters);

        for (let j = 0; j < listSemesters.length-1; j++){
          let count1 =0;
          for(let q = 0 ; q<listChildPackage.length; q++){
              if(listChildPackage[q].typePackage ===0 &&
                listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
                listChildPackage[q].quantitySemesterApply === listSemesters.length-1 &&
                listChildPackage[q].semesterApply === (j+1).toString()
              ){
                count1++;
                listDataPackageOfSemester.push({
                  id:j+1,
                  namePackage : listChildPackage[q].name
                })
              }
          }
          if(count1 ===0){
            for(let q = 0 ; q<listChildPackage.length; q++){
              if(listChildPackage[q].typePackage ===0 &&
                listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
                listChildPackage[q].quantitySemesterApply === listSemesters.length-1 &&
                listChildPackage[q].semesterApply === null
              ){
                listDataPackageOfSemester.push({
                  id:j+1,
                  namePackage : listChildPackage[q].name
                })
                break;
              }
            }
          }
          this.listDataPackage = [...listDataPackageOfSemester];
          console.log('count1',count1)
          console.log('listDataPackageOfSemester11111',listDataPackageOfSemester);
        }

        console.log('schoolPackage',this.schoolInfo.schoolPackage);
        console.log('listDataPackageOfSemester',listDataPackageOfSemester);
        this.gridApi.setColumnDefs(this.setColumn);
        for (let j = 0; j < listSemesters.length; j++) {
          if (j !== listSemesters.length - 1) {
            if(listDataPackageOfSemester.length>0){
              this.setColumn[5].children.push({
                headerComponentParams :{
                  template:'<span style="width:100%;"><div style="font-size:10px; ' +
                    'color:#8f95b2;' +
                    'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                    'text-transform: uppercase; float:left; max-width:95%">' +
                    `${this.mappingSemester[j + 1]} (${listDataPackageOfSemester[j].namePackage}` +
                    '</div>'+
                    '<div style="font-size:10px;color:#8f95b2;'+
                    'text-transform: uppercase;transform: translateY(-1px);">)</div></span>',
                },
                // headerName: `${this.mappingSemester[j + 1]} (${listDataPackageOfSemester[j].namePackage})`,
                headerTooltip: `${this.mappingSemester[j + 1]} (${listDataPackageOfSemester[j].namePackage})`,
                field: `status${j + 1}`,
                tooltipField: `statusLabel${j + 1}`,
                // maxWidth: 140,
                minWidth: 140,
                headerClass: 'header-color margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== 0) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  }
                  return element;
                },
                cellStyle: {
                  ...this.cellStyle,
                },
              });
              this.gridApi.setColumnDefs(this.setColumn);
            } else {
              this.setColumn[5].children.push({
                headerComponentParams :{
                  template:'<span style="font-size:10px; ' +
                    'color:#8f95b2;' +
                    'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                    'text-transform: uppercase">' +
                    `${this.mappingSemester[j + 1]}` +
                    '</span>',
                },
                // headerName: `${this.mappingSemester[j + 1]}`,
                headerTooltip: `${this.mappingSemester[j + 1]}`,
                field: `status${j + 1}`,
                tooltipField: `statusLabel${j + 1}`,
                // maxWidth: 140,
                minWidth: 140,
                headerClass: 'header-color margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== 0) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  }
                  return element;
                },
                cellStyle: {
                  ...this.cellStyle,
                },
              });
              this.gridApi.setColumnDefs(this.setColumn);
            }
          } else {
            if(listDataPackageOfSemester.length>0){
              this.setColumn[5].children.push({
                // headerComponentParams :{
                //   template:'<span style="font-size:10px; ' +
                //     'color:#8f95b2;' +
                //     'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                //     'text-transform: uppercase">' +
                //     this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`)+` (${this.schoolInfo.schoolPackage.name})` +
                //     '</span>',
                // },
                headerComponentParams :{
                  template:'<span style="width:100%;"><div style="font-size:10px; ' +
                    'color:#8f95b2;' +
                    'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                    'text-transform: uppercase; float:left; max-width:80%">' +
                    this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`)+` (${this.schoolInfo.schoolPackage.name}` +
                    '</div>'+
                    '<div style="font-size:10px;color:#8f95b2;'+
                    'text-transform: uppercase;transform: translateY(-1px);">)</div></span>',
                },
                // headerName: `Cả năm (${this.schoolInfo.schoolPackage.name})`,
                headerTooltip: this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`)+` (${this.schoolInfo.schoolPackage.name})`,
                field: 'statusFullYear',
                tooltipField: 'statusFullYearLabel',
                // maxWidth: 140,
                minWidth: 160,
                headerClass: 'header-color margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== 0) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  }
                  return element;
                },
                cellStyle: {
                  ...this.cellStyle,
                },
              });
              this.gridApi.setColumnDefs(this.setColumn);
            }
            else {
              this.setColumn[5].children.push({
                headerComponentParams :{
                  template:'<span style="font-size:10px; ' +
                    'color:#8f95b2;' +
                    'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                    'text-transform: uppercase">' +
                    this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`) +
                    '</span>',
                },
                // headerName: `Cả năm`,
                headerTooltip: this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`),
                field: 'statusFullYear',
                tooltipField: 'statusFullYearLabel',
                // maxWidth: 140,
                minWidth: 160,
                headerClass: 'header-color margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== 0) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  }
                  return element;
                },
                cellStyle: {
                  ...this.cellStyle,
                },
              });
              this.gridApi.setColumnDefs(this.setColumn);
            }
          }
          this.gridApi.setColumnDefs(this.setColumn);
        }
        this.setColumn.push({
          headerName: this.translate.instant(`MANAGE_CONTACT.HISTORY_REGISTER`),
          headerClass: 'custom-merge-header1',
          headerTooltip: this.translate.instant(`MANAGE_CONTACT.HISTORY_REGISTER`),
          maxWidth: 120,
          minWidth: 120,
          suppressMovable: true,
          pinned: 'right',
          headerComponentParams :{
            template:'<span style="font-size:10px; line-height: 15px; ' +
              'color:#8f95b2;' +
              'white-space: break-spaces;' +
              'text-transform: uppercase">' +
              this.translate.instant(`MANAGE_CONTACT.HISTORY_REGISTER`) +
              '</span>',
          },
          cellStyle: {
            ...this.cellStyle,
            'padding-left': '14px',
          },
          cellRendererFramework: HistoryContactPackageComponent,
        });
        // this.gridApi.setColumnDefs(this.initGrid());
        this.gridApi.setColumnDefs(this.setColumn);
        console.log('setColumn2', this.setColumn);
        this.changeDetectorRef.detectChanges();
      });


    this.manageContactService
      .getSemesterByYear(this.currentYear)
      .subscribe((listSemesters) => {
        this.semestersInCurrentYear = listSemesters;
        this.changeDetectorRef.detectChanges();
        // console.log('this.semestersInCurrentYear', this.semestersInCurrentYear);
      });
  }

  loadSemestersInNow() {

  }

  loadGradeLevel(): void {
    this.gradeLevelService
      .getGradeLevelOfSubject()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (getGradeLevelResponse) => {
          this.listGradeLevel = getGradeLevelResponse;
          this.selectedGradeLevelId = getGradeLevelResponse[0].id;
          console.log({listGradeLevel: this.listGradeLevel});
          this.changeDetectorRef.detectChanges();
          this.loadClassRoom();
        },
        error: (res) => {
          alert(res);
        },
      });
  }

  onChangeGradeLevel(gradeLevelId) {
    this.selectedGradeLevelId = gradeLevelId;
    this.loadClassRoom();
  }

  loadClassRoom(): void {
    this.rowData = undefined;
    this.selectedClassId = -1;
    this.classRoomName = undefined;
    this.classRoomNameDisplay= undefined;
    this._year = undefined;
    this.title = undefined;
    this.listClass = [];
    if (Boolean(this.selectedGradeLevelId)) {
      const query: object = {
        gradeLevel: this.selectedGradeLevelId,
        years: this.currentYear,
      };
      console.log('id khoi', this.selectedGradeLevelId)
      this.classRoomService
        .findByGradeLevelAndYear(query)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (getClassesResponse) => {
            if (getClassesResponse.status !== 'OK') {
              // alert(getClassesResponse.message);
              return;
            }

            this.listClass = getClassesResponse.data.map((_class) => ({
              id: _class.id,
              name: `${_class.code} - ${_class.name}`,
              code: _class.code,
              title: _class.name
            }));
            this.selectedClassId = getClassesResponse.data[0].id;

            if (this.selectedClassId !== -1) {
              this.listClass.forEach(item => {
                if (item.id === this.selectedClassId) {
                  // const name = item.name.split('-', 2);
                  // this.classRoomName = name[1];
                  // this.classRoomNameDisplay = name[1];
                  // if(this.classRoomName.length >20){
                  //   this.classRoomNameDisplay = this.classRoomNameDisplay.slice(0,20)+'...';
                  // }
                  this.classRoomName = item.title;
                  this._year = '('+this.translate.instant(`MANAGE_CONTACT.YEAR`)+': ' + this.currentYear + ')';
                  this.title = this.classRoomName +' '+ this._year;
                }
              })
            }


            console.log(`list class`, getClassesResponse);
            this.changeDetectorRef.detectChanges();
            this.findListContacts(1);
          },
          // error: (res) => {
          //   alert(res);
          // },
        });
    }
  }

  onChangeClass(classId) {
    this.selectedClassId = classId;
    this.classRoomName = undefined;
    this._year = undefined;
    this.classRoomNameDisplay= undefined;
    if (this.selectedClassId !== -1) {
      this.listClass.forEach(item => {
        if (item.id === this.selectedClassId) {
          // const name = item.name.split('-', 2);
          // console.log('name', name);
          // this.classRoomName = name[1];
          // this.classRoomNameDisplay = name[1];
          // if(this.classRoomName.length >25){
          //   this.classRoomNameDisplay = this.classRoomNameDisplay.slice(0,24)+'...';
          // }
          this.classRoomName = item.title;
          this._year = '('+this.translate.instant(`MANAGE_CONTACT.YEAR`)+': ' + this.currentYear + ')';
          this.title = this.classRoomName + this._year;
        }
      })
    }
    this.findListContacts(1);
  }

  findListContacts(page: number) {
    this.hide = false;
    this.selectedStudents = [];
    this.currentPage = page;

    const dataSearch: any = {};
    dataSearch.gradeLevelId = this.selectedGradeLevelId,
    dataSearch.classRoomId = this.selectedClassId,
    dataSearch.status = this.selectedStatusId,
    dataSearch.student = this.formSearch.get('studentName').value.trim(),
    dataSearch.years = this.currentYear;
    dataSearch.page = this.currentPage;
    dataSearch.pageSize = this.perPage;

    if (this.selectedStatusId !== null) {
      if(this.semesterValue === '0'){
        dataSearch.semester = 5;
      }else {
        dataSearch.semester = this.semesterValue;
      }

    }
    ;
    this.dataSearch = dataSearch;

    console.log('dataSearch', dataSearch);
    // this.gridApi.showLoadingOverlay();
    this.manageContactService
      .doSearchContact(dataSearch)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (searchContactResponse) => {
          console.log(`searchContactResponse`, searchContactResponse);

          const {contactResultDTOS: contacts, totalRecord: totalElements} =
            searchContactResponse;
          console.log('find teaching assignment', {contacts});

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;
            this.last = this.first + contacts.length - 1;

            this.rowData = contacts.map((contact, _index) => {
              const singleRowData = {
                index: this.first + _index,
                id: contact.id,
                studentCode: contact.code,
                studentName: contact.fullName,
                className: contact.className,
                parentName: contact.parents,
                relation: contact.relationship,
                relationLabel: this.mappingRelationships[+contact.relationship],
                phoneNumber: contact.phone,
                packageContact: contact.namePackages || '-',

                status1: contact.status1 || 0,
                statusLabel1: this.mappingStatus[contact.status1 || 0],
                status2: contact.status2 || 0,
                statusLabel2: this.mappingStatus[contact.status2 || 0],
                status3: contact.status3 || 0,
                statusLabel3: this.mappingStatus[contact.status3 || 0],
                status4: contact.status4 || 0,
                statusLabel4: this.mappingStatus[contact.status4 || 0],
                statusFullYear: contact.statusFullYear || 0,
                statusFullYearLabel: this.mappingStatus[contact.statusFullYear || 0],

                currentYear: this.currentYear,

                semester: contact.semester || 0,
                duration: this.mappingDurations[contact.semester || 0],
              };

              return singleRowData;
            });
          } else {
            this.total = 0;
            this.rangeWithDots = [];
            this.first = 0;
            this.last = 0;
            this.rowData = [];
          }

          console.log(`this.rowData`, this.rowData);
          this.gridApi.setRowData(this.rowData);
          setTimeout( () => {
            this.resizeTwoLastColumns()
            this.gridApi.sizeColumnsToFit()
          }, 500)
          // this.gridApi.hideOverlay();
          this.hide= true;
          this.changeDetectorRef.detectChanges();
        },
        error: (res) => {
          alert(res);
        },
      });
  }

  goToPage(page: number) {
    console.log('page',page);
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.findListContacts(page);
    }
  }

  exportData() {
    // console.log('searchDataExport', this.dataSearch);
    // console.log('listDataPackage111',this.listDataPackage);
    // this.listDataPackage.push({id:5, namePackage:`${this.schoolInfo.schoolPackage.name}`});
    // console.log('listDataPackage222',this.listDataPackage);
    //
    // console.log('dataSearch11',this.dataSearch);
    // this.dataSearch.listDataPackage = this.listDataPackage;
    // console.log('dataSearch22',this.dataSearch);
    const list = [];
    this.listDataPackage.forEach(item=>{
      list.push(item.namePackage);
    })

    list.push(`${this.schoolInfo.schoolPackage.name}`);

    this.dataSearch.listDataPackage = list;

    this.manageContactService
      .export(this.dataSearch)
      .subscribe((responseMessage) => {
        const file = new Blob([responseMessage], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        const anchor = document.createElement('a');
        anchor.download = this.translate.instant(`MANAGE_CONTACT.LIST_SLL`)+`${moment()
          .format('DDMMYYYY')
          .toString()}`;
        anchor.href = fileURL;
        anchor.click();
      });
  }

  registerMultiPackage() {
    console.log('schoolInfo',this.schoolInfo.code);
    console.log(this.selectedStudents);
    if (
      this.selectedStudents.find(
        (student) => student.statusFullYear !== 0 && student.statusFullYear !== 3
      )
    ) {
      this.toastr.error(this.translate.instant(`MANAGE_CONTACT.REGISTER_ALL_YEAR`));
      return;
    }
    // const studentIds = this.selectedStudents.map((student) => student.id);
    this.openModalRegisterPackage(this.selectedStudents);
  }

  // openModalRegisterPackage(studenIds, status) {
  openModalRegisterPackage(data: any) {
    this.dataUpdate = data;
    this.packageName = '';
    this.packageDescription = '';
    this.fromPackageDate = '';
    this.toPackageDate = '';

    // console.log('ssStorage', this.schoolInfo.schoolPackage);
    // this.loadCurrentYear();
    this.listSemesters = [];
    if (this.currentYearObj) {
      this.semesterAmount = this.currentYearObj.semesterAmount;
      for (let _i = 0; _i < this.semesterAmount; _i++) {
        this.listSemesters.push({
          id: _i + 1,
          name: `${this.mappingDurations[_i + 1]}`,
        });
      }
      this.listSemesters.push({
        id: 5,
        name: this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`),
      });
    }

    this.selectedSemester = 5;
    const studentIds = [];
    const studentCodes=[];
    const phones=[];
    const students=[];
    console.log('selectedStudents',this.selectedStudents);
    this.selectedStudents.forEach(item=>{
      studentIds.push(item.id);
      studentCodes.push(item.code);
      phones.push(item.phoneParent);
      students.push(item.studentName);
    })
    this.registerStudendIds = studentIds;
    this.registerStudendCodes = studentCodes;
    this.listPhoneRegister = phones;
    this.listStudentName = students;
    // this.updateStatus = data[0].statusFullYear;
    console.log('registerStudendCodes', this.registerStudendCodes);
    console.log('phones', this.listPhoneRegister);
    console.log('listStudentName', this.listStudentName);

    // console.log('currentYear', this.currentYear);
    this.packageName = this.schoolInfo.schoolPackage.name;
    this.packageCode = this.schoolInfo.schoolPackage.code;
    this.packageDescription = this.translate.instant(`MANAGE_CONTACT.UNIT_PRICE`)+`: ${new Intl.NumberFormat(
      'en-US'
    ).format(this.schoolInfo.schoolPackage.prices)} USD/ ${
      this.schoolInfo.schoolPackage.quantitySms
    }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
    this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
      'DD/MM/YYYY'
    );
    this.toPackageDate = this.currentYearObj.toDate;
    this.semestersInCurrentYear.forEach(item => {
      if (item.toDate > this.toPackageDate) {
        this.toPackageDate = item.toDate;
      }
    })
    console.log('toDAte', this.toPackageDate);
    this.toPackageDate = moment(this.toPackageDate).format(
      'DD/MM/YYYY'
    );

    this.modalRef = this.modalService.show(
      this.registerPackageModal,
      Object.assign({}, {class: 'action-register-dialog-custom'})
    );
  }


  onChangeSemester(semester) {

    this.packageName = '';
    this.packageDescription = '';
    this.fromPackageDate = '';
    this.toPackageDate = '';

    // this.checkChonHocKy();
    // this.schoolInfo.schoolPackage;

    this.selectedSemester = semester;
    this.disableSave = false;

    console.log('this.selectedSemester', this.selectedSemester);

    if (this.selectedSemester === 5) {
      this.packageName = this.schoolInfo.schoolPackage.name;
      this.packageCode = this.schoolInfo.schoolPackage.code;
      this.packageDescription = this.translate.instant(`MANAGE_CONTACT.UNIT_PRICE`)+`: ${new Intl.NumberFormat(
        'en-US',
      ).format(this.schoolInfo.schoolPackage.prices)} USD/ ${
        this.schoolInfo.schoolPackage.quantitySms
      }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
      this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
        'DD/MM/YYYY'
      );
      this.toPackageDate = this.currentYearObj.toDate;
      this.semestersInCurrentYear.forEach(item => {
        if (item.toDate > this.toPackageDate) {
          this.toPackageDate = item.toDate;
        }
      })
      console.log('toDAte', this.toPackageDate);
      this.toPackageDate = moment(this.toPackageDate).format(
        'DD/MM/YYYY'
      );
    } else {
      let count = 0;
      if (semester === 1) {
        for (let i = 0; i < this.dataUpdate.length; i++) {
          if (this.dataUpdate[i].status1 === 1 || this.dataUpdate[i].status1 === 2) {
            count++;
          }
        }}
      if (semester === 2) {
          for (let i = 0; i < this.dataUpdate.length; i++) {
            if (this.dataUpdate[i].status2 === 1 || this.dataUpdate[i].status2 === 2) {
              count++;
            }
          }}
      if (semester === 3) {
        for (let i = 0; i < this.dataUpdate.length; i++) {
          if (this.dataUpdate[i].status3 === 1 || this.dataUpdate[i].status3 === 2) {
            count++;
          }
        }}
      if (semester === 4) {
        for (let i = 0; i < this.dataUpdate.length; i++) {
          if (this.dataUpdate[i].status4 === 1 || this.dataUpdate[i].status4 === 2) {
            count++;
          }
        }}
      if(count !==0){
        if(this.dataUpdate.length===1){
          // this.selectedSemester = 5;
          // this.resetModalRegisterPackage();
          this.toastr.error(this.translate.instant(`MANAGE_CONTACT.SEMESTER_REGISTED`));
          // this.selectedSemester = 5;
          // this.resetModalRegisterPackage();
          // this.changeDetectorRef.detectChanges();
        }
        else {
          // this.selectedSemester = 5;
          // this.resetModalRegisterPackage();
          // this.toastr.error('Có '+count+ '/'+ this.dataUpdate.length +' học sinh đã đăng ký/kích hoạt cho học kỳ đã chọn');
          this.toastr.error(this.translate.instant(`MANAGE_CONTACT.HAVE`)+' '+count+ '/'+ this.dataUpdate.length +' '+this.translate.instant(`MANAGE_CONTACT.HAVE1`));
          // this.selectedSemester = 5;
          // this.resetModalRegisterPackage();
          // this.changeDetectorRef.detectChanges();
        }
        // console.log('cay',this.selectedSemester);
        // this.selectedSemester = 5;
        // this.onChangeSemester(5);
        console.log('cay',this.selectedSemester);
        this.changeDetectorRef.detectChanges();
        this.disableSave = true;
      }

      // await this.checkRegisterPackagePass();

      const dataUpdate: any = {};
      dataUpdate.semester = this.selectedSemester;
      dataUpdate.shoolYear = this.currentYear;

      this.manageContactService
        .checkRegisterPackagePass(dataUpdate)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (responseAPI: any) => {
            console.log('responseAPI', responseAPI);
            if (responseAPI.status === 'BAD_REQUEST') {
              this.toastr.error(responseAPI.message);
              this.disableSave = true;
            }
          }
        });


          const childPackage = this.schoolInfo.schoolPackage.childPackage;
          let k = 0;
          console.log('childPackage', childPackage);

          for (let i = 0; i < childPackage.length; i++) {
            if (childPackage[i].semesterApply === this.selectedSemester.toString()) {
              k++;
              break;
            }
          }
          console.log('k', k);

          if (k === 0) {
            for (let i = 0; i < childPackage.length; i++) {
              if (childPackage[i].typePackage === 0 && childPackage[i].primaryPackage === this.schoolInfo.schoolPackage.code
                && childPackage[i].quantitySemesterApply === this.currentYearObj.semesterAmount
                && (childPackage[i].semesterApply === null)
              ) {
                this.packageName = childPackage[i].name;
                this.packageCode = childPackage[i].code;
                this.packageDescription = this.translate.instant(`MANAGE_CONTACT.UNIT_PRICE`)+`: ${new Intl.NumberFormat(
                  'en-US',
                ).format(childPackage[i].prices)} USD/ ${
                  childPackage[i].quantitySms
                }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
                this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
                  'DD/MM/YYYY'
                );
                const selectedSemester = this.semestersInCurrentYear.find(
                  (_semester) => +_semester.semester === +this.selectedSemester
                );
                this.fromPackageDate = moment(selectedSemester.fromDate).format(
                  'DD/MM/YYYY'
                );
                this.toPackageDate = moment(selectedSemester.toDate).format(
                  'DD/MM/YYYY'
                );
                break;
              }
            }
          } else {
            for (let i = 0; i < childPackage.length; i++) {
              if (childPackage[i].typePackage === 0 && childPackage[i].primaryPackage === this.schoolInfo.schoolPackage.code
                && childPackage[i].quantitySemesterApply === this.currentYearObj.semesterAmount
                && (childPackage[i].semesterApply === this.selectedSemester.toString())
              ) {
                this.packageName = childPackage[i].name;
                this.packageCode = childPackage[i].code;
                this.packageDescription = this.translate.instant(`MANAGE_CONTACT.UNIT_PRICE`)+`: ${new Intl.NumberFormat(
                  'en-US',
                ).format(childPackage[i].prices)} USD/ ${
                  childPackage[i].quantitySms
                }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
                this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
                  'DD/MM/YYYY'
                );
                const selectedSemester = this.semestersInCurrentYear.find(
                  (_semester) => +_semester.semester === +this.selectedSemester
                );
                this.fromPackageDate = moment(selectedSemester.fromDate).format(
                  'DD/MM/YYYY'
                );
                this.toPackageDate = moment(selectedSemester.toDate).format(
                  'DD/MM/YYYY'
                );
                break;
              }
            }
          }
        }
      }

      updateRegisterPackage()
      {
        const dataUpdate: any = {};
        dataUpdate.dataPackage = this.packageCode;
        dataUpdate.semester = this.selectedSemester;
        dataUpdate.shoolYear = this.currentYear;
        dataUpdate.schoolCode = this.schoolInfo.code;
        // dataUpdate.listStudentId = this.registerStudendIds;
        dataUpdate.listStudentCode = this.registerStudendCodes;

        dataUpdate.listPhone = this.listPhoneRegister;
        dataUpdate.listStudentName = this.listStudentName;

        console.log('dataUpdate', dataUpdate);
        this.manageContactService
          .registerPackage(dataUpdate)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (responseAPI: any) => {
              console.log('responseAPI', responseAPI);
              if (responseAPI.status === 'OK') {
                this.toastr.success(responseAPI.message);
                this.modalRef.hide();

                this.findListContacts(this.currentPage);
              } else if (responseAPI.status === 'BAD_REQUEST') {
                console.log(responseAPI.message);
                this.toastr.error(responseAPI.message);
              }
            },
            error: (res) => {
              alert(res);
            },
          });
      }

      setSemesterDefault(){
        let i=0;
        this.semestersInCurrentYear1.forEach(item => {
          if (item.defaultValue === true) {
            this.semesterValue = item.value;
            i++;
          }
        })
        if (i === 0) {
          this.semesterValue = this.semestersInCurrentYear1[0].value;
        }
      }

      changeStatus()
      {
        if (this.selectedStatusId === null) {
          this.booleanSemester = true;
          this.semesterValue = null;
        } else {
          this.booleanSemester = false;
          this.setSemesterDefault();
        }

        console.log('selectedStatusId', this.selectedStatusId);
      }
  openModalDelete(template1: TemplateRef<any>) {

    console.log(this.selectedStudents);

    this.listSemesterRegistered = [];
    if (this.currentYearObj) {
      this.semesterAmount = this.currentYearObj.semesterAmount;

      const listChildPackage = this.schoolInfo.schoolPackage.childPackage;
      const listDataPackageOfSemester = [];
      console.log('listChildPackage',listChildPackage);

      for (let j = 0; j < this.semesterAmount; j++){
        let count1 =0;
        for(let q = 0 ; q<listChildPackage.length; q++){
          if(listChildPackage[q].typePackage ===0 &&
            listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
            listChildPackage[q].quantitySemesterApply === this.semesterAmount &&
            listChildPackage[q].semesterApply === (q+1).toString()
          ){
            count1++;
            listDataPackageOfSemester.push({
              id:q+1,
              namePackage : listChildPackage[q].name
            })
          }
        }
        if(count1 ===0){
          for(let q = 0 ; q<listChildPackage.length; q++){
            if(listChildPackage[q].typePackage ===0 &&
              listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
              listChildPackage[q].quantitySemesterApply === this.semesterAmount &&
              listChildPackage[q].semesterApply === null
            ){
              listDataPackageOfSemester.push({
                id:q+1,
                namePackage : listChildPackage[q].name
              })
              break;
            }
          }
        }
      }

      console.log('listDataPackageOfSemester',listDataPackageOfSemester);

      for (let _i = 0; _i < this.semesterAmount; _i++) {
        console.log('this.selectedStudents[0]',this.selectedStudents[0]);
        if(_i ===0){
          if(this.selectedStudents[0].status1 === 1 || this.selectedStudents[0].status1 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `${this.mappingDurations[_i + 1]} (${listDataPackageOfSemester[_i].namePackage})`,
            });
        }
        if(_i ===1){
          if(this.selectedStudents[0].status2 === 1 || this.selectedStudents[0].status2 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `${this.mappingDurations[_i + 1]} (${listDataPackageOfSemester[_i].namePackage})`,
            });
        }

        if(_i ===2){
          if(this.selectedStudents[0].status3 === 1 || this.selectedStudents[0].status3 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `${this.mappingDurations[_i + 1]} (${listDataPackageOfSemester[_i].namePackage})`,
            });
        }
        if(_i ===3){
          if(this.selectedStudents[0].status4 === 1 || this.selectedStudents[0].status4 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `${this.mappingDurations[_i + 1]} ( ${listDataPackageOfSemester[_i].namePackage} )`,
            });
        }
        }
      if(this.selectedStudents[0].statusFullYear ===1 || this.selectedStudents[0].statusFullYear ===2){
        this.listSemesterRegistered.push({
          id: 5,
          name: this.translate.instant(`MANAGE_CONTACT.ALL_YEAR`)+` (${this.schoolInfo.schoolPackage.name})`,
        });
      }
    }

    // if(this.selectedSemesterRegistered !== undefined){
      this.selectedSemesterRegistered = this.listSemesterRegistered[0].id;
    // }


    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'action-contact-dialog-custom' })
    );
  }

  onChangeSemesterCancel(semester) {

  }




  deteleContactPackage() {
    const dataDelete : any={};
    dataDelete.studentId= this.selectedStudents[0].id,
    dataDelete.studentCode= this.selectedStudents[0].code,
    dataDelete.shoolYear= this.currentYear,
    dataDelete.schoolCode =this.schoolInfo.code,
    dataDelete.semester = this.selectedSemesterRegistered;

    console.log('dataDelete', dataDelete);
    const confirm = {
      title: this.translate.instant(`MANAGE_CONTACT.CONFIRM_CANCEL_TITLE`),
      message: this.translate.instant(`MANAGE_CONTACT.CONFIRM_CANCEL_MESAGE`),
    };
    this.matDialog.open(ConfirmSaveComponent, {
      data: confirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        console.log('dataUpdate1',dataDelete);
        this.manageContactService
          .deteleContactPackage(dataDelete)
          .subscribe((responseAPI) => {
            console.log('aaa', responseAPI);
            if (responseAPI.status === 'OK') {
              this.findListContacts(1);
              this.toastr.success(responseAPI.message);
              this.modalRef.hide();
            } else {
              this.toastr.error(responseAPI.message);
              this.modalRef.hide();
            }
          });
      }
    })

    // status :

    // this.manageContactService
    //   .deteleContactPackage(dataDelete)
    //   .subscribe((responseAPI) => {
    //     console.log('aaa', responseAPI);
    //     if (responseAPI.status === 'OK') {
    //       this.findListContacts(1);
    //       this.toastr.success(responseAPI.message);
    //       this.modalRef.hide();
    //     } else {
    //       this.toastr.error(responseAPI.message);
    //       this.modalRef.hide();
    //     }
    //   });
  }

  unSelected(){
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        row.setSelected(false);
      }
    });
  }


  gridColumnsChanged(param) {
    setTimeout( () => {

      param.api.sizeColumnsToFit()
      this.resizeTwoLastColumns()
    }, 500)
  }

  resizeTwoLastColumns(): void {
    const header = (document.querySelector('.ag-pinned-right-header') as HTMLElement)
    const body = (document.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
    console.log(header);
    console.log(body);
    body.style.minWidth = `${header.offsetWidth}px`
  }

}
