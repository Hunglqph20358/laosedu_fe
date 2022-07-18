import {ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TreeviewItem} from 'ngx-treeview';
import {ToastrService} from 'ngx-toastr';
import {GroupTeacherDetailsModel} from '../../../../../../core/service/model/group-teacher-details.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonServiceService} from '../../../../../../core/service/utils/common-service.service';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../../helpers/constants';
import {TranslateService} from '@ngx-translate/core';
import {BtnCellRendererComponent} from "../../../contact/contact-group/create-group/btn-cell-renderer.component";
import {ContactGroupParentService} from "../../../../../../core/service/service-model/contact-parent-group.service";
import {ClassroomService} from "../../../../../../core/service/service-model/classroom.service";
import { Subscription } from 'rxjs';
import { EvaluateConductService } from 'src/app/core/service/service-model/evaluate-conduct.service';
import { ManageContactService } from 'src/app/core/service/service-model/manage-contact.service';

@Component({
  selector: 'kt-create-group-parents',
  templateUrl: './create-group-parents.component.html',
  styleUrls: ['./create-group-parents.component.scss']
})
export class CreateGroupParentsComponent implements OnInit {
  @ViewChild('tableAction') tableAction: any;
  groupTeacherAddForm: FormGroup;
  code: string;
  name: string;
  checkCode: boolean;
  checkName: boolean;

  selectAllTitle = this.translate.instant(`PARENT_CONTACT.ALL_SCHOOL`);

  groupStudents: any[];
  groupTeacherDetailsDTOSearchList: any[] = [];
  gridApi;
  gridColumnApi;
  pattern = /^\S{0,50}$/;
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  public action: string;
  totalGroupDetails = 0;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  filterText = null;
  regexSpace = /\s(?=\s)/g;
  search: any = {
    page: 0,
    size: 0,
    currentYear: null,
    keySearch: null,
    sort: null,
    parentGroupCode: null
  };
  currentYear
  resultChange = [];
  items: any = []
  config1 = {
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 300,
    hasSelectByGroup: false,
    selectByGroupValue: false,
    checkboxEnabled: true,
    showCheckbox: true,
    allSchool: false
  }
  hide;
  listTreeViewTeacherRaw = [];
  listSemesters = [];
  subscription: Subscription;
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
      minWidth: 100,
      tooltipField: 'className',
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
    {
      headerName: '',
      field: '',
      cellRendererFramework: BtnCellRendererComponent,
      cellRendererParams: {
        clicked: this.removeItem.bind(this)
      },
      minWidth: 40,
      suppressMovable: true,
    },
  ];

  constructor(public ref: MatDialogRef<CreateGroupParentsComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private toast: ToastrService,
              private fb: FormBuilder,
              private contactGroupParentService: ContactGroupParentService,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private translate: TranslateService,
              private evaluateConductService : EvaluateConductService,
              private manageContactService: ManageContactService) {
    this.action = data.action;
    this.listTreeViewTeacherRaw = data.listTreeViewTeacherRaw;
    this.items = data.items;
    console.log(data);
    this.buildForm();
  }

  ngOnInit(): void {
    this.groupTeacherAddForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
    this.loadForm();
    if (this.action === 'edit') {
      this.searchGroupContactDetails();
    }
    this.getListParentsTreeView();
  }

  // =============== Form edit ========================
  loadForm() {
    if (this.action === 'edit') {
      this.groupTeacherAddForm.get('code').setValue(this.data.code);
      this.groupTeacherAddForm.get('name').setValue(this.data.name);
    }
    this.groupStudents = [];
  }

  treeViewValueChange(e: any) {
    console.log(e);
    this.resultChange = e;
  }

  pushTreeDataToTable() {
    let countMess = 0;
    console.log('this.resultChange',this.resultChange);
    console.log('this.groupStudents',this.groupStudents);
    this.resultChange.filter(r => r.isTeacher).map(r => {
      if (this.groupStudents.find(item => item.studentCode === r.isTeacher)) {
        if (countMess === 0) {
          this.toast.error(this.translate.instant('CONTACT.CONTACT_GROUP.STUDENT_CODE_EXIST'));
        }
        countMess++;
        return;
      }
      if (this.groupStudents.length === 0 || !this.groupStudents.find(item => item.code === r.isTeacher)) {
        console.log(r)
        const groupStudent: any = {};
        groupStudent.className = r.groupName;
        groupStudent.studentCode = r.isTeacher;
        groupStudent.fullName = r.data.fullName;
        groupStudent.studentId = r.data.id;
        groupStudent.phone = r.data.phone
        groupStudent.departmentName = r.data.currentYear
        groupStudent.status1 = r.data.status1;
        groupStudent.status2 = r.data.status2;
        groupStudent.status3 = r.data.status3;
        groupStudent.status4 = r.data.status4;
        groupStudent.status5 = r.data.status5;
        groupStudent.currentYear = r.data.currentYear;

        // groupStudent.departmentName = r.deptName;
        this.groupStudents.push(groupStudent);
      }
    })
    // this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupStudents, 10, 1);
    // Paging
    this.searchTeacher(this.filterText, this.page);
  }

  onRowSelected(event) {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
  }

  onDelete(api): void {
    console.log(api);
  }

  buildForm() {
    this.groupTeacherAddForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  listenCode(control: string) {
    const keyword = this.groupTeacherAddForm.controls[control].value;
    this.groupTeacherAddForm.controls[control].setValue(keyword.trim());
  }

  onGridReady(params) {
    console.log(params);
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

  loadCurrentYear(): void {
    // console.log('loadCurrentYear');

    this.listSemesters = [];
    this.subscription = this.classroomService.listYears$.subscribe(
      (listYears) => {
        this.classroomService.yearCurrent$.subscribe((currentYear) => {
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
        this.setColumn.push(
          {
            headerName: '',
            field: '',
            cellRendererFramework: BtnCellRendererComponent,
            cellRendererParams: {
              clicked: this.removeItem.bind(this)
            },
            minWidth: 40,
            maxWidth: 40,
            suppressMovable: true,
          },
        )
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

  /********************* QUERY DATA START ************************/
  searchGroupContactDetails() {
    if (this.filterText != null) {
      this.search.keySearch = this.filterText.replace(this.regexSpace, '').trim();
    } else {
      this.search.keySearch = '';
    }
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.search.currentYear = this.classroomService.yearCurrent.getValue();
    if (this.action === 'edit') {
      this.search.parentGroupCode = this.data.code;
    } else {
      this.search.parentGroupCode = this.code;
      this.search.size = this.pageSize;
    }
    this.search.size = 1000;
    this.contactGroupParentService.doSearchDetails(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.groupStudents = response.response.content;
        this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupStudents, 10, this.page);
        // Paging
        console.log(this.groupTeacherDetailsDTOSearchList);
        this.pagingData(this.groupStudents, this.page);
      },
      error => {
        console.log(error);
      }
    );
  }

  searchTeacher(filterText: string, page) {
    this.page = page;
    const listAfterSearch: any[] = [];
    console.log('1',this.groupStudents);
    this.groupStudents.find(item => {
      if (filterText == null || item.studentCode?.toLowerCase().trim().includes(filterText?.toLowerCase()?.trim()) ||
        item.fullName.toLowerCase().trim().includes(filterText?.toLowerCase()?.trim()) ||
        filterText?.trim() === '') {
        listAfterSearch.push(item);
      }
    });
    this.groupTeacherDetailsDTOSearchList = listAfterSearch;
    console.log('2',this.groupTeacherDetailsDTOSearchList);
    // Paging
    this.pagingData(this.groupTeacherDetailsDTOSearchList, this.page);
  }
  getListParentsTreeView(): void {
    this.hide = false;
    this.currentYear = this.classroomService.yearCurrent.getValue();
      this.contactGroupParentService.getListParentTreeView(this.currentYear).subscribe(res => {
        this.hide = true;
        console.log('resTree',res);
        this.listTreeViewTeacherRaw = res.body.response;
        this.items = res.body.response?.gradeList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true)));
        this.changeDetectorRef.detectChanges();
      })
  }

  transformToTreeViewItems(data: any, isRoot: boolean, parent?: any): any {
    if (isRoot) data.level = 1
    else data.level = parent.level + 1
    const children = (data.classRoomList ?? data.studentList)?.map(child => this.transformToTreeViewItems(child, false, data));
    const text = data.name ?? data.code+'-'+data.fullName ?? '';
    const groupName = parent?.name ?? '';
    const value = {
      groupName: groupName ?? '',
      groupCode: parent?.code  ?? '',
      isRoot,
      isTeacher: data.fullName && data.code,
      // totalTeachersOfUnit: data.studentOfClassroomTotal,
      data,
      text,
      level: data.level
    };
    return {...data, text, value, checked: false, collapsed: true, children};
  }

  /********************* QUERY DATA END ************************/

  /********************* PAGING START ************************/

  goToPage(page: number): void {
    this.page = page;
    // this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupStudents, 10, page);
    // this.pagingData(this.groupStudents, this.page);
    this.searchTeacher(this.filterText, this.page);
  }

  prev(): void {
    this.page--
    if (this.page < 1) {
      this.page = 1
      return
    }
    // this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupStudents, 10, this.page);
    // this.pagingData(this.groupStudents, this.page);
    this.searchTeacher(this.filterText, this.page);
  }

  next(): void {
    this.page++
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    // this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupStudents, 10, this.page);
    // this.pagingData(this.groupStudents, this.page);
    this.searchTeacher(this.filterText, this.page);
  }

  pagingData(teacherList: GroupTeacherDetailsModel[], page: number): void {
    this.first = 1;
    this.last = 10;
    this.page = page;
    this.pageSize = 10;
    // tslint:disable-next-line:no-non-null-assertion
    this.totalGroupDetails = teacherList.length;
    this.groupTeacherDetailsDTOSearchList = this.groupTeacherDetailsDTOSearchList.slice((this.page - 1) * this.pageSize, this.page  * this.pageSize);
    // tslint:disable-next-line:no-non-null-assertion
    this.first = ((this.page - 1) * this.pageSize) + 1;
    this.last = this.first + this.groupTeacherDetailsDTOSearchList.length - 1;
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
    this.gridApi.setRowData(this.groupTeacherDetailsDTOSearchList);
    this.changeDetectorRef.detectChanges();
  }

  paginate(array, pageSize, pageNumber) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  /********************* PAGING END ************************/

  /********************* CREATE/UPDATE DATA ************************/
  add() {
    if(this.groupStudents.length === 0){
      this.toast.error(this.translate.instant('PARENT_CONTACT.CONTACT_GROUP.STUDENT_LIST_NULL'));
    }else{
      const addData: any = {};
      // tslint:disable-next-line:forin
      for (const controlName in this.groupTeacherAddForm.controls) {
        addData[controlName] = this.groupTeacherAddForm.get(controlName).value;
      }
      addData.code = addData.code.trim();
      addData.name = addData.name.trim();
      addData.groupParentsDetailsDTOList = this.groupStudents;
      if (this.action === 'edit') {
        addData.id = this.data.id;
      }
      console.log(addData)
      // Call API
      this.contactGroupParentService.add(addData).subscribe(responseAPI => {
        if (responseAPI.status === 'OK') {
          this.ref.close({event: this.action, data: responseAPI});
          this.toast.success(responseAPI.message);
          this.contactGroupParentService.changeIsDelete(true);
          this.resetData();
        } else if (responseAPI.status === 'BAD_REQUEST') {
          this.toast.error(responseAPI.message);
        }
      });
    }
  }

  update() {
    if(this.groupStudents.length === 0){
      this.toast.error(this.translate.instant('PARENT_CONTACT.CONTACT_GROUP.STUDENT_LIST_NULL'));
    }else{
      const addData: any = {};
      // tslint:disable-next-line:forin
      for (const controlName in this.groupTeacherAddForm.controls) {
        addData[controlName] = this.groupTeacherAddForm.get(controlName).value;
      }
      addData.code = addData.code.trim();
      addData.name = addData.name.trim();
      addData.groupParentsDetailsDTOList = this.groupStudents;
      if (this.action === 'edit') {
        addData.id = this.data.id;
      }
      console.log(addData)
      // Call API
      this.contactGroupParentService.add(addData).subscribe(responseAPI => {
        if (responseAPI.status === 'OK') {
          this.ref.close({event: this.action, data: responseAPI});
          this.toast.success(responseAPI.message);
          this.contactGroupParentService.changeIsDelete(true);
          this.resetData();
        } else if (responseAPI.status === 'BAD_REQUEST') {
          this.toast.error(responseAPI.message);
        }
      });
    }
  }

  /********************* CREATE/UPDATE DATA ************************/

  resetData() {
    this.code = null;
    this.name = null;
    this.groupTeacherDetailsDTOSearchList = [];
    this.groupStudents = [];
    this.resultChange = [];
    this.filterText = null;
    this.first = 0
    this.last = 0
    this.totalGroupDetails = 0
  }

  removeItem(api: any): void {
    console.log(api);
    const index = this.groupTeacherDetailsDTOSearchList.indexOf(api.data);
    const index1 = this.groupStudents.indexOf(api.data);
    if (index > -1) {
      this.groupTeacherDetailsDTOSearchList.splice(index, 1);
      this.groupStudents.splice(index1, 1);
    }
    if (this.groupStudents.length % 10 === 0 && this.page > 1) {
      this.page = this.page -1;
      this.searchTeacher(this.filterText,this.page);
    } else {
        // this.pagingData(this.groupStudents, this.page);
        this.searchTeacher(this.filterText, this.page);
    }
  }

  mappingStatus = {
    0: '-',
    1: this.translate.instant(`MANAGE_CONTACT.REGISTERED`),
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
}
