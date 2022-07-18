import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {MatDialog} from '@angular/material/dialog';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {GroupTeacherDetailsModel} from '../../../../../../core/service/model/group-teacher-details.model';
import {ContactGroupService} from '../../../../../../core/service/service-model/contact-group.service';
import {CommonServiceService} from '../../../../../../core/service/utils/common-service.service';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../../helpers/constants';
import {ContactGroupParentService} from "../../../../../../core/service/service-model/contact-parent-group.service";
import {ClassroomService} from "../../../../../../core/service/service-model/classroom.service";
import { Subscription } from 'rxjs';
import { EvaluateConductService } from 'src/app/core/service/service-model/evaluate-conduct.service';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactService } from 'src/app/core/service/service-model/manage-contact.service';

@Component({
  selector: 'kt-view-detail-group-parents',
  templateUrl: './view-detail-group-parents.component.html',
  styleUrls: ['./view-detail-group-parents.component.scss']
})
export class ViewDetailGroupParentsComponent implements OnInit, ICellRendererAngularComp {
  @ViewChild('searchGroupDetail') private elementRef: ElementRef;
  groupTeacherDetailsList: GroupTeacherDetailsModel[] = [];
  headerHeight = 56;
  rowHeight = 50;
  gridApi;
  gridColumnApi;
  groupName: string;

  listSemesters = [];
  subscription: Subscription;
  currentYear;
  currentYearObj;
  semestersInCurrentYear;
  semestersInCurrentYear1;
  semesterValue;
  semesterAmount;
  setColumn;
  listDataPackage = [];
  schoolInfo = JSON.parse(sessionStorage.getItem('schoolInfo'));
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

  initGrid(){
    return [
      {
        headerName: this.translate.instant(`PARENT_CONTACT.NUMBER`),
        field: 'make',
        headerClass: 'sy-header-center',
        valueGetter: param => {
          return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
        },
        minWidth: 48,
        maxWidth: 48,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          justify: 'space-between',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
        },
        suppressMovable: true,
        resizable: true
      },
      {
        headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.STUDENT_CODE`),
        field: 'studentCode',
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
        minWidth: 100,
        tooltipField: 'studentCode',
        suppressMovable: true,
        resizable: true
      },
      {
        headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.STUDENT_NAME`),
        field: 'fullName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'border-right': 'none'
        },
        minWidth: 120,
        tooltipField: 'fullName',
        suppressMovable: true,
        resizable: true
      },
      {
        headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.PHONE`),
        field: 'phone',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'border-right': 'none'
        },
        minWidth: 120,
        tooltipField: 'phone',
        suppressMovable: true,
        resizable: true
      },
      {
        headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.CLASS`),
        field: 'className',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'border-right': 'none'
        },
        minWidth: 60,
        tooltipField: 'className',
        suppressMovable: true,
        resizable: true
      },
      {
        headerName: this.translate.instant(`PARENT_CONTACT.YEAR`),
        field: 'currentYear',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'border-right': 'none'
        },
        minWidth: 100,
        tooltipField: 'currentYear',
        suppressMovable: true,
        resizable: true
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
        // console.log('listSemesters',listSemesters);
        this.semestersInCurrentYear1 = listSemesters.map((item) => ({
          defaultValue: item.defaultValue,
          fromDate : item.fromDate,
          name: this.mappingDurations[item.value],
          toDate: item.toDate,
          value: item.value,
        }));
        this.semestersInCurrentYear1.pop();
        // console.log('semestersInCurrentYear1',this.semestersInCurrentYear1);
        const i = 0;
        this.setColumn = this.initGrid();
        // console.log('columnDefs', this.setColumn);

        const listChildPackage = this.schoolInfo.schoolPackage.childPackage;
        const listDataPackageOfSemester = [];
        // console.log('listChildPackage',listChildPackage);
        // console.log('listSemesters',listSemesters);

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
          // console.log('count1',count1)
          // console.log('listDataPackageOfSemester11111',listDataPackageOfSemester);
        }

        // console.log('schoolPackage',this.schoolInfo.schoolPackage);
        // console.log('listDataPackageOfSemester',listDataPackageOfSemester);
        this.gridApi.setColumnDefs(this.setColumn);
        for (let j = 0; j < listSemesters.length; j++) {
          if (j !== listSemesters.length - 1) {
            if(listDataPackageOfSemester.length>0){
              this.setColumn.push({
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
                tooltipValueGetter: params => {
                  return this.toolTipCreate(params);
                },
                // maxWidth: 140,
                minWidth: 140,
                headerClass: 'margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  console.log(params);
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== null) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[0])
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
              this.setColumn.push({
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
                tooltipValueGetter: params => {
                  return this.toolTipCreate(params);
                },
                // maxWidth: 140,
                minWidth: 140,
                headerClass: 'margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  console.log(params);
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== null) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[0])
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
              this.setColumn.push({
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
                field: 'status5',
                tooltipValueGetter: params => {
                  return this.toolTipCreate(params);
                },
                // maxWidth: 140,
                minWidth: 160,
                headerClass: 'margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  console.log(params);
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== null) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[0])
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
              this.setColumn.push({
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
                field: 'status5',
                tooltipValueGetter: params => {
                  return this.toolTipCreate(params);
                },
                // maxWidth: 140,
                minWidth: 160,
                headerClass: 'margin-left-0',
                suppressMovable: true,
                cellRenderer: (params) => {
                  console.log(params);
                  const element = document.createElement('p');
                  element.className = `package-status ${
                    this.mappingStyleStatus[params.value]
                  }`;
                  if (params.value !== null) {
                    const iconElement = document.createElement('span');
                    iconElement.className = 'fas fa-circle ';
                    element.appendChild(iconElement);
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[params.value])
                    );
                  } else {
                    const iconElement = document.createElement('span');
                    element.appendChild(
                      document.createTextNode(this.mappingStatus[0])
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

  toolTipCreate(params){
    if(params.value !== null){
      return this.mappingStatus[params.value];
    }
    return '';
  }


  loadCurrentYear(): void {
    // console.log('loadCurrentYear');

    this.listSemesters = [];
    this.subscription = this.classRoomService.listYears$.subscribe(
      (listYears) => {
        this.classRoomService.yearCurrent$.subscribe((currentYear) => {
          // console.log('currentYear', currentYear);
          this.currentYear = currentYear;
          this.currentYearObj = listYears.find(
            (_year) => _year.years === this.currentYear
          );

          this.semesterValue = null;


          if (this.currentYearObj) {
            this.semesterAmount = this.currentYearObj.semesterAmount;
            this.loadSemesters();

            this.changeDetectorRef.detectChanges();
          }
          this.changeDetectorRef.detectChanges();
        });
      }
    );
  }


  columnDefs = [
    {
      headerName: this.translate.instant(`PARENT_CONTACT.NUMBER`),
      field: 'make',
      headerClass: 'sy-header-center',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 48,
      maxWidth: 48,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        justify: 'space-between',
        color: '#101840',
        display: 'flex',
        'justify-content': 'center',
      },
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.STUDENT_CODE`),
      field: 'studentCode',
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
      tooltipField: 'studentCode',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.STUDENT_NAME`),
      field: 'fullName',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 200,
      tooltipField: 'fullName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.PHONE`),
      field: 'phone',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 200,
      tooltipField: 'phone',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.GRID.CLASS`),
      field: 'departmentName',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 100,
      tooltipField: 'departmentName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.YEAR`),
      field: 'departmentName',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 200,
      tooltipField: 'departmentName',
      suppressMovable: true,
      resizable: true
    },
    // {
    //   headerName: 'HỌC KỲ I (HS1_21)',
    //   field: 'departmentName',
    //   cellStyle: {
    //     'font-weight': '500',
    //     'font-size': '12px',
    //     'align-items': 'center',
    //     color: '#101840',
    //     top: '12px',
    //     'white-space': 'nowrap',
    //     'text-overflow': 'ellipsis',
    //     overflow: 'hidden',
    //     'border-right': 'none'
    //   },
    //   minWidth: 200,
    //   tooltipField: 'departmentName',
    //   suppressMovable: true,
    //   resizable: true
    // },
    // {
    //   headerName: 'HỌC KỲ II (HS1_21)',
    //   field: 'departmentName',
    //   cellStyle: {
    //     'font-weight': '500',
    //     'font-size': '12px',
    //     'align-items': 'center',
    //     color: '#101840',
    //     top: '12px',
    //     'white-space': 'nowrap',
    //     'text-overflow': 'ellipsis',
    //     overflow: 'hidden',
    //     'border-right': 'none'
    //   },
    //   minWidth: 200,
    //   tooltipField: 'departmentName',
    //   suppressMovable: true,
    //   resizable: true
    // },
    // {
    //   headerName: 'CẢ NĂM (HS1)',
    //   field: 'departmentName',
    //   cellStyle: {
    //     'font-weight': '500',
    //     'font-size': '12px',
    //     'align-items': 'center',
    //     color: '#101840',
    //     top: '12px',
    //     'white-space': 'nowrap',
    //     'text-overflow': 'ellipsis',
    //     overflow: 'hidden',
    //     'border-right': 'none'
    //   },
    //   minWidth: 200,
    //   tooltipField: 'departmentName',
    //   suppressMovable: true,
    //   resizable: true
    // },
  ];
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));

  totalGroupDetails = 0;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  filterText = '';
  regexSpace = /\s(?=\s)/g;
  search: any = {
    page: 0,
    size: 0,
    keySearch: null,
    sort: null,
    parentGroupCode: null
  };
  modalRef: BsModalRef;
  rowSelect: any = {};
  rowIndex;

  constructor(
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private contactGroupParentService: ContactGroupParentService,
    private commonService: CommonServiceService,
    private changeDetectorRef: ChangeDetectorRef,
    private classRoomService : ClassroomService,
    private evaluateConductService : EvaluateConductService,
    private translate: TranslateService,
    private manageContactService: ManageContactService,
  ) {
  }

  ngOnInit(): void {

  }

  // gets called once before the renderer is used
  agInit(params): void {
    this.rowSelect = params.data;
    this.rowIndex = +params.rowIndex + 1;
    this.groupName = this.rowSelect.name;
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true
  }

  openModal(template: TemplateRef<any>) {
    this.filterText = '';
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'view-student-details-list'})
    );
    this.searchGroupContactDetails();
  }

  onGridReady(params) {
    // console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadCurrentYear();
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit()
    }, 50);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  goToPage(page: number): void {
    this.page = page
    this.searchGroupContactDetailsWithPage(this.page);
  }

  prev(): void {
    this.page--
    if (this.page < 1) {
      this.page = 1
      return
    }
    this.searchGroupContactDetailsWithPage(this.page);
  }

  next(): void {
    this.page++
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.searchGroupContactDetailsWithPage(this.page);
  }

  private searchGroupContactDetails() {
    if (this.filterText != null) {
      this.search.keySearch = this.filterText.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.search.parentGroupCode = this.rowSelect.code;
    this.search.currentYear = this.classRoomService.yearCurrent.getValue();
    this.contactGroupParentService.doSearchDetails(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.groupTeacherDetailsList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalGroupDetails = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.totalPage = response.response.totalPages;
        this.first = ((this.page - 1) * this.pageSize) + 1;
        this.last = this.first + this.groupTeacherDetailsList.length - 1;
        if (this.totalGroupDetails % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        setTimeout(() => {
          this.gridApi.sizeColumnsToFit()
        }, 50);
      },
      error => {
        console.log(error);
      }
    );
  }

  searchGroupContactDetailsWithKeySearch() {
    this.pageSize = 10;
    this.page = 1;
    this.searchGroupContactDetails();
  }

  searchGroupContactDetailsWithPage(pages: number) {
    if (this.search.keySearch != null) {
      this.search.keySearch = this.search.keySearch.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.search.parentGroupCode = this.rowSelect.code;
    this.search.currentYearr = this.classRoomService.yearCurrent.getValue();
    this.contactGroupParentService.doSearchDetails(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.groupTeacherDetailsList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalGroupDetails = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.first = ((pages - 1) * this.pageSize) + 1;
        this.last = this.first + this.groupTeacherDetailsList.length - 1;
        if (this.totalGroupDetails % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        this.changeDetectorRef.detectChanges();
      },
      error => {
        console.log(error);
      }
    );
  }

  mappingStatus = {
    0: '-',
    1: this.translate.instant(`PARENT_CONTACT.REGISTER`),
    2: this.translate.instant(`PARENT_CONTACT.ACTIVATED`),
    3: this.translate.instant(`PARENT_CONTACT.PAUSE`),

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

}
