import { style } from '@angular/animations';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActionShoolComponent } from './action-shool/action-shool.component';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { SchoolService } from 'src/app/core/service/service-model/school.service';
import { Department } from 'src/app/core/service/model/department.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/core/service/service-model/unit.service';
import * as _ from 'lodash';
import { SchoolServices } from './school.service';
import {forEach} from 'ag-grid-community/dist/lib/utils/array';
import {NO_ROW_GRID_TEMPLATE} from '../../../../helpers/constants';
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'kt-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {
  codeDeptTranslate;
  nameDeptTranslate;
  deptTypeTranslate
  selectTeacherTrans
  selectTrans;

  constructor(private modalService: BsModalService,
              private schoolService: SchoolService,
              public http: HttpClient,
              private deparmentService: DepartmentService,
              private toatr: ToastrService,
              private schoolSv: SchoolServices,
              private translateService: TranslateService) {
    this.translateLanguage();
    this.department = new Department();
    this.noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translateService.instant('PARENTS.NO_INFO'));
    this.typeImportInsert = 0;
    this.autoGroupColumnDefTree = {
      field: 'name',
      headerName: this.translateService.instant('SCHOOL.DEPT_CODE'),
      height: 30,
      tooltipField: 'name',
      tooltip: (value: string): string => value,
      cellRendererParams: {
        innerRenderer(params) {
          return params.data.name;
        },
      }
    }
    this.themeName = 'red-theme';
    this.columnDefs = [
      {
        headerName: this.translateService.instant('SCHOOL.DEPT_CODE'),
        field: 'code',

        hide: true,

        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#5D66FF',
          display: 'flex'
        }
      },
      {
        headerName: this.translateService.instant('TEACHER_RATING.GRID.DEPT_NAME'),
        field: 'name',
        lockPosition: true,
        tooltipField: 'name',
        minWidth:200,
        tooltip: (value: string): string => value,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',

        }
      },
      {
        headerName: this.translateService.instant('SCHOOL.PERSON_CHARGE'),
        field: 'employeeName',
        lockPosition: true,
        tooltipField: 'employeeName',
        tooltip: (value: string): string => value,
        minWidth:200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',

        }
      },
      {
        headerName: this.translateService.instant('SCHOOL.POSITION'),
        lockPosition: true,
        field: 'positionName',
        minWidth:150,
        tooltipField: 'positionName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',

        }
      },
      {
        headerName: this.translateService.instant('SCHOOL.MISSION_DESC'),
        field: 'description',
        lockPosition: true,
        minWidth:300,
        tooltipField: 'description',
        tooltip: (value: string): string => value,

        cellRenderer(params){
           const data = params.data.description;
           let value;
           if(data){
            value = data
           }else{
             value='';
           }
           const html = `<textarea class="text-inner" rows="2" cols="300">${value}</textarea>`;
           return html;
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          top: '10px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',


        }
      },
      {
        headerName: '',
        field: '',
        lockPosition: true,
        minWidth: 40,
        maxWidth: 40,
        cellRendererFramework: ActionShoolComponent,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',

          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
        }


      }
    ];
    this.autoGroupColumnDef = {
      field: 'code',
      lockPosition: true,
      headerName: this.translateService.instant('SCHOOL.DEPT_CODE'),
      cellRendererParams: {
        innerRenderer(params) {
          return params.data.code;
        },
      },
      tooltipField: 'code',
      tooltip: (value: string): string => value,
      minWidth:200,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#3366FF',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'margin-right':'15px'
      }

    };
    this.rowModelType = 'serverSide';
    this.serverSideStoreType = 'partial';
    this.isServerSideGroupOpenByDefault = function (params) {
      return params.rowNode.level < 90;
    };
    this.isServerSideGroupOpenByDefaultTree = function (params) {
      return params.rowNode.level <99;
    };
    this.isServerSideGroup = function (dataItem) {
      return dataItem.group;
    };
    this.getServerSideGroupKey = function (dataItem) {
      return dataItem.code;
    };

    this.defaultColDef = { sortable: true,  resizable: true , lockPosition: true, };

    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      //this.removeStyle();
    }, 500);


  }


  value?: string;
  nodes = [];





  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  @ViewChild('newUnit') public newUnit: ModalDirective;
  @ViewChild('importUnit') public importUnit: ModalDirective;
  @ViewChild('file') file: ElementRef;
  @ViewChild('madonvi') madonvi: ElementRef<HTMLInputElement>;

  modalRef: BsModalRef;
  progress;

  gridApi;
  gridApi1;
  gridCol
  columnDefs;
  defaultColDef;
  autoGroupColumnDef;
  rowModelType;
  serverSideStoreType;
  isServerSideGroupOpenByDefault;
  isServerSideGroupOpenByDefaultTree;
  isServerSideGroup;
  getServerSideGroupKey;
  rowData;

  groupDefaultExpanded;
  getDataPath
  typeUnit;
  typeImportInsert;
  typeImportUpdate;
  selectedFiles;

  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  selectDemo;
  codeSearch;
  nameSearch;
  typeSearch;

  fileName;
  fileSize;
  resultImport;
  department: Department = new Department();
  listPosition = [
    {
      id: 0,
      name: this.translateService.instant('MENU.SCHOOL.PRINCIPAL')
    },
    {
      id: 1,
      name: this.translateService.instant('SCHOOL.ROLE.TP')
    },
    {
      id: 2,
      name: this.translateService.instant('SCHOOL.ROLE.TKB')
    },
    {
      id: 3,
      name: this.translateService.instant('SCHOOL.ROLE.TTBM')
    },
    {
      id: 4,
      name: this.translateService.instant('SCHOOL.ROLE.TBM')
    },
  ];
  afuConfig;
  spaceWhite;
  specicalChar;
  maxLegnthCode;
  autoGroupColumnDefTree;

  columnDefsTree = [];
  listUnitParent = [];
  listTeacher = [];
  rowDataTree;
  gridColumnApiTree;
  gridApiTree;
  gridColTree;
  tooltipShowDelay = 0;
  rowSelection = 'single';
  themeName: string;
  a=false;
  blCode: boolean;
  blName: boolean;
  blType: boolean;
  noRowsTemplate;
  formDatas;

  unitCode;

  isShowImport = false;

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    document.querySelector('#selectedRows').innerHTML =
      selectedRows.length === 1 ? selectedRows[0].athlete : '';
  }
  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    this.removeStyle();
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      this.resizeTwoLastColumns();
    }, 500);
  }

  onGridReadyTree(params) {

    this.gridApiTree = params.api;
    this.gridColumnApiTree = params.columnApi;
    params.api.sizeColumnsToFit();

    this.rowDataTree = [];
    this.deparmentService.apiGetDataTree(this.codeSearch, this.nameSearch, null, 0).then(res => {
      this.rowDataTree = res;
      const fakeServer = createFakeServer(this.rowDataTree);
      const datasource = createServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.showNoRowsOverlay();
    this.rowData = [];
    this.deparmentService.apiGetDataTree(this.codeSearch, this.nameSearch, null, 0).then(res => {
      this.rowData = res;
      const fakeServer = createFakeServer(this.rowData);
      const datasource = createServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    });
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      this.resizeTwoLastColumns();
    }, 1000);
  }
  removeStyle() {
    var removeStyle = document.getElementsByClassName('ag-center-cols-container') as HTMLCollectionOf<HTMLElement>;
    var currentValue =  removeStyle[1].style.getPropertyValue('width');
    var newCurrentValueFloat = currentValue.slice(0,-2);
    var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    var newValue = newCurrentValueInt + 16;
    removeStyle[1].style.width=`${newValue}px`;

 }
  loadingData() {
    this.deparmentService.apiGetDataTree(this.codeSearch, this.nameSearch, null, 0).then(res => {
      this.rowData = res;
      this.rowDataTree = res;
      console.log(res);

      // grid to
      const fakeServer = createFakeServer(this.rowData);
      const datasource = createServerSideDatasource(fakeServer);
      if(this.gridApi){
        this.gridApi.setServerSideDatasource(datasource);
      }

       // grid nho
       const fakeServer1 = createFakeServer(this.rowDataTree);
       const datasource1 = createServerSideDatasource(fakeServer1);
      if(this.gridApiTree){
        this.gridApiTree.setServerSideDatasource(datasource1);
      }


    });
  }

  ngOnInit(): void {
    this.schoolSv.loading.subscribe(loading => {
      this.codeSearch = '';
      this.loadingData();
    });
    this.schoolSv.sideBar.subscribe(a => {
      this.a = a;// dong mo sidebar
    });

    this.getListUnitParent();

    setTimeout(() => {
      this.value = '1001';
    }, 1000);

    setTimeout(this.removeStyle,1500);
  }
  onChange($event: string): void {
    console.log($event);
    this.getTypeUnit($event);
    this.getListTeacher($event);
  }

  openModal(template: TemplateRef<any>) {
    this.department = new Department;
    this.resultImport = null;
    this.getListUnitParent();
    this.removeFile();
    this.getTypeUnit('');
    this.blCode = false;
    this.blName = false;
    this.blType = false;
    this.spaceWhite = false;
    this.maxLegnthCode =false;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );

    document.getElementById('madonvi').focus();
  }
  onCellClicked(event) {
    this.typeSearch = 1;
    this.rowData = [];
    this.unitCode = event.data.code;
    this.deparmentService.apiGetDataTree(event.data.code, this.nameSearch, null, 1).then(res => {
      this.rowData = res;
      this.rowDataTree = res;
      if (this.rowData.length == 0) {
        this.toatr.warning(this.translateService.instant('SCHOOL.MSG.NO_RECORD'));
      }

      const fakeServer = createFakeServer(this.rowData);
      const datasource = createServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);

    });
  }

  searchData(typeSearch) {
    this.rowData = [];
    this.typeSearch = typeSearch;
    this.unitCode = this.codeSearch
    this.deparmentService.apiGetDataTree(this.codeSearch, this.nameSearch, null, typeSearch).then(res => {
      this.rowData = res;
      this.rowDataTree = res;
      if (this.rowData.length === 0) {
        const fakeServer = createFakeServer(this.rowData);
        const datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
        this.gridApi.showNoRowsOverlay();
      } else {
        const fakeServer = createFakeServer(this.rowData);
        const datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      }
    });
  }

  refreshTreeUnit(){
    const fakeServer = createFakeServer(this.rowDataTree);
    const datasource = createServerSideDatasource(fakeServer);
    this.gridApi.setServerSideDatasource(datasource);
  }


  getListUnitParent() {
    this.listUnitParent = [];
    this.deparmentService.apiGetAll().then((res: any) => {
      this.removeExpand(res);
      this.nodes = res;
      console.log('resUpdate',res);
      console.log(this.nodes);

      res.forEach(element => {
        element.nameDisplay = element.code + '-' + element.name;
        this.listUnitParent.push(element);
      });
    });
  }

  getListUnitParentInModelUpdate(){
    this.listUnitParent = [];
    this.deparmentService.apiGetAll().then((res: any) => {
      this.removeExpand(res);
      this.nodes = res;
      console.log(this.nodes);

      res.forEach(element => {
        element.nameDisplay = element.code + '-' + element.name;
        this.listUnitParent.push(element);
      });
    });
  }

  removeExpand(deptList: any) {
    if (deptList.constructor === Array) {
      deptList.map(e => {
        if(e.children === null) {
          e.isLeaf = true;
          return e;
        }else {
          this.removeExpand(e.children);
        }
      });
    }
  }

  getTypeUnit(id) {
    this.typeUnit = []
    this.deparmentService.getTypeUnit(id).then((res: any) => {
      console.log(res);

      this.typeUnit = res;
      if(id != '' && res.length == 1){
        this.department.type = res[0].code;
        this.blType = false;
      }
    }, err => {
      console.log(err)
    })
  }

  getListTeacher(id) {
    this.listTeacher = []
    this.deparmentService.getTeacherByDept(id).then((res: any) => {
      this.listTeacher = res;
    }, err => {
      console.log(err)
    })
  }

  validate() {
    this.blCode = false;
    this.blName = false;
    this.blType = false;
    let check = false;
    this.spaceWhite = false;
    this.maxLegnthCode = false;
    if(_.isNil(this.department.code)){
      this.blCode = true;
      this.spaceWhite = false;
      check = true;
    }else{
      if (_.isNil(this.department.code.trim()) || _.isEmpty(this.department.code.trim())) {
        this.blCode = true;
        this.spaceWhite = false;
        check = true;
      }
    }
    if (!this.blCode) {
      if(this.department.code?.trim().indexOf(' ') !== -1){
        this.spaceWhite = true;
        this.blCode = false;
        this.maxLegnthCode = false;
        check = true;
      }
      // else if(/^[!@#$%^&*()<>\?"\]\[|'~_:,.+-={}]{1,250}$/.test(this.department.code?.trim())){
      //   this.spaceWhite = false;
      //   this.specicalChar = true;
      //   this.blCode = false;
      //   this.maxLegnthCode = false;
      //   check = true;
      // }
      else if (this.department.code?.length > 50) {
        this.spaceWhite = false;
        this.blCode = false;
        this.maxLegnthCode = true;
        check = true;
      }
    }
    // tslint:disable-next-line:max-line-length
    if ((!_.isNil(this.department.code) || !_.isEmpty(this.department.code)) && _.size(this.department.code) > 50 || this.spaceWhite) {
      check = true;
    }
    if(_.isNil(this.department.name)){
      this.blName = true;
      check = true;
    }else{
      if (_.isNil(this.department.name.trim()) || _.isEmpty(this.department.name.trim())) {
        this.blName = true;
        check = true;
      }
    }

    if ((!_.isNil(this.department.name) || !_.isEmpty(this.department.name)) && _.size(this.department.name) > 250) {
      check = true;
    }
    if (_.isNil(this.department.type) || _.isEmpty(this.department.type)) {
      this.blType = true;
      check = true;
    }
    if ((!_.isNil(this.department.description) || !_.isEmpty(this.department.description)) && _.size(this.department.description) > 550) {
      check = true;
    }
    console.log(check);
    return check;
  }

  create() {
    if (!this.validate()) {
      // hard code create_name
      this.department.createdName = 'test'
      this.deparmentService.addDepartment(this.department).subscribe(res => {
        if(res.status === 'BAD_REQUEST'){
          this.toatr.error(res.message);
        }else{
          this.toatr.success(res.message);
          this.modalRef.hide();
          this.loadingData();
          // setTimeout(() => {
          //   this.refreshTreeUnit();
          // }, 1000);
        }
      }, err => {
        this.toatr.error(this.translateService.instant('SCHOOL.MSG.ADD_FAIL'));
      })
    };
  }

  // changeUnit() {
  //   this.getTypeUnit(this.department.parentId);
  //   this.getListTeacher(this.department.parentId);
  // }

  exportTemplate() {
    this.deparmentService.exportTemplate(this.translateService.instant('SCHOOL.FILE_NAME_EXPORT'));
  }

  exportData() {
    const dept = new Department();
    dept.code = this.unitCode
    dept.name = this.nameSearch
    dept.typeSearch = this.typeSearch == undefined ? 0 : this.typeSearch;
    this.deparmentService.exportData(this.rowData, this.translateService.instant('SCHOOL.FILE_NAME_EXPORT'));
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  upload(file) {

    this.fileName = file[0].name;
    this.fileSize = file[0].size;

    if (file.length === 0) {
      this.toatr.error(this.translateService.instant('SCHOOL.MSG.FILE_IMPORT_EMPTY'))
      this.isShowImport = true;
      return;
    }
    if(!(file[0].name.includes('.xlsx') || file[0].name.includes('.xls'))){
      this.toatr.error(this.translateService.instant('SCHOOL.MSG.FILE_NOT_FORMAT'));
      this.isShowImport = true;
      return;
    }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formDatas = formData;
    this.isShowImport = false;
  }

  importFile() {
    this.deparmentService.upload(this.formDatas, this.typeImportInsert).subscribe((res: any) => {
      console.log(res)
      this.resultImport = res;
      this.file = null;
      if(this.resultImport.numberSuccess > 0){
        this.toatr.success(this.translateService.instant('TEACHER_RATING.IMPORT.SUCCESS')+ ' ' +
          this.resultImport.numberSuccess + '/' +
          this.resultImport.total + ' ' +
          this.translateService.instant('TEACHER_RATING.IMPORT.RECORD')
        )
      }else if(this.resultImport.numberErrors == this.resultImport.total){
        this.toatr.error(this.translateService.instant('TEACHER_RATING.IMPORT.ERROR') + ' '
          + this.resultImport.numberErrors + '/' +
          this.resultImport.total + ' ' +
          this.translateService.instant('TEACHER_RATING.IMPORT.RECORD')
        )
        return;
      }
      this.loadingData();
    }, err => {
      console.log(err)
      this.toatr.error(this.translateService.instant('SCHOOL.MSG.IMPORT_FAIL'))
    })
  }

  removeFile() {
    this.resultImport = null;
    this.file = null;
    this.fileName = null;
    this.fileSize = null;
  }

  exportDataErrors() {
    if (this.resultImport === undefined) {
      this.toatr.error(this.translateService.instant('SCHOOL.MSG.REQUIRED_IMPORT'))
      return;
    }
    if (this.resultImport.listErrors.length > 0) {
      this.deparmentService.exportDataErrors(this.resultImport.listErrors);
    } else {
      this.toatr.warning(this.translateService.instant('SCHOOL.MSG.NO_DATA_ERR'))
    }
  }

  cancelImport() {
    this.file = null;
    this.modalRef.hide()
  }

  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  translateLanguage() {
    this.codeDeptTranslate = this.translateService.instant('SCHOOL.DEPT_CODE');
    this.nameDeptTranslate = this.translateService.instant('TEACHER_RATING.GRID.DEPT_NAME')
    this.deptTypeTranslate = this.translateService.instant('SCHOOL.DEPT_TYPE')
    this.selectTeacherTrans = this.translateService.instant('SCHOOL.SELECT_TEACHER');
    this.selectTrans = this.translateService.instant('SCHOOL_SUBJECT.SELECTION');
  }



  resizeTwoLastColumns(): void {
    const wrapper = (document.querySelector('.ag-center-cols-viewport') as HTMLElement)
    const body = (document.querySelector('.ag-center-cols-container') as HTMLElement)
    console.log(wrapper);
    setTimeout(() => body.style.minWidth = `${wrapper.offsetWidth}px`);
  }

}


function createFakeServer(fakeServerData) {
  function FakeServer(allData) {
    this.data = allData;
  }
  FakeServer.prototype.getData = function (request) {
    function extractRowsFromData(groupKeys, data) {
      if (groupKeys.length === 0) {
        return data.map(function (d) {
          return {
            group: !!d.children,
            employeeName: d.employeeName,
            name: d.name,
            code: d.code,
            id: d.id,
            parentId: d.parentId,
            description: d.description,
            position: d.position,
            positionName: d.positionName,
            type:d.type,
            employeeId:d.employeeId
          };
        });
      }
      const key = groupKeys[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i].code === key) {
          return extractRowsFromData(
            groupKeys.slice(1),
            data[i].children.slice()
          );
        }
      }
    }
    return extractRowsFromData(request.groupKeys, this.data);
  };
  return new FakeServer(fakeServerData);
}


function createServerSideDatasource(fakeServer) {
  function ServerSideDatasource(fakeServer) {
    this.fakeServer = fakeServer;
  }
  ServerSideDatasource.prototype.getRows = function (params) {
    console.log('ServerSideDatasource.getRows: params = ', params);
    const allRows = this.fakeServer.getData(params.request);
    const request = params.request;
    const doingInfinite = request.startRow != null && request.endRow != null;
    const result = doingInfinite
      ? {

        rowData: allRows.slice(request.startRow, request.endRow),
        rowCount: allRows.length,
      }
      : { rowData: allRows };
    console.log('getRows: result = ', result);
    setTimeout(function () {
      params.success(result);
    }, 200);
  };
  return new ServerSideDatasource(fakeServer);
}
