import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr';
import { Teacher } from 'src/app/core/service/model/teacher.model';
import { TeacherService } from 'src/app/core/service/service-model/teacher.service';
import { ActionTeacherComponent } from './action-teacher/action-teacher.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import {NO_ROW_GRID_TEMPLATE, PAGE_SIZE, ROLES_STUDENT_MANAGEMENT, ROLES_TEACHER_MANAGEMENT, TEACHER} from '../../../../helpers/constants';
import { calculateFistLastPageTable, next, pagination, prev } from 'src/app/helpers/utils';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LeaveJobService} from '../../../../core/service/service-model/leave-job.service';
import {DepartmentService} from '../../../../core/service/service-model/unit.service';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'kt-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  @ViewChild('newUnit') public newUnit: ModalDirective;
  @ViewChild('importUnit') public importUnit: ModalDirective;
  modalRef: BsModalRef;
  hide = true;
  columnDefs;
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  defaultColDef;
  selectDemo;
  teacher = new Teacher();
  resultImport;
  listDemo = [
    {
      id: 1,
      name: 'Demo'
    }
  ];
  listDeptParent = [];
  listDeptChild = [];
  listPostion = [];
  listStatus = [
    {
      id: 0,
      name: this.tran('TEACHER.LIST_STATUS.STATUS_WORKING')
    },
    {
      id: 1,
      name: this.tran('TEACHER.LIST_STATUS.STATUS_NOT_WORKING')
    },
    {
      id: 2,
      name: this.tran('TEACHER.LIST_STATUS.STATUS_RETIRED')
    },
    {
      id: 3,
      name: this.tran('TEACHER.LIST_STATUS.STATUS_BREAK')
    }
  ];
  searchObj = {
    deptIdParent: null,
    deptId: null,
    position: null,
    nameCodeSearch: '',
    status: null,
    page: 0,
    pageSize: PAGE_SIZE,
    role: ''
  }
  overlayNoRowsTemplate;
  currentPage = 1;
  total = 0;
  first = 0;
  last = 0;
  totalPage;
  rangeWithDots: number[];
  fileName;
  fileSize;
  isShowImport = false;
  typeUnit;
  typeImportInsert;
  typeImportUpdate;
  selectedFiles;
  formDatas;
  afuConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.pdf,.docx, .txt,.gif,.jpeg',
    maxSize: '5',
    uploadAPI: {
      url: 'https://example-file-upload-api',
      method: 'POST',
      params: {
        page: '1'
      },
      responseType: 'blob',
    },
    theme: 'dragNDrop',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Tải file',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'File có định dạng xlsx, xls, có dung lượng nhỏ hơn 5Mb',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };
  currentRoles = [];
  loginCode;
  isRole: boolean;
  // Role Admin, HT
  ADMIN = `${environment.ROLE.ADMIN}`;
  HT = `${environment.ROLE.HT}`;
  TK = `${environment.ROLE.TK}`;

  formImport: FormGroup;
  firstLoad;
  listStatusTeacher = TEACHER.STATUS;
  listDepartment: [];
  loading = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private teacherService: TeacherService,
    private changeDetectorRef: ChangeDetectorRef,
    private toaStr: ToastrService,
    private leaveJobService: LeaveJobService,
    private departmentService: DepartmentService,
    private translate: TranslateService) {
    this.columnDefs = [
      {
        headerName: this.tran('TEACHER.GRID.NO'),
        valueGetter: param => {
          return param.node.rowIndex + (((this.currentPage - 1) * PAGE_SIZE) + 1)
        },
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          left: '3px'
        },
      },
      {
        headerName: this.tran('TEACHER.GRID.TEACHER_CODE'),
        field: 'code',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#3366FF',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        maxWidth: 126,
        tooltipField: 'code',
      },
      {
        headerName: this.tran('TEACHER.GRID.TEACHER_NAME'),
        field: 'fullName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        tooltipField: 'fullName',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        headerName: this.tran('TEACHER.GRID.SEX'),
        field: 'sexStr',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
        },
        tooltipField: 'sexStr',
        minWidth: 100,
        maxWidth: 100,
      },
      {
        headerName: this.tran('TEACHER.GRID.DEPT_NAME'),
        field: 'deptName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
        },
        tooltipField: 'deptName',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        headerName: this.tran('TEACHER.GRID.POSITION'),
        field: 'positionName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
        },
        tooltipField: 'positionName',
        minWidth: 140,
      },
      {
        headerName: this.tran('TEACHER.GRID.CONTRACT_TYPE'),
        field: 'contractTypeStr',
        cellStyle: {
          color: '#696F8C',
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
        },
        tooltipField: 'contractTypeStr',
        minWidth: 140,
        // resizable: true,
      },
      {
        headerName: this.tran('TEACHER.GRID.STATUS'),
        field: 'statusStr',
        cellStyle: param=>{
          let color = '';
          if(param.data.status === 0)
            color = '#52BD94';
          else if(param.data.status === 1)
            color = '#D14343';
          else if(param.data.status === 2)
            color = '#474D66';
          else
            color = '#F26522'
          return {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
          color: color,
          }
        },
        tooltipField: 'statusStr',
        minWidth: 140,
      },
      {
        headerName: this.tran('TEACHER.GRID.PROFILE'),
        field: 'make',
         // return `<!--<a style='color: #3366FF' href='/laosedu/#/system/teacher/teacher-profile/${param.data.id}'>Xem hồ sơ</a>-->`
        cellRenderer: param => {
          return `<a style='color: #3366FF' href='/laosedu/#/system/teacher/teacher-profile/${param.data.id}'>${this.translate.instant('STUDENT.SHOW_PROFILE')}</a>`
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 130,
      },
      {
        headerName: '',
        field: '',
        cellRendererFramework: ActionTeacherComponent,
        minWidth: 50,
        maxWidth: 50,
      },
    ];
    this.typeImportInsert = 0;
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
    // Check role admin và ht
    this.loginCode = JSON.parse(localStorage.getItem('currentUser')).login;
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      // TODO: this.isRole = true không cho chỉnh sửa
      this.currentRoles.forEach(e=>{
        if(e === this.ADMIN || e === this.HT){
          this.isRole = false;
          return;
        }
      })
    }

    // check role trưởng khoa
    if (this.currentRoles && this.currentRoles.length > 0) {
      this.currentRoles.forEach(e=>{
        if(e === this.TK){
          this.searchObj.role = this.TK;
          return;
        }
      })
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridApi.setRowData(this.rowData);
  }

  ngOnInit(): void {
    setTimeout(this.removeStyle,3000);
    this.isShowImport = true;
    this.formImport = this.fb.group({
      fileImport: ''
    })
    this.currentPage = 1;
    this.firstLoad = true;
    this.loading = false;
    this.getListParent();
    this.listenReload();
    //this.removeStyle();
  }

  getListParent() {
    this.listDeptParent = []
    // Nếu role là trưởng khoa thì
    if(this.searchObj.role === this.TK){
      // Đơn vị, Tổ bộ môn
      this.teacherService.getTeacherByTeacherCode(this.loginCode).subscribe(res=>{
        this.changeDetectorRef.detectChanges();
        this.teacherService.
        getDepartmentsById(res.deptId).subscribe(re=>{
          this.changeDetectorRef.detectChanges();
          this.departmentService.
          apiGetDataTree(re.code, '', '', 0).then((resAPI: []) => {
            this.changeDetectorRef.detectChanges();
            if (resAPI.length > 0) {
              this.listDepartment = resAPI;
              this.listDeptParent = this.listDepartment;
              // @ts-ignore
              this.searchObj.deptIdParent = this.listDepartment[0].id;
              // this.getListChild();
              this.changeDetectorRef.detectChanges();
              // @ts-ignore
              if(this.listDepartment[0].children !== null){
                // @ts-ignore
                this.listDeptChild =  this.listDepartment[0].children;
                // @ts-ignore
                this.searchObj.deptId = this.listDeptChild.id;
                this.getListPosition();
              }else{
                this.getListChild();
              }
            }
          })
        })
      })
      this.page(this.currentPage);
      this.changeDetectorRef.detectChanges();
    }else{
      this.teacherService.getParentDeptNull().then((res: []) => {
        this.changeDetectorRef.detectChanges();
        if (res.length > 0) {
          this.listDeptParent = res;
          this.searchObj.deptIdParent = this.listDeptParent[0].id;
          this.getListChild();
          this.page(this.currentPage);
        }
      })
    }
  }

  openModalImportUnit() {
    this.importUnit.show();
  }

  openModal(template: TemplateRef<any>) {
    this.resultImport = null;
    this.removeFile();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }

  searchData(page?) {
    this.rowData = []
    this.currentPage = page;
    this.searchObj.page = page;
    // Role tk
    this.searchObj.role = null;
    if (this.currentRoles && this.currentRoles.length > 0) {
      this.currentRoles.forEach(e=>{
        if(e === this.TK){
          this.searchObj.role = this.TK;
          return;
        }
      })
    }
    this.hide = false;
    this.teacherService.searchData(this.searchObj).subscribe((res: any) => {
      res.data.map(item => {
        if(item.positionName === null ) return item;
        const positionArr = item.positionName.split(',').filter(word => word !== '');
        console.log(item.positionName)
        item.positionName =  positionArr.length === 1 ? positionArr[0] : positionArr.concat([]);
        console.log(item.positionName)
        // let strPosition = '';
        // item.positionName.forEach(e=>{
        //   if(e === 'ROLE_HT')
        //     strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.PRINCIPAL') + ', ';
        //   else if(e === 'ROLE_HP')
        //     strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.ASSISTANT_PRINCIPAL') + ', ';
        //   else if(e === 'ROLE_TK')
        //     strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.LEADER_DEPARTMENT') + ', ';
        //   else if(e === 'ROLE_GVBM')
        //     strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.TEACHER_SUBJECT') + ', ';
        //   else
        //     strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.TEACHER_HOMEROOM') + ', ';
        // })
        // // const positionArr2 = strPosition.split(',').filter(word => word !== '');
        // item.positionName = strPosition.slice(0, -2);
        return item;
      });
      this.hide = true;
      this.rowData = res.data;
      this.total = res.total;
      this.gridApi.setRowData(this.rowData);
      this.totalPage = Math.ceil(this.total / PAGE_SIZE);
      this.rangeWithDots = pagination(this.currentPage, this.totalPage);
      this.first = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).first;
      this.last = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).last;
      this.changeDetectorRef.detectChanges();
      console.log(this.searchObj)
    })
  }



  getListChild() {
    this.listDeptChild = []
    this.searchObj.deptId = null;
    this.teacherService.getDeptByParent(this.searchObj.deptIdParent).then((res: []) => {
      this.changeDetectorRef.detectChanges();
      if (res.length > 0) {
        // this.listDeptChild = res;
        let list = [];
        res.forEach(item => {
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        });
        this.listDeptChild = list;
      }
      this.getListPosition();
    })
  }

  getListPosition() {
    this.listPostion = []
    this.teacherService.getAuthority().subscribe(res => {
      // this.listPostion = res;
      let list = [];
      res.forEach(item => {
        let customItem = {};
        let posionName = '';
        if(item.code === 'ROLE_HT')
          posionName = this.tran('TEACHER.POSITION_LIST.PRINCIPAL');
        else if(item.code === 'ROLE_HP')
          posionName = this.tran('TEACHER.POSITION_LIST.ASSISTANT_PRINCIPAL');
        else if(item.code === 'ROLE_TK')
          posionName =this.tran('TEACHER.POSITION_LIST.LEADER_DEPARTMENT');
        else if(item.code === 'ROLE_GVBM')
          posionName = this.tran('TEACHER.POSITION_LIST.TEACHER_SUBJECT');
        else
          posionName = this.tran('TEACHER.POSITION_LIST.TEACHER_HOMEROOM');
        customItem = {...item, name: posionName};
        list = [...list, customItem];
      });
      this.listPostion = list;
      this.changeDetectorRef.detectChanges();
    })
  }

  exportTemplate() {
    this.teacherService.exportTemplate();
  }

  exportData() {
    this.hide = false;
    this.teacherService.exportData(this.searchObj);
    this.hide = true;
    this.changeDetectorRef.detectChanges();
  }

  exportDataErrors() {
    if (this.resultImport === undefined) {
      this.toaStr.error(this.tran('TEACHER.IMPORT.NOT_FILE_ERROR'))
      return;
    }
    if (this.resultImport.listErrors.length > 0) {
      this.teacherService.exportDataErrors(this.resultImport.listErrors);
    } else {
      this.toaStr.warning(this.tran('TEACHER.IMPORT.NOT_DATA_ERROR'));
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(file) {
    this.fileName = file[0].name;
    this.fileSize = file[0].size;

    if (file.length === 0) {
      this.toaStr.error(this.tran('TEACHER.IMPORT.NOT_FILE_IMPORT'));
      this.isShowImport = true;
      return;
    }
    if (!(file[0].name.includes('.xlsx') || file[0].name.includes('.xls'))) {
      this.toaStr.error(this.tran('TEACHER.IMPORT.FILE_NOT_FORMAT'));
      this.isShowImport = true;
      return;
    }else if(file[0].size > 5242880){
      this.toaStr.error(this.tran('TEACHER.IMPORT.MAX'));
      this.isShowImport = true;
      return;
    }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formDatas = formData;
    this.isShowImport = false;
  }

  importFile() {
    // this.hide = false;
    this.teacherService.upload(this.formDatas, this.typeImportInsert).subscribe((res: any) => {
      // this.hide = true;
      if (res.data != null) {
        this.resultImport = res.data;
        if (this.resultImport.numberSuccess > 0) {
          // tslint:disable-next-line:max-line-length
          this.toaStr.success(this.tran('TEACHER.IMPORT.SUCCESS') + this.resultImport.numberSuccess + ' / ' + this.resultImport.total + this.tran('TEACHER.IMPORT.RECORD'))
          this.searchData(1);
        } else if (this.resultImport.numberErrors === this.resultImport.total) {
          this.toaStr.error(this.tran('TEACHER.IMPORT.ERROR'));
          // this.hide = true;
          return;
        }
      } else {
        this.toaStr.error(res.message);
      }
    }, err => {
      this.toaStr.error(this.tran('TEACHER.IMPORT.ERROR_FILE_IMPORT'));
    })
  }

  removeFile() {
    this.formImport.get('fileImport').reset();
    this.resultImport = null;
    this.fileName = null;
    this.fileSize = null;
  }

  cancelImport() {
    this.modalRef.hide()
  }

  // paging
  page(page: number): void {
    // this.getListParent();
    this.currentPage = page;
    this.searchData(page);
  }
  prev(): void {
    this.currentPage--;

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    this.page(this.currentPage);
  }

  next(): void {
    this.currentPage++;

    if (this.currentPage > this.totalPage) {
      this.currentPage = this.totalPage;
    }
    this.page(this.currentPage);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    this.removeStyle();
  }

  // reload when change status
  listenReload() {
    this.leaveJobService.isReload$.subscribe(val => {
      if (val) {
        this.page(this.currentPage);
      }
    });
  }
  tran(key): string {
    return this.translate.instant(key)
  }
  removeStyle() {
    var removeStyle = document.querySelector('.ag-center-cols-container') as HTMLElement;
    var currentValue =  removeStyle.style.getPropertyValue('width');
    var newCurrentValueFloat = currentValue.slice(0,-2);
    var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    var newValue = newCurrentValueInt + 16;
    removeStyle.style.width=`${newValue}px`;

 }
}
