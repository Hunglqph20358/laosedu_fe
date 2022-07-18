import {ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TreeviewItem} from 'ngx-treeview';
import {BtnCellRendererComponent} from './btn-cell-renderer.component';
import {ToastrService} from 'ngx-toastr';
import {GroupTeacherDetailsModel} from '../../../../../../core/service/model/group-teacher-details.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactGroupService} from '../../../../../../core/service/service-model/contact-group.service';
import {CommonServiceService} from '../../../../../../core/service/utils/common-service.service';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../../helpers/constants';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @ViewChild('tableAction') tableAction: any;
  groupTeacherAddForm: FormGroup;
  code: string;
  name: string;
  checkCode: boolean;
  checkName: boolean;
  groupTeacherDetailsDTOList: GroupTeacherDetailsModel[];
  groupTeacherDetailsDTOSearchList: GroupTeacherDetailsModel[] = [];
  groupTeacherAfterSearchList: GroupTeacherDetailsModel[] = [];
  gridApi;
  gridColumnApi;
  pattern = /^\S{0,50}$/;
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  public action: string;

  selectAllTitle = this.translate.instant(`CONTACT_GROUP.ALL_SCHOOL`);

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
    globalSearch: null,
    sort: null,
    parentGroupCode: null
  };
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
  listTreeViewTeacherRaw = [];
  columnDefs = [
    {
      headerName: this.translate.instant(`CONTACT_GROUP.NUMBER`),
      field: 'make',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 50,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        display: 'flex',
        'justify-content': 'center',
      },
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`CONTACT_GROUP.TEACHER_CODE`),
      field: 'teacherCode',
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
      tooltipField: 'teacherCode',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`CONTACT_GROUP.TEACHER_NAME`),
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
      headerName: this.translate.instant(`CONTACT_GROUP.UNITS1`),
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
  hide;
  isDelete = false;

  constructor(public ref: MatDialogRef<CreateGroupComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private toast: ToastrService,
              private fb: FormBuilder,
              private contactGroupService: ContactGroupService,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private translate: TranslateService) {
    this.action = data.action;
    this.listTreeViewTeacherRaw = data.listTreeViewTeacherRaw;
    this.items = data.items;
    this.buildForm();
  }

  ngOnInit(): void {
    this.groupTeacherAddForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
    this.loadForm();
    if (this.action === 'edit') {
      this.getGroupTeacherDetailsList();
    }
    this.getListTeacherTreeView();
  }

  // =============== Form edit ========================
  loadForm() {
    if (this.action === 'edit') {
      this.groupTeacherAddForm.get('code').setValue(this.data.code);
      this.groupTeacherAddForm.get('name').setValue(this.data.name);
    }
    this.groupTeacherDetailsDTOList = [];
  }

  treeViewValueChange(e: any) {
    console.log(e);
    this.resultChange = e;
  }

  pushTreeDataToTable() {
    let countMess = 0;
    this.resultChange.filter(r => r.isTeacher).map(r => {
      if (this.groupTeacherDetailsDTOList.find(item => item.teacherCode === r.code)) {
        if (countMess === 0) {
          this.toast.error(this.translate.instant('CONTACT.CONTACT_GROUP.TEACHER_CODE_EXIST'));
        }
        countMess++;
        return;
      }
      if (this.groupTeacherDetailsDTOList.length === 0 || !this.groupTeacherDetailsDTOList.find(item => item.teacherCode === r.code)) {
        const groupTeacherDetailsDTO: GroupTeacherDetailsModel = {};
        groupTeacherDetailsDTO.teacherId = r.id;
        groupTeacherDetailsDTO.teacherCode = r.code;
        groupTeacherDetailsDTO.fullName = r.text;
        groupTeacherDetailsDTO.departmentName = r.deptName;
        this.groupTeacherDetailsDTOList.push(groupTeacherDetailsDTO);
      }
    })
    this.page = 1;
    this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherDetailsDTOList, 10, 1);
    // Paging
    this.pagingData(this.groupTeacherDetailsDTOList, this.page);
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
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit()
    }, 50);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  /********************* QUERY DATA START ************************/
  searchGroupContactDetails() {
    if (this.filterText != null) {
      this.search.globalSearch = this.filterText.replace(this.regexSpace, '').trim();
    }
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    if (this.action === 'edit') {
      this.search.parentGroupCode = this.data.code;
    } else {
      this.search.parentGroupCode = this.code;
      this.search.size = this.pageSize;
    }
    this.contactGroupService.doSearchDetails(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.groupTeacherDetailsDTOList = response.response.content;
        this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherDetailsDTOList, 10, this.page);
        // Paging
        this.pagingData(this.groupTeacherDetailsDTOList, this.page);
      },
      error => {
        console.log(error);
      }
    );
  }

  getGroupTeacherDetailsList() {
    this.search.parentGroupCode = this.data.code;
    this.contactGroupService.getGroupTeacherDetailsList(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.groupTeacherDetailsDTOList = response.response;
        this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherDetailsDTOList, 10, this.page);
        // Paging
        this.pagingData(this.groupTeacherDetailsDTOList, this.page);
      },
      error => {
        console.log(error);
      }
    );
  }

  searchTeacher(filterText: string) {
    if (!this.isDelete) {
      this.page = 1;
      this.pageSize = 10;
    }
    this.groupTeacherAfterSearchList = [];
    this.groupTeacherDetailsDTOSearchList = [];
    this.filterText = filterText?.trim();
    filterText = filterText.trim().toLowerCase();
    this.groupTeacherDetailsDTOList.find(item => {
      if (item.teacherCode.toLowerCase().trim().includes(filterText) ||
        item.fullName.toLowerCase().trim().includes(filterText)) {
        this.groupTeacherAfterSearchList.push(item);
      }
    });
    this.groupTeacherDetailsDTOSearchList = this.groupTeacherAfterSearchList;
    // Paging
    this.pagingData(this.groupTeacherDetailsDTOSearchList, this.page);
  }

  getListTeacherTreeView(): void {
    this.hide = false;
    this.contactGroupService.getListTeacherTreeView().subscribe(res => {
      this.hide = true;
      console.log(res);
      this.listTreeViewTeacherRaw = res.body.response;
      this.items = res.body.response?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true)));
      this.changeDetectorRef.detectChanges();
    })
  }

  transformToTreeViewItems(data: any, isRoot: boolean, parent?: any): any {
    if (isRoot) data.level = 1
    else data.level = parent.level + 1
    const children = (data.children ?? data.teacherDTOList)?.map(child => this.transformToTreeViewItems(child, false, data));
    const text = data.departmentName ?? data.code + ' - ' + data.fullName ?? '';
    const value = {
      code: data.type ?? data.code ?? '',
      id: data.id,
      deptId: data.deptId,
      deptCode: data.deptCode,
      deptName: data.deptName,
      isRoot,
      isTeacher: data.fullName && data.code,
      totalTeachersOfUnit: data.totalTeachersOfUnit,
      text,
      level: data.level
    };
    return {...data, text, value, checked: false, collapsed: true, children};
  }

  /********************* QUERY DATA END ************************/

  /********************* PAGING START ************************/

  goToPage(page: number): void {
    this.page = page;
    if (this.filterText !== null && this.filterText !== '') {
      this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherAfterSearchList, 10, page);
      this.pagingData(this.groupTeacherAfterSearchList, this.page);
    } else {
      this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherDetailsDTOList, 10, page);
      this.pagingData(this.groupTeacherDetailsDTOList, this.page);
    }
    this.isDelete = false;
  }

  prev(): void {
    this.page--
    if (this.page < 1) {
      this.page = 1
      return
    }
    if (this.filterText !== null && this.filterText !== '') {
      this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherAfterSearchList, 10, this.page);
      this.pagingData(this.groupTeacherAfterSearchList, this.page);
    } else {
      this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherDetailsDTOList, 10, this.page);
      this.pagingData(this.groupTeacherDetailsDTOList, this.page);
    }
    this.isDelete = false;
  }

  next(): void {
    this.page++
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    if (this.filterText !== null && this.filterText !== '') {
      this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherAfterSearchList, 10, this.page);
      this.pagingData(this.groupTeacherAfterSearchList, this.page);
    } else {
      this.groupTeacherDetailsDTOSearchList = this.paginate(this.groupTeacherDetailsDTOList, 10, this.page);
      this.pagingData(this.groupTeacherDetailsDTOList, this.page);
    }
    this.isDelete = false;
  }

  pagingData(teacherList: GroupTeacherDetailsModel[], page: number): void {
    this.first = 1;
    this.last = 10;
    this.page = page;
    this.pageSize = 10;
    // tslint:disable-next-line:no-non-null-assertion
    this.totalGroupDetails = teacherList.length;
    const currentList = this.paginate(this.groupTeacherDetailsDTOSearchList, this.pageSize, this.page);
    // tslint:disable-next-line:no-non-null-assertion
    this.first = ((this.page - 1) * this.pageSize) + 1;
    if (this.isDelete) {
      this.last = this.first + currentList.length - 1;
    } else {
      this.last = this.first + this.groupTeacherDetailsDTOSearchList.length - 1;
    }
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
    this.groupTeacherDetailsDTOSearchList = this.paginate(teacherList, this.pageSize, this.page);
    this.gridApi.setRowData(this.groupTeacherDetailsDTOSearchList);
    // this.gridApi.setRowData(this.groupTeacherDetailsDTOSearchList);
    this.isDelete = false;
    this.changeDetectorRef.detectChanges();
  }

  paginate(array, pageSize, pageNumber) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  /********************* PAGING END ************************/

  /********************* CREATE/UPDATE DATA ************************/
  add() {
    if (this.groupTeacherDetailsDTOList.length === 0) {
      this.toast.error(this.translate.instant('CONTACT.CONTACT_GROUP.TEACHER_LIST_NULL'));
    } else {
      const addData: any = {};
      // tslint:disable-next-line:forin
      for (const controlName in this.groupTeacherAddForm.controls) {
        addData[controlName] = this.groupTeacherAddForm.get(controlName).value;
      }
      addData.code = addData.code.trim();
      addData.name = addData.name.trim();
      addData.groupTeacherDetailsDTOList = this.groupTeacherDetailsDTOList;
      if (this.action === 'edit') {
        addData.id = this.data.id;
      }
      console.log(addData)
      // Call API
      this.contactGroupService.add(addData).subscribe(responseAPI => {
        if (responseAPI.status === 'OK') {
          this.ref.close({event: this.action, data: responseAPI});
          this.toast.success(responseAPI.message);
          this.contactGroupService.changeIsDelete(true);
          this.resetData();
        } else if (responseAPI.status === 'BAD_REQUEST') {
          this.toast.error(responseAPI.message);
        }
      });
    }
  }

  update() {
    if (this.groupTeacherDetailsDTOList.length === 0) {
      this.toast.error(this.translate.instant('CONTACT.CONTACT_GROUP.TEACHER_LIST_NULL'));
    } else {
      const addData: any = {};
      // tslint:disable-next-line:forin
      for (const controlName in this.groupTeacherAddForm.controls) {
        addData[controlName] = this.groupTeacherAddForm.get(controlName).value;
      }
      addData.code = addData.code.trim();
      addData.name = addData.name.trim();
      addData.groupTeacherDetailsDTOList = this.groupTeacherDetailsDTOList;
      if (this.action === 'edit') {
        addData.id = this.data.id;
      }
      console.log(addData)
      // Call API
      this.contactGroupService.add(addData).subscribe(responseAPI => {
        if (responseAPI.status === 'OK') {
          this.ref.close({event: this.action, data: responseAPI});
          this.toast.success(responseAPI.message);
          this.contactGroupService.changeIsDelete(true);
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
    this.groupTeacherDetailsDTOList = [];
    this.resultChange = [];
    this.filterText = null;
    this.isDelete = false;
  }

  removeItem(api: any): void {
    debugger
    this.isDelete = true;
    console.log(api);
    const index = this.groupTeacherDetailsDTOList.indexOf(api.data);
    if (index > -1) {
      this.groupTeacherDetailsDTOSearchList.splice(index, 1);
      this.groupTeacherDetailsDTOList.splice(index, 1);
    }
    this.searchTeacher(this.filterText || '');
    if (this.groupTeacherAfterSearchList.length % 10 === 0 && this.page > 1) {
      this.page = this.page - 1;
      this.goToPage(this.page);
    }
  }

}
