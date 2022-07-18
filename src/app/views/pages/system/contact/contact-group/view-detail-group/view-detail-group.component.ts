import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {MatDialog} from '@angular/material/dialog';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {GroupTeacherDetailsModel} from '../../../../../../core/service/model/group-teacher-details.model';
import {ContactGroupService} from '../../../../../../core/service/service-model/contact-group.service';
import {CommonServiceService} from '../../../../../../core/service/utils/common-service.service';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../../helpers/constants';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-view-detail-group',
  templateUrl: './view-detail-group.component.html',
  styleUrls: ['./view-detail-group.component.scss']
})
export class ViewDetailGroupComponent implements OnInit, ICellRendererAngularComp {
  @ViewChild('searchGroupDetail') private elementRef: ElementRef;
  groupTeacherDetailsList: GroupTeacherDetailsModel[] = [];
  headerHeight = 56;
  rowHeight = 50;
  gridApi;
  gridColumnApi;
  groupName: string;
  columnDefs = [
    {
      headerName: this.translate.instant(`CONTACT_GROUP.NUMBER`),
      field: 'make',
      headerClass: 'sy-header-center header-style',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 10,
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
      minWidth: 150,
      tooltipField: 'teacherCode',
      suppressMovable: true,
    },
    {
      headerName: this.translate.instant(`CONTACT_GROUP.NAME`),
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
      minWidth: 220,
      tooltipField: 'fullName',
      suppressMovable: true,
    },
    {
      headerName: this.translate.instant(`CONTACT_GROUP.UNITS`),
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
      minWidth: 120,
      tooltipField: 'departmentName',
      suppressMovable: true,
    }
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
    globalSearch: null,
    sort: null,
    parentGroupCode: null
  };
  modalRef: BsModalRef;
  rowSelect: any = {};
  rowIndex;

  constructor(
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private contactGroupService: ContactGroupService,
    private commonService: CommonServiceService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
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
    setTimeout(this.removeStyle, 1000)
    this.filterText = '';
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'addnew-unit-md modal-dialog-custom view-teacher-details-list'})
    );
    this.searchGroupContactDetails();
  }

  onGridReady(params) {
    console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit()
    }, 50);
    this.removeStyle()
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
      this.search.globalSearch = this.filterText.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.search.parentGroupCode = this.rowSelect.code;
    this.contactGroupService.doSearchDetails(this.search).subscribe(
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
          this.removeStyle()
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
    if (this.search.globalSearch != null) {
      this.search.globalSearch = this.search.globalSearch.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.search.parentGroupCode = this.rowSelect.code;
    this.contactGroupService.doSearchDetails(this.search).subscribe(
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

  removeStyle() {
    const removeStyle = document.querySelector('.detail .ag-center-cols-container') as HTMLElement;
    const currentValue =  removeStyle.style.getPropertyValue('width');
    console.log(currentValue);
    const newCurrentValueFloat = currentValue.slice(0,-2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    const newValue = newCurrentValueInt + 15;
    console.log(newValue)
    removeStyle.style.width=`${newValue}px`;
    console.log(removeStyle.style.width);
  }
}
